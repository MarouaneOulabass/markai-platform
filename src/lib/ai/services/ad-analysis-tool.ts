import { ServiceDefinition } from "./index";

export const adAnalysisTool: ServiceDefinition = {
  slug: "ad-analysis-tool",
  name: "Ad Analysis Tool",
  description:
    "Paste any ad copy and get a detailed performance analysis: hook strength, angle identification, emotional triggers, weaknesses, and actionable improvement suggestions.",
  category: "ANALYTICS",
  icon: "ScanSearch",
  tokenCost: 15,
  isPremium: false,
  inputSchema: [
    {
      name: "adContent",
      label: "Ad Content (paste the full ad)",
      type: "textarea",
      placeholder: "Paste the complete ad text here — headline, body, CTA, everything...",
      required: true,
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      required: true,
      options: [
        { label: "Facebook / Instagram", value: "meta" },
        { label: "TikTok", value: "tiktok" },
        { label: "Google Ads", value: "google" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Email", value: "email" },
        { label: "Landing Page", value: "landing" },
      ],
    },
    {
      name: "goal",
      label: "Campaign Goal",
      type: "select",
      required: true,
      options: [
        { label: "Conversions / Sales", value: "conversions" },
        { label: "Lead Generation", value: "leads" },
        { label: "Brand Awareness", value: "awareness" },
        { label: "App Install", value: "install" },
        { label: "Engagement", value: "engagement" },
      ],
    },
    {
      name: "product",
      label: "Product / Industry (for context)",
      type: "text",
      placeholder: "e.g., SaaS project management tool",
      required: true,
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a performance marketing auditor with 10+ years analyzing ads across all platforms. You evaluate ads objectively, identifying exactly what works and what doesn't, with specific, actionable feedback. No fluff.`,
    },
    {
      role: "user",
      content: `Analyze this ${input.platform} ad for ${input.product} (goal: ${input.goal}):

"""
${input.adContent}
"""

Provide a complete analysis:

## SCORE: X/10

## HOOK ANALYSIS
- Hook identified: (quote it)
- Hook type: (curiosity/pain/urgency/benefit/story/statistic)
- Strength: X/10
- Scroll-stop power: Does it make someone pause? Why or why not?

## ANGLE ANALYSIS
- Primary angle: (what angle does this ad use?)
- Positioning: How is the product positioned?
- Differentiation: Does it stand out from competitors?

## EMOTIONAL TRIGGERS
- Primary emotion: (fear/desire/curiosity/urgency/trust/belonging)
- Emotional intensity: Low/Medium/High
- Does it create desire or just inform?

## COPY STRUCTURE
- Framework used: (AIDA/PAS/BAB/other)
- Flow: Does it lead logically to the CTA?
- CTA strength: X/10
- CTA clarity: Is the next step obvious?

## STRENGTHS (3 specific things)
1.
2.
3.

## WEAKNESSES (3 specific things)
1.
2.
3.

## REWRITE SUGGESTIONS
Provide 3 specific improvements with before/after examples.

## VERDICT
2-3 sentence summary: would this ad perform? What's the #1 thing to fix?`,
    },
  ],
  parseOutput: (raw) => {
    return { analysis: raw.trim() };
  },
};
