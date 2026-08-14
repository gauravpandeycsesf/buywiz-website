import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function cleanOptional(value: FormDataEntryValue | null) {
  const result = String(value || "").trim();
  return result || null;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  if (!(await isBlogAdmin())) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
      303,
    );
  }

  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const authorName = String(formData.get("authorName") || "").trim();

  const language =
    String(formData.get("language") || "").toUpperCase() === "EN"
      ? "EN"
      : "NL";

  const intent = String(formData.get("intent") || "draft");

  const status =
    intent === "publish"
      ? "PUBLISHED"
      : "DRAFT";

  if (!title || !summary || !content || !authorName) {
    return NextResponse.redirect(
      new URL("/admin/blog/new?error=required", request.url),
      303,
    );
  }

  const requestedSlug = String(
    formData.get("slug") || "",
  ).trim();

  const slug = createSlug(requestedSlug || title);

  if (!slug) {
    return NextResponse.redirect(
      new URL("/admin/blog/new?error=required", request.url),
      303,
    );
  }

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      slug,
      language,
    },
    select: {
      id: true,
    },
  });

  if (existingPost) {
    return NextResponse.redirect(
      new URL("/admin/blog/new?error=slug", request.url),
      303,
    );
  }

  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      language,
      summary,
      content,
      category: cleanOptional(
        formData.get("category"),
      ),
      tags,
      authorName,
      authorBio: cleanOptional(
        formData.get("authorBio"),
      ),
      authorImage: cleanOptional(
        formData.get("authorImage"),
      ),
      coverImage: cleanOptional(
        formData.get("coverImage"),
      ),
      seoTitle: cleanOptional(
        formData.get("seoTitle"),
      ),
      seoDescription: cleanOptional(
        formData.get("seoDescription"),
      ),
      status,
      publishedAt:
        status === "PUBLISHED"
          ? new Date()
          : null,
    },
  });

  revalidatePath("/admin/blog");

  return NextResponse.redirect(
    new URL("/admin/blog?created=1", request.url),
    303,
  );
}
