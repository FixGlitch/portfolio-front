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

// GET /api/entries?contentType=singleType.home&locale=en
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contentTypeUid = searchParams.get("contentType");
  const locale = searchParams.get("locale") || "en";

  if (!contentTypeUid) {
    return NextResponse.json({ error: "Missing contentType" }, { status: 400 });
  }

  const ct = await prisma.contentType.findUnique({
    where: { uid: contentTypeUid },
  });
  if (!ct) {
    return NextResponse.json({ error: "Content type not found" }, { status: 404 });
  }

  if (ct.kind === "singleType") {
    const entry = await prisma.entry.findFirst({
      where: { contentTypeId: contentTypeUid, locale },
    });
    return NextResponse.json(entry);
  }

  // Collection type: return all entries for locale
  const entries = await prisma.entry.findMany({
    where: { contentTypeId: contentTypeUid, locale },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(entries);
}
