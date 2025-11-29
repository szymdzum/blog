import type { APIRoute } from "astro";
import { siteConfig } from "@/site-config";
import { llmsTxt, postsToLlmsItems } from "@utils/llms";
import { getAllPosts } from "@utils/posts";

const formatLlmsUrl = (slug: string) => `/llms/${slug}.txt`;

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  return llmsTxt({
    name: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.url,
    items: postsToLlmsItems(posts, formatLlmsUrl),
    optional: [
      { title: "About", link: "/about", description: "About the author" },
      { title: "RSS Feed", link: "/rss.xml", description: "Subscribe to updates" },
      {
        title: "Full Content",
        link: "/llms-full.txt",
        description: "Complete post content for deeper context",
      },
    ],
  });
};
