import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// Backward compat - lazy getter
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const TOKEN_PACKS = [
  {
    id: "starter",
    amount: 500,
    price: 999, // cents
    label: "Starter",
    popular: false,
  },
  {
    id: "growth",
    amount: 2000,
    price: 2999,
    label: "Growth",
    popular: true,
  },
  {
    id: "pro",
    amount: 5000,
    price: 5999,
    label: "Pro",
    popular: false,
  },
  {
    id: "agency",
    amount: 15000,
    price: 14999,
    label: "Agency",
    popular: false,
  },
] as const;

export function getPackById(id: string) {
  return TOKEN_PACKS.find((p) => p.id === id);
}
