import type { Metadata } from "next";
import BlogIndex from "@/components/blog/blog-index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inzichten",
  description:
    "Praktische Buywiz-artikelen over EU-productcompliance, leveranciersdocumentatie en productveiligheid.",
  alternates: {
    canonical: "/blog",
  },
};

export default function DutchBlogPage() {
  return <BlogIndex language="NL" />;
}
