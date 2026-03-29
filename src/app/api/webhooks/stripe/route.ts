import { stripe, getPackById } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { addTokens } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const packId = session.metadata?.packId;

    if (!userId || !packId) {
      console.error("Webhook missing metadata:", { userId, packId });
      return NextResponse.json({ received: true });
    }

    // Validate pack exists and get the REAL token amount (don't trust metadata)
    const pack = getPackById(packId);
    if (!pack) {
      console.error("Webhook invalid packId:", packId);
      return NextResponse.json({ received: true });
    }

    // Validate userId exists in database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error("Webhook unknown userId:", userId);
      return NextResponse.json({ received: true });
    }

    // Use pack.amount from our source of truth, NOT from metadata
    await addTokens(
      userId,
      pack.amount,
      "PURCHASE",
      `Purchased ${pack.label} pack: ${pack.amount.toLocaleString()} tokens`
    );

    console.log(
      `Tokens added: ${pack.amount} to user ${userId} (pack: ${packId})`
    );
  }

  return NextResponse.json({ received: true });
}
