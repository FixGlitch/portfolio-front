import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

// GET /api/media — list all media
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(media);
}

// POST /api/media — upload media
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string) || null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;

  const media = await prisma.media.create({
    data: {
      name: file.name,
      alt,
      url,
      mime: file.type,
      size: file.size,
    },
  });

  return NextResponse.json(media);
}

// DELETE /api/media?id=xxx
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (media) {
    const filepath = path.join(process.cwd(), "public", media.url);
    try {
      const { unlink } = await import("fs/promises");
      await unlink(filepath);
    } catch {}
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
