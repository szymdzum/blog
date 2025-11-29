import type { GetStaticPaths } from "astro";
import { siteConfig } from "@/site-config";
import { llmsPost } from "@utils/llms";
import { formatUrl } from "@utils/path";
import { type BlogPost, getAllPosts } from "@utils/posts";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

interface Props {
  post: BlogPost;
}

export const GET = ({ props }: { props: Props }) => {
  const { post } = props;

  return llmsPost({
    post,
    site: siteConfig.url,
    link: formatUrl(post.slug),
  });
};
