import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalRuns,
    runs24h,
    runs7d,
    totalTokensConsumed,
    totalRevenue,
    topServices,
    activeUsers7d,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.run.count(),
    prisma.run.count({ where: { createdAt: { gte: last24h } } }),
    prisma.run.count({ where: { createdAt: { gte: last7d } } }),
    prisma.tokenLedger.aggregate({
      where: { type: "CONSUMPTION" },
      _sum: { amount: true },
    }),
    prisma.tokenLedger.aggregate({
      where: { type: "PURCHASE" },
      _sum: { amount: true },
    }),
    prisma.run.groupBy({
      by: ["serviceId"],
      _count: true,
      orderBy: { _count: { serviceId: "desc" } },
      take: 5,
    }),
    prisma.run.findMany({
      where: { createdAt: { gte: last7d } },
      distinct: ["userId"],
      select: { userId: true },
    }),
  ]);

  return NextResponse.json({
    users: { total: totalUsers },
    runs: { total: totalRuns, last24h: runs24h, last7d: runs7d },
    tokens: {
      totalConsumed: Math.abs(totalTokensConsumed._sum.amount || 0),
      totalPurchased: totalRevenue._sum.amount || 0,
    },
    topServices,
    activeUsers7d: activeUsers7d.length,
  });
}
