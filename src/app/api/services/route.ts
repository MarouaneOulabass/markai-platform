import { services } from "@/lib/ai/services";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    services: services.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      category: s.category,
      icon: s.icon,
      tokenCost: s.tokenCost,
      isPremium: s.isPremium,
      inputSchema: s.inputSchema,
    })),
  });
}
