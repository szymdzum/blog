import type { BlogPost } from "./posts";

interface LlmsItem {
  title: string;
  description: string;
  link: string;
}

interface LlmsFullItem extends LlmsItem {
  pubDate: Date;
  category: string;
  body: string;
}

interface LlmsTxtConfig {
  name: string;
  description: string;
  site: string;
  items: LlmsItem[];
  optional?: LlmsItem[];
}

interface LlmsFullTxtConfig {
  name: string;
  description: string;
  author: string;
  site: string;
  items: LlmsFullItem[];
}

function textResponse(content: string): Response {
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function llmsTxt(config: LlmsTxtConfig): Response {
  const lines = [
    `# ${config.name}`,
    "",
    `> ${config.description}`,
    "",
    "## Posts",
    "",
    ...config.items.map(
      (item) => `- [${item.title}](${config.site}${item.link}): ${item.description}`,
    ),
  ];

  if (config.optional?.length) {
    lines.push("", "## Optional", "");
    for (const item of config.optional) {
      lines.push(`- [${item.title}](${config.site}${item.link}): ${item.description}`);
    }
  }

  lines.push("");
  return textResponse(lines.join("\n"));
}

function stripMdxSyntax(content: string): string {
  return content
    .replace(/^import\s+.*from\s+['"].*['"];?\s*$/gm, "")
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "")
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, "")
    .trim();
}

export function llmsFullTxt(config: LlmsFullTxtConfig): Response {
  const lines = [
    `# ${config.name}`,
    "",
    `> ${config.description}`,
    "",
    `Author: ${config.author}`,
    `Site: ${config.site}`,
    "",
    "---",
    "",
  ];

  for (const item of config.items) {
    const cleanBody = stripMdxSyntax(item.body);
    lines.push(
      `## ${item.title}`,
      "",
      `URL: ${config.site}${item.link}`,
      `Published: ${item.pubDate.toISOString().split("T")[0]}`,
      `Category: ${item.category}`,
      "",
      `> ${item.description}`,
      "",
      cleanBody,
      "",
      "---",
      "",
    );
  }

  return textResponse(lines.join("\n"));
}

interface LlmsPostConfig {
  post: BlogPost;
  site: string;
  link: string;
}

export function llmsPost(config: LlmsPostConfig): Response {
  const { post, site, link } = config;
  const cleanBody = stripMdxSyntax(post.body ?? "");

  const lines = [
    `# ${post.data.title}`,
    "",
    `> ${post.data.description}`,
    "",
    `URL: ${site}${link}`,
    `Published: ${post.data.pubDate.toISOString().split("T")[0]}`,
    `Category: ${post.data.category}`,
    "",
    cleanBody,
    "",
  ];

  return textResponse(lines.join("\n"));
}

export function postsToLlmsItems(
  posts: BlogPost[],
  formatUrl: (slug: string) => string,
): LlmsItem[] {
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    link: formatUrl(post.slug),
  }));
}

export function postsToLlmsFullItems(
  posts: BlogPost[],
  formatUrl: (slug: string) => string,
): LlmsFullItem[] {
  return posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    link: formatUrl(post.slug),
    pubDate: post.data.pubDate,
    category: post.data.category,
    body: post.body ?? "",
  }));
}
