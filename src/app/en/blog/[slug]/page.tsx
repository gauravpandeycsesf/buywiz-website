import type { Metadata } from "next";
import BlogArticle from "@/components/blog/blog-article";
import { getPublishedBlogPost } from "@/lib/blog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPublishedBlogPost(slug, "EN");

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  const title =
    post.seoTitle || `${post.title} | Buywiz`;

  const description =
    post.seoDescription || post.summary;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/en/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/en/blog/${post.slug}`,
      publishedTime:
        post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: post.coverImage
        ? [post.coverImage]
        : undefined,
    },
  };
}

export default async function EnglishBlogPostPage({
  params,
}: Props) {
  const { slug } = await params;

  return (
    <BlogArticle
      language="EN"
      slug={slug}
    />
  );
}
