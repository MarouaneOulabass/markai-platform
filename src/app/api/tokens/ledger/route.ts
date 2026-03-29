import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parsePagination, paginatedResponse } from "@/lib/pagination";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = parsePagination(request);

  const [entries, total] = await Promise.all([
    prisma.tokenLedger.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.limit,
    }),
    prisma.tokenLedger.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json(paginatedResponse(entries, total, params));
}
