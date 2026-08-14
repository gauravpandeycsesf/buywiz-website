import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isBlogAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  if (!(await isBlogAdmin())) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "No image was supplied." },
      { status: 400 },
    );
  }

  const extension = allowedTypes[file.type];

  if (!extension) {
    return Response.json(
      { error: "Only JPG, PNG and WebP images are allowed." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Image must be smaller than 5 MB." },
      { status: 400 },
    );
  }

  const directory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "blog",
  );

  await mkdir(directory, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const destination = path.join(directory, filename);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(destination, buffer);

  return Response.json({
    url: `/uploads/blog/${filename}`,
  });
}
