import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
import { getPublishedBlogPosts } from "@/lib/blog";

const baseUrl = "https://www.buywiz.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [nlPosts, enPosts] = await Promise.all([
    getPublishedBlogPosts("NL"),
    getPublishedBlogPosts("EN"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/demo`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/demo`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const nlArticles: MetadataRoute.Sitemap = nlPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const enArticles: MetadataRoute.Sitemap = enPosts.map((post) => ({
    url: `${baseUrl}/en/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...nlArticles, ...enArticles];
}
