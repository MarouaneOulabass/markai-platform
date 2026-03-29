import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
