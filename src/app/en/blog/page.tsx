import type { Metadata } from "next";
import BlogIndex from "@/components/blog/blog-index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical Buywiz guides about EU product compliance, supplier documentation and product safety.",
  alternates: {
    canonical: "/en/blog",
  },
};

export default function EnglishBlogPage() {
  return <BlogIndex language="EN" />;
}
