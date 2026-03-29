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

  const [runs, total] = await Promise.all([
    prisma.run.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.limit,
      include: {
        service: { select: { name: true, slug: true } },
        client: { select: { name: true } },
      },
    }),
    prisma.run.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json(paginatedResponse(runs, total, params));
}
