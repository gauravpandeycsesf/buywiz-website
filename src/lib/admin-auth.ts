import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "buywiz_blog_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.BLOG_ADMIN_SECRET;

  if (!secret) {
    throw new Error("BLOG_ADMIN_SECRET is not configured");
  }

  return secret;
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

export function createAdminToken(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${email}|${expiresAt}`;
  const signature = sign(payload);

  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");

    if (parts.length !== 3) {
      return false;
    }

    const [email, expiresAtRaw, suppliedSignature] = parts;
    const expiresAt = Number(expiresAtRaw);

    if (!email || !Number.isFinite(expiresAt)) {
      return false;
    }

    if (expiresAt < Math.floor(Date.now() / 1000)) {
      return false;
    }

    const payload = `${email}|${expiresAt}`;
    const expectedSignature = sign(payload);

    const suppliedBuffer = Buffer.from(suppliedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (suppliedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    if (!crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) {
      return false;
    }

    return email === process.env.BLOG_ADMIN_EMAIL;
  } catch {
    return false;
  }
}

export async function isBlogAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return verifyAdminToken(token);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS,
};
