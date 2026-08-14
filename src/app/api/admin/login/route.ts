import crypto from "crypto";
import { NextResponse } from "next/server";
import { adminCookie, createAdminToken } from "@/lib/admin-auth";

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  const expectedEmail = process.env.BLOG_ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.BLOG_ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      { error: "Blog admin credentials are not configured." },
      { status: 500 },
    );
  }

  const validEmail = safeCompare(email, expectedEmail);
  const validPassword = safeCompare(password, expectedPassword);

  if (!validEmail || !validPassword) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url),
      303,
    );
  }

  const response = NextResponse.redirect(
    new URL("/admin/blog", request.url),
    303,
  );

  response.cookies.set({
    name: adminCookie.name,
    value: createAdminToken(expectedEmail),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminCookie.maxAge,
  });

  return response;
}
