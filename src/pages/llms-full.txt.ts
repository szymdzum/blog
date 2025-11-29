import type { APIRoute } from "astro";
import { siteConfig } from "@/site-config";
import { llmsFullTxt, postsToLlmsFullItems } from "@utils/llms";
import { formatUrl } from "@utils/path";
import { getAllPosts } from "@utils/posts";

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  return llmsFullTxt({
    name: siteConfig.name,
    description: siteConfig.description,
    author: siteConfig.author,
    site: siteConfig.url,
    items: postsToLlmsFullItems(posts, formatUrl),
  });
};
