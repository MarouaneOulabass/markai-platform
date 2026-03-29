import { ServiceDefinition } from "./index";

export const competitorAnalysis: ServiceDefinition = {
  slug: "competitor-analysis",
  name: "Competitor Analysis Generator",
  description:
    "Analyze a competitor's marketing strategy based on their messaging. Get positioning insights, gaps to exploit, and counter-positioning strategies.",
  category: "ANALYTICS",
  icon: "Target",
  tokenCost: 25,
  isPremium: false,
  inputSchema: [
    {
      name: "competitorName",
      label: "Competitor Name",
      type: "text",
      placeholder: "e.g., Notion",
      required: true,
    },
    {
      name: "competitorMessaging",
      label: "Competitor's Messaging (paste their copy)",
      type: "textarea",
      placeholder: "Paste their website headline, tagline, key messaging, ad copy, or any marketing content...",
      required: true,
    },
    {
      name: "yourProduct",
      label: "Your Product / Service",
      type: "text",
      placeholder: "e.g., TaskFlow - AI project management for small teams",
      required: true,
    },
    {
      name: "industry",
      label: "Industry",
      type: "text",
      placeholder: "e.g., Project management, SaaS",
      required: true,
    },
    {
      name: "yourUsp",
      label: "Your Key Differentiator",
      type: "textarea",
      placeholder: "What makes you different from this competitor?",
      required: true,
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a competitive intelligence strategist. You analyze competitor marketing to find gaps, weaknesses, and opportunities. You provide actionable counter-strategies, not generic SWOT charts.`,
    },
    {
      role: "user",
      content: `Analyze this competitor and help me beat them:

COMPETITOR: ${input.competitorName}
THEIR MESSAGING:
"""
${input.competitorMessaging}
"""

MY PRODUCT: ${input.yourProduct}
INDUSTRY: ${input.industry}
MY DIFFERENTIATOR: ${input.yourUsp}

Generate a complete competitive analysis:

## COMPETITOR POSITIONING
- Core promise: What are they selling (beyond the product)?
- Target audience: Who are they talking to?
- Brand personality: How do they sound?
- Pricing positioning: Premium/Value/Disruptive?

## MESSAGING BREAKDOWN
- Primary message: Their #1 headline/claim
- Supporting messages: Key proof points they use
- Emotional angle: What emotion drives their messaging?
- CTA strategy: What action do they push?

## STRENGTHS (what they do well)
1.
2.
3.

## WEAKNESSES (gaps in their messaging)
1.
2.
3.

## OPPORTUNITIES FOR YOU
Based on their gaps, here's how to position against them:

1. COUNTER-POSITIONING: How to frame your product vs theirs
2. UNDERSERVED AUDIENCE: Who they're ignoring that you can win
3. MESSAGING GAP: Claims you can make that they can't
4. EMOTIONAL GAP: Emotions they're not tapping into

## ATTACK ADS
3 ad concepts specifically designed to win customers from ${input.competitorName}:

### Ad 1: [Name]
Hook:
Body:
CTA:
Why it works against them:

### Ad 2: [Name]
Hook:
Body:
CTA:
Why it works against them:

### Ad 3: [Name]
Hook:
Body:
CTA:
Why it works against them:

## SUMMARY
One paragraph: your #1 competitive advantage and how to leverage it.`,
    },
  ],
  parseOutput: (raw) => {
    return { report: raw.trim() };
  },
};
