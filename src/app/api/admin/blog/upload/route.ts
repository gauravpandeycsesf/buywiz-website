import { randomUUID } from "crypto";
import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { isBlogAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const region = process.env.AWS_REGION ?? "eu-central-1";
const bucket = process.env.BLOG_MEDIA_BUCKET;
const cloudFrontDomain = process.env.BLOG_MEDIA_CLOUDFRONT_DOMAIN;

const s3 = new S3Client({
  region,
});

export async function POST(request: Request) {
  if (!(await isBlogAdmin())) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  if (!bucket || !cloudFrontDomain) {
    console.error("Blog media configuration is missing.");

    return Response.json(
      { error: "Media storage is not configured." },
      { status: 500 },
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

  const filename = `${randomUUID()}.${extension}`;
  const key = `blog/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const domain = cloudFrontDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return Response.json({
    url: `https://${domain}/${key}`,
  });
}
