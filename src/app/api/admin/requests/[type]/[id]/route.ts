import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "CLOSED",
] as const;

function publicUrl(pathname: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.buywiz.eu";

  return new URL(pathname, base);
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      type: string;
      id: string;
    }>;
  },
) {
  if (!(await isBlogAdmin())) {
    return NextResponse.redirect(
      publicUrl("/admin/login"),
      303,
    );
  }

  const { type, id } = await context.params;
  const formData = await request.formData();

  const status = String(
    formData.get("status") || "",
  ).toUpperCase();

  if (
    !allowedStatuses.includes(
      status as (typeof allowedStatuses)[number],
    )
  ) {
    return NextResponse.redirect(
      publicUrl("/admin/requests?error=status"),
      303,
    );
  }

  if (type === "demo") {
    await prisma.demoRequest.update({
      where: { id },
      data: { status },
    });
  } else if (type === "contact") {
    await prisma.contactRequest.update({
      where: { id },
      data: { status },
    });
  } else {
    return NextResponse.redirect(
      publicUrl("/admin/requests?error=type"),
      303,
    );
  }

  revalidatePath("/admin/requests");

  return NextResponse.redirect(
    publicUrl("/admin/requests?updated=1"),
    303,
  );
}
