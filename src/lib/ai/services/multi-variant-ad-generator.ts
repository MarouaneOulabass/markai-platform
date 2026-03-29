import { ServiceDefinition } from "./index";

export const multiVariantAdGenerator: ServiceDefinition = {
  slug: "multi-variant-ad-generator",
  name: "Multi-Variant Ad Generator",
  description:
    "Generate 5-10 ad variations from a single brief for A/B testing. Different hooks, angles, CTAs, and formats — ready to test at scale.",
  category: "ADS",
  icon: "Layers",
  tokenCost: 30,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., Organic protein powder",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Gym-goers 25-40 who care about clean ingredients",
      required: true,
    },
    {
      name: "keyBenefit",
      label: "Key Benefit / USP",
      type: "text",
      placeholder: "e.g., Only 3 ingredients, no artificial anything",
      required: true,
    },
    {
      name: "platform",
      label: "Ad Platform",
      type: "select",
      required: true,
      options: [
        { label: "Facebook / Instagram", value: "meta" },
        { label: "TikTok", value: "tiktok" },
        { label: "Google Ads", value: "google" },
        { label: "LinkedIn", value: "linkedin" },
      ],
    },
    {
      name: "variantCount",
      label: "Number of Variants",
      type: "select",
      required: true,
      options: [
        { label: "5 variants", value: "5" },
        { label: "8 variants", value: "8" },
        { label: "10 variants", value: "10" },
      ],
    },
    {
      name: "objective",
      label: "Campaign Objective",
      type: "select",
      required: true,
      options: [
        { label: "Conversions / Purchase", value: "conversions" },
        { label: "Lead Generation", value: "leads" },
        { label: "Traffic / Clicks", value: "traffic" },
        { label: "App Install", value: "install" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a performance marketing creative strategist who generates ad variations for systematic A/B testing. Each variant must test a genuinely different variable — not just rewording the same thing. You think in terms of creative testing frameworks.`,
    },
    {
      role: "user",
      content: `Generate ${input.variantCount} ad variations for A/B testing:

Product: ${input.product}
Audience: ${input.audience}
Key Benefit: ${input.keyBenefit}
Platform: ${input.platform}
Objective: ${input.objective}

## TESTING STRATEGY
Explain what variable each variant tests (hook style, angle, emotion, CTA, format, etc.)

Then generate each variant:

---VARIANT X / ${input.variantCount}---
TESTS: (what variable this variant is testing)
ANGLE: (the marketing angle used)
HOOK: (first line / attention grabber)
HEADLINE: (main headline, under 40 chars)
BODY: (ad body copy, platform-appropriate length)
CTA: (call to action text)
VISUAL DIRECTION: (brief description of what the creative should show)

---

After all variants, add:

## TESTING RECOMMENDATIONS
- Which variants to test first (and why)
- Recommended budget split
- What to look for in results
- When to kill a variant vs. let it run
- How to iterate on winners`,
    },
  ],
  parseOutput: (raw) => {
    return { variants: raw.trim() };
  },
};
