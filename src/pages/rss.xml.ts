import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteConfig } from "@/site-config";
import { formatUrl } from "@utils/path";
import { getAllPosts } from "@utils/posts";

export const GET: APIRoute = async (context) => {
  const posts = await getAllPosts();
  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site!,
    items: posts.map((post) => ({
      ...post.data,
      link: formatUrl(post.slug),
    })),
  });
};
