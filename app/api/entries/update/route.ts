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

function cuid(): string {
  return "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

// PATCH /api/entries/update — update single type or collection entry
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { contentTypeUid, locale, data, entryId, published } = body;

  if (!contentTypeUid || !locale || !data) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ct = await prisma.contentType.findUnique({
    where: { uid: contentTypeUid },
  });
  if (!ct) {
    return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  }

  if (ct.kind === "singleType") {
    const existing = await prisma.entry.findFirst({
      where: { contentTypeId: contentTypeUid, locale },
    });
    const merged = { ...(existing?.data as Record<string, unknown> || {}), ...data };

    if (existing) {
      const updated = await prisma.entry.update({
        where: { id: existing.id },
        data: { data: merged, ...(published !== undefined ? { published } : {}) },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.entry.create({
      data: {
        id: cuid(),
        uid: cuid(),
        contentTypeId: contentTypeUid,
        locale,
        data: merged,
        published: published ?? true,
      },
    });
    return NextResponse.json(created);
  }

  // Collection type: update by entry ID (merge data)
  if (entryId) {
    const existing = await prisma.entry.findUnique({ where: { id: entryId } });
    const merged = { ...(existing?.data as Record<string, unknown> || {}), ...data };
    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: { data: merged, ...(published !== undefined ? { published } : {}) },
    });
    return NextResponse.json(updated);
  }

  // Create new entry
  const created = await prisma.entry.create({
    data: {
      id: cuid(),
      uid: cuid(),
      contentTypeId: contentTypeUid,
      locale,
      data,
      published: published ?? false,
    },
  });
  return NextResponse.json(created);
}

// POST /api/entries/update — create new collection entry
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { contentTypeUid, locale, data } = body;

  if (!contentTypeUid || !locale || !data) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ct = await prisma.contentType.findUnique({
    where: { uid: contentTypeUid },
  });
  if (!ct) {
    return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  }

  const created = await prisma.entry.create({
    data: {
      id: cuid(),
      uid: cuid(),
      contentTypeId: contentTypeUid,
      locale,
      data,
      published: false,
    },
  });
  return NextResponse.json(created);
}
