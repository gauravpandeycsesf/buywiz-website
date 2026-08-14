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

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  if (!(await isBlogAdmin())) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
      303,
    );
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "save");

  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!existingPost) {
    return NextResponse.redirect(
      new URL("/admin/blog", request.url),
      303,
    );
  }

  if (intent === "delete") {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/admin/blog");

    return NextResponse.redirect(
      new URL("/admin/blog?deleted=1", request.url),
      303,
    );
  }

  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const authorName = String(formData.get("authorName") || "").trim();

  if (!title || !summary || !content || !authorName) {
    return NextResponse.redirect(
      new URL(
        `/admin/blog/${id}/edit?error=required`,
        request.url,
      ),
      303,
    );
  }

  const language =
    String(formData.get("language") || "").toUpperCase() === "EN"
      ? "EN"
      : "NL";

  const requestedSlug =
    String(formData.get("slug") || "").trim() || title;

  const slug = createSlug(requestedSlug);

  const duplicate = await prisma.blogPost.findFirst({
    where: {
      slug,
      language,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicate) {
    return NextResponse.redirect(
      new URL(
        `/admin/blog/${id}/edit?error=slug`,
        request.url,
      ),
      303,
    );
  }

  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  let status: "DRAFT" | "PUBLISHED" = existingPost.status;
  let publishedAt = existingPost.publishedAt;

  if (intent === "publish") {
    status = "PUBLISHED";
    publishedAt = existingPost.publishedAt ?? new Date();
  }

  if (intent === "unpublish") {
    status = "DRAFT";
    publishedAt = null;
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      language,
      summary,
      content,
      category: cleanOptional(formData.get("category")),
      tags,
      authorName,
      authorBio: cleanOptional(formData.get("authorBio")),
      authorImage: cleanOptional(formData.get("authorImage")),
      coverImage: cleanOptional(formData.get("coverImage")),
      seoTitle: cleanOptional(formData.get("seoTitle")),
      seoDescription: cleanOptional(
        formData.get("seoDescription"),
      ),
      status,
      publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}/edit`);

  return NextResponse.redirect(
    new URL(
      `/admin/blog/${id}/edit?saved=1`,
      request.url,
    ),
    303,
  );
}
