import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isBlogAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

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

  if (type !== "demo" && type !== "contact") {
    return NextResponse.redirect(
      publicUrl("/admin/requests"),
      303,
    );
  }

  const formData = await request.formData();
  const note = String(
    formData.get("note") || "",
  ).trim();

  if (!note || note.length > 3000) {
    return NextResponse.redirect(
      publicUrl(
        `/admin/requests/${type}/${id}?error=note`,
      ),
      303,
    );
  }

  const exists =
    type === "demo"
      ? await prisma.demoRequest.findUnique({
          where: { id },
          select: { id: true },
        })
      : await prisma.contactRequest.findUnique({
          where: { id },
          select: { id: true },
        });

  if (!exists) {
    return NextResponse.redirect(
      publicUrl("/admin/requests"),
      303,
    );
  }

  await prisma.requestNote.create({
    data: {
      requestType: type.toUpperCase(),
      requestId: id,
      note,
    },
  });

  revalidatePath(
    `/admin/requests/${type}/${id}`,
  );

  return NextResponse.redirect(
    publicUrl(
      `/admin/requests/${type}/${id}?note=added`,
    ),
    303,
  );
}
