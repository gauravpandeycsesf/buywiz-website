import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, isRateLimited } from "@/lib/form-rate-limit";

export const runtime = "nodejs";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const website = text(body.website);

    if (website) {
      return NextResponse.json(
        { ok: true },
        { status: 201 },
      );
    }

    const ip = getClientIp(request);

    if (isRateLimited(`contact:${ip}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const name = text(body.name);
    const company = text(body.company);
    const email = text(body.email).toLowerCase();
    const subject = text(body.subject);
    const message = text(body.message);
    const language = body.language === "EN" ? "EN" : "NL";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (
      name.length > 120 ||
      company.length > 160 ||
      email.length > 254 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 },
      );
    }

    await prisma.contactRequest.create({
      data: {
        name,
        company: company || null,
        email,
        subject: subject || null,
        message,
        language,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Contact request failed:", error);

    return NextResponse.json(
      { error: "Unable to submit the contact request." },
      { status: 500 },
    );
  }
}
