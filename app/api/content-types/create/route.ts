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

// POST /api/content-types/create — create new content type
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { uid, displayName, kind, schema } = body;

  if (!uid || !displayName || !kind) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.contentType.findUnique({ where: { uid } });
  if (existing) {
    return NextResponse.json({ error: "Content type already exists" }, { status: 409 });
  }

  const ct = await prisma.contentType.create({
    data: {
      id: cuid(),
      uid,
      displayName,
      kind,
      schema: schema || [],
    },
  });

  return NextResponse.json(ct);
}

// PATCH /api/content-types/create — update content type schema
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { uid, schema, displayName } = body;

  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (schema !== undefined) updateData.schema = schema;
  if (displayName !== undefined) updateData.displayName = displayName;

  const ct = await prisma.contentType.update({
    where: { uid },
    data: updateData,
  });

  return NextResponse.json(ct);
}
