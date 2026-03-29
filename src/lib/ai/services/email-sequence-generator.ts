import { ServiceDefinition } from "./index";

export const emailSequenceGenerator: ServiceDefinition = {
  slug: "email-sequence-generator",
  name: "Email Sequence Generator",
  description:
    "Generate complete email marketing sequences (3-7 emails) with subject lines, body copy, and sending schedule. Optimized for your specific funnel stage.",
  category: "EMAIL",
  icon: "Mails",
  tokenCost: 35,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., Online fitness coaching program",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Women 30-45 who want to lose weight",
      required: true,
    },
    {
      name: "sequenceType",
      label: "Sequence Type",
      type: "select",
      required: true,
      options: [
        { label: "Welcome / Onboarding", value: "welcome" },
        { label: "Sales / Launch", value: "sales" },
        { label: "Nurture / Education", value: "nurture" },
        { label: "Cart Abandonment", value: "cart_abandonment" },
        { label: "Re-engagement / Win-back", value: "reengagement" },
        { label: "Post-Purchase / Upsell", value: "post_purchase" },
      ],
    },
    {
      name: "emailCount",
      label: "Number of Emails",
      type: "select",
      required: true,
      options: [
        { label: "3 emails (short sequence)", value: "3" },
        { label: "5 emails (standard)", value: "5" },
        { label: "7 emails (full sequence)", value: "7" },
      ],
    },
    {
      name: "offer",
      label: "Offer / CTA",
      type: "text",
      placeholder: "e.g., 50% off first month, Free trial, Book a call",
      required: true,
    },
    {
      name: "tone",
      label: "Brand Tone",
      type: "select",
      required: true,
      options: [
        { label: "Professional & Authoritative", value: "professional" },
        { label: "Casual & Friendly", value: "casual" },
        { label: "Inspirational & Motivating", value: "inspirational" },
        { label: "Direct & No-nonsense", value: "direct" },
        { label: "Warm & Personal", value: "warm" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are an email marketing strategist who builds sequences that convert. You understand email psychology, deliverability best practices, and funnel optimization. Each email should have a clear purpose in the overall sequence arc.`,
    },
    {
      role: "user",
      content: `Create a ${input.emailCount}-email ${input.sequenceType} sequence for:

Product: ${input.product}
Audience: ${input.audience}
Offer: ${input.offer}
Tone: ${input.tone}

## SEQUENCE OVERVIEW
- Goal of this sequence:
- Sequence arc: (how emotions/urgency build across emails)
- Sending schedule: (timing between emails)

Then for each email:

---EMAIL X / ${input.emailCount}---
SEND: Day X (timing relative to trigger)
PURPOSE: (what this email achieves in the sequence)
SUBJECT LINE: (under 50 chars, optimized for open rate)
PREVIEW TEXT: (under 90 chars)

BODY:
(Write the complete email body. Include:
- Opening line that hooks
- Value/story section
- Bridge to CTA
- CTA button text
- P.S. line if relevant)

NOTES: Why this email works at this position in the sequence

---

After all emails, add:
## KEY METRICS TO TRACK
## A/B TEST SUGGESTIONS (what to test in this sequence)`,
    },
  ],
  parseOutput: (raw) => {
    return { sequence: raw.trim() };
  },
};
