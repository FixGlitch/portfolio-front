import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth) {
    const token = auth.replace("Basic ", "");
    const decoded = atob(token);
    const [, password] = decoded.split(":");
    return password === process.env.ADMIN_PASSWORD;
  }
  const cookie = request.cookies.get("admin_auth");
  return cookie?.value === process.env.ADMIN_PASSWORD;
}

// DELETE /api/entries/delete?id=xxx
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.entry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
