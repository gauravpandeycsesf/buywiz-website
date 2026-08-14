import { prisma } from "@/lib/prisma";

export type PublicBlogLanguage = "NL" | "EN";

export async function getPublishedBlogPosts(
  language: PublicBlogLanguage,
) {
  return prisma.blogPost.findMany({
    where: {
      language,
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
}

export async function getPublishedBlogPost(
  slug: string,
  language: PublicBlogLanguage,
) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      language,
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
  });
}
