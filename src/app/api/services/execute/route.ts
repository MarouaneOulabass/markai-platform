import { auth } from "@/lib/auth";
import { executeService } from "@/lib/ai/executor";
import { NextResponse } from "next/server";
import { z } from "zod";

const executeSchema = z.object({
  serviceSlug: z.string().min(1),
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
      return NextResponse.json(
        { error: error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const message = error.message || "Execution failed";

    // Only expose safe error messages to client
    const safeMessages = [
      "Insufficient tokens",
      "Service not found",
      "Client not found or access denied",
      "Campaign not found or access denied",
    ];

    const isSafe = safeMessages.some((m) => message.includes(m));

    if (message === "Insufficient tokens") {
      return NextResponse.json({ error: message }, { status: 402 });
    }

    console.error("Service execution error:", error);
    return NextResponse.json(
      { error: isSafe ? message : "Service execution failed. Please try again." },
      { status: 500 }
    );
  }
}
