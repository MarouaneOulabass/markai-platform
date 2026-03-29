import { stripe, getPackById } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { addTokens } from "@/lib/tokens";
import { logger } from "@/lib/logger";
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
    logger.error("Webhook signature verification failed", { error: error.message });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const packId = session.metadata?.packId;

    if (!userId || !packId) {
      logger.error("Webhook missing metadata", { userId, packId, eventId: event.id });
      return NextResponse.json({ received: true });
    }

    const pack = getPackById(packId);
    if (!pack) {
      logger.error("Webhook invalid packId", { packId, eventId: event.id });
      return NextResponse.json({ received: true });
    }

    // IDEMPOTENCY: Check if this event was already processed
    // Use Stripe event ID as unique reference in ledger description
    const existing = await prisma.tokenLedger.findFirst({
      where: {
        userId,
        type: "PURCHASE",
        description: { contains: event.id },
      },
    });

    if (existing) {
      logger.info("Webhook already processed (idempotent)", { eventId: event.id });
      return NextResponse.json({ received: true });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      logger.error("Webhook unknown userId", { userId, eventId: event.id });
      return NextResponse.json({ received: true });
    }

    await addTokens(
      userId,
      pack.amount,
      "PURCHASE",
      `${pack.label} pack: ${pack.amount.toLocaleString()} tokens [${event.id}]`
    );

    logger.info("Tokens added via Stripe", {
      userId,
      packId,
      amount: pack.amount,
      eventId: event.id,
    });
  }

  return NextResponse.json({ received: true });
}
