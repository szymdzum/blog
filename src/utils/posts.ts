import { type CollectionEntry, getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

const WORDS_PER_MINUTE = 200;

function sortByDateDescending(a: BlogPost, b: BlogPost): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.sort(sortByDateDescending);
}

export function estimateReadingTime(content: string): number {
  return Math.ceil(countWords(content) / WORDS_PER_MINUTE);
}
