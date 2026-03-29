import { auth } from "@/lib/auth";
import { executeService } from "@/lib/ai/executor";
import { NextResponse } from "next/server";
import { z } from "zod";

const executeSchema = z.object({
  serviceSlug: z.string(),
  input: z.record(z.any()),
  clientId: z.string().optional(),
  campaignId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceSlug, input, clientId, campaignId } = executeSchema.parse(body);

    const run = await executeService({
      serviceSlug,
      input,
      userId: session.user.id,
      clientId,
      campaignId,
    });

    return NextResponse.json(run);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error.message === "Insufficient tokens") {
      return NextResponse.json({ error: "Insufficient tokens. Please purchase more." }, { status: 402 });
    }
    console.error("Service execution error:", error);
    return NextResponse.json({ error: error.message || "Execution failed" }, { status: 500 });
  }
}
