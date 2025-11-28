const SCROLL_OFFSET = 100;
const HEADING_SELECTOR = "article h2[id]";
const TOC_LINK_SELECTOR = ".toc a";

function getHeadings(): HTMLHeadingElement[] {
  return Array.from(document.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR));
}

function getTocLinks(): NodeListOf<HTMLAnchorElement> {
  return document.querySelectorAll<HTMLAnchorElement>(TOC_LINK_SELECTOR);
}

function clearActiveStates(links: NodeListOf<HTMLAnchorElement>): void {
  links.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });
}

function activateLink(id: string): void {
  const link = document.querySelector<HTMLAnchorElement>(`${TOC_LINK_SELECTOR}[href="#${id}"]`);
  if (link) {
    link.classList.add("active");
    link.setAttribute("aria-current", "true");
  }
}

function findCurrentHeading(headings: HTMLHeadingElement[], scrollY: number): string | undefined {
  let currentId = headings[0]?.id;

  for (const heading of headings) {
    if (heading.offsetTop <= scrollY + SCROLL_OFFSET) {
      currentId = heading.id;
    } else {
      break;
    }
  }

  return currentId;
}

function createScrollHandler(
  headings: HTMLHeadingElement[],
  links: NodeListOf<HTMLAnchorElement>,
): () => void {
  return () => {
    const currentId = findCurrentHeading(headings, window.scrollY);
    if (currentId) {
      clearActiveStates(links);
      activateLink(currentId);
    }
  };
}

function initTableOfContents(): void {
  const headings = getHeadings();
  const tocLinks = getTocLinks();

  if (headings.length === 0 || tocLinks.length === 0) return;

  const handleScroll = createScrollHandler(headings, tocLinks);

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

initTableOfContents();
