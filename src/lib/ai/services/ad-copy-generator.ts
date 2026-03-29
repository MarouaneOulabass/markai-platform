import { ServiceDefinition } from "./index";

export const adCopyGenerator: ServiceDefinition = {
  slug: "ad-copy-generator",
  name: "Ad Copy Generator",
  description:
    "Create high-converting ad copy for any platform. Get complete ad sets with headlines, body text, and CTAs optimized for your target audience.",
  category: "ADS",
  icon: "Megaphone",
  tokenCost: 25,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., Premium leather wallet",
      required: true,
    },
    {
      name: "usp",
      label: "Unique Selling Point",
      type: "textarea",
      placeholder: "What makes your product special?",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Men 25-45 interested in fashion",
      required: true,
    },
    {
      name: "platform",
      label: "Ad Platform",
      type: "select",
      required: true,
      options: [
        { label: "Facebook / Instagram Ads", value: "meta" },
        { label: "Google Ads", value: "google" },
        { label: "TikTok Ads", value: "tiktok" },
        { label: "LinkedIn Ads", value: "linkedin" },
      ],
    },
    {
      name: "objective",
      label: "Campaign Objective",
      type: "select",
      required: true,
      options: [
        { label: "Sales / Conversions", value: "conversions" },
        { label: "Lead Generation", value: "leads" },
        { label: "Brand Awareness", value: "awareness" },
        { label: "Traffic", value: "traffic" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a performance marketing expert who writes ad copy that converts. You understand platform-specific best practices and direct response copywriting.`,
    },
    {
      role: "user",
      content: `Create 3 complete ad variations for the following:

Product: ${input.product}
USP: ${input.usp}
Target Audience: ${input.audience}
Platform: ${input.platform}
Objective: ${input.objective}

For each ad variation, provide:
- HEADLINE (max 40 chars)
- SUBHEADLINE (max 60 chars)
- BODY (max 125 chars for Meta, max 90 chars for Google)
- CTA (call to action button text)
- HOOK (first line that grabs attention)

Format each ad as:
---AD X---
HEADLINE: ...
SUBHEADLINE: ...
HOOK: ...
BODY: ...
CTA: ...

Optimize for ${input.objective} on ${input.platform}.`,
    },
  ],
  parseOutput: (raw) => {
    const ads = raw
      .split(/---AD \d+---/)
      .filter((block) => block.trim())
      .map((block) => {
        const lines = block.trim().split("\n");
        const ad: Record<string, string> = {};
        for (const line of lines) {
          const match = line.match(/^(\w+):\s*(.+)/);
          if (match) {
            ad[match[1].toLowerCase()] = match[2].trim();
          }
        }
        return ad;
      });
    return { ads };
  },
};
