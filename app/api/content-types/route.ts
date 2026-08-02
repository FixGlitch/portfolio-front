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

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const types = await prisma.contentType.findMany({
      orderBy: { displayName: "asc" },
    });

    const counts = await prisma.entry.groupBy({
      by: ["contentTypeId"],
      _count: { id: true },
    });

    const countMap = new Map(counts.map((c) => [c.contentTypeId, c._count.id]));

    const result = types.map((t) => ({
      ...t,
      _count: { entries: countMap.get(t.uid) || 0 },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("content-types API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
