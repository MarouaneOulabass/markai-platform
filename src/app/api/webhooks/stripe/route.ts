import { stripe } from "@/lib/stripe";
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
    const tokenAmount = parseInt(session.metadata?.tokenAmount || "0");
    const packId = session.metadata?.packId;

    if (userId && tokenAmount > 0) {
      await addTokens(
        userId,
        tokenAmount,
        "PURCHASE",
        `Purchased ${packId} pack: ${tokenAmount.toLocaleString()} tokens`
      );
      console.log(
        `Tokens added: ${tokenAmount} to user ${userId} (pack: ${packId})`
      );
    }
  }

  return NextResponse.json({ received: true });
}
