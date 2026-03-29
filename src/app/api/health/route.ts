import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch {
    checks.database = "disconnected";
    checks.status = "degraded";
  }

  const aiProvider = process.env.AI_PROVIDER || "ollama";
  checks.aiProvider = aiProvider;

  try {
    if (aiProvider === "ollama") {
      const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
      const res = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
      checks.ai = res.ok ? "connected" : "unreachable";
    } else {
      checks.ai = "configured";
    }
  } catch {
    checks.ai = "unreachable";
  }

  const statusCode = checks.status === "ok" ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
