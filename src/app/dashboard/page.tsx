import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Users,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const [user, clientCount, runStats, recentRuns] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true, name: true },
    }),
    prisma.client.count({ where: { userId } }),
    prisma.run.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.run.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { service: true, client: true },
    }),
  ]);

  const totalRuns = runStats.reduce((acc, s) => acc + s._count, 0);
  const completedRuns =
    runStats.find((s) => s.status === "COMPLETED")?._count || 0;

  const stats = [
    {
      label: "Token Balance",
      value: user?.tokenBalance?.toLocaleString() || "0",
      icon: Coins,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Clients",
      value: clientCount.toString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Total Runs",
      value: totalRuns.toString(),
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Success Rate",
      value: totalRuns > 0 ? `${Math.round((completedRuns / totalRuns) * 100)}%` : "N/A",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  const statusIcon = {
    COMPLETED: <CheckCircle className="w-4 h-4 text-green-500" />,
    RUNNING: <Clock className="w-4 h-4 text-blue-500 animate-spin" />,
    FAILED: <AlertCircle className="w-4 h-4 text-red-500" />,
    PENDING: <Clock className="w-4 h-4 text-gray-400" />,
  };

  const statusVariant = {
    COMPLETED: "success" as const,
    RUNNING: "default" as const,
    FAILED: "destructive" as const,
    PENDING: "secondary" as const,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your marketing automation activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/dashboard/marketplace"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Launch Service
              </span>
            </Link>
            <Link
              href="/dashboard/clients"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Add Client
              </span>
            </Link>
            <Link
              href="/dashboard/tokens"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Coins className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Buy Tokens
              </span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                View History
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRuns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No activity yet</p>
              <p className="text-sm mt-1">
                Launch your first service from the{" "}
                <Link
                  href="/dashboard/marketplace"
                  className="text-blue-600 hover:underline"
                >
                  Marketplace
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon[run.status]}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {run.service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {run.client?.name || "No client"} &middot;{" "}
                        {new Date(run.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant[run.status]}>
                      {run.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {run.tokensCost} tokens
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
