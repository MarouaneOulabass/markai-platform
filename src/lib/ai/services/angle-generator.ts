import { ServiceDefinition } from "./index";

export const angleGenerator: ServiceDefinition = {
  slug: "angle-generator",
  name: "Marketing Angle Generator",
  description:
    "Generate 5-10 unique marketing angles for your product. Each angle comes with positioning, emotional trigger, target segment, and example hook.",
  category: "ADS",
  icon: "Compass",
  tokenCost: 20,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., AI-powered meal planning app",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Busy parents who want to eat healthy",
      required: true,
    },
    {
      name: "problem",
      label: "Main Problem You Solve",
      type: "textarea",
      placeholder: "What pain point does your product address?",
      required: true,
    },
    {
      name: "competitors",
      label: "Key Competitors (optional)",
      type: "text",
      placeholder: "e.g., MyFitnessPal, Noom",
      required: false,
    },
    {
      name: "pricePoint",
      label: "Price Point",
      type: "select",
      required: true,
      options: [
        { label: "Free / Freemium", value: "free" },
        { label: "Budget ($1-30/mo)", value: "budget" },
        { label: "Mid-range ($30-100/mo)", value: "midrange" },
        { label: "Premium ($100+/mo)", value: "premium" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a senior creative strategist at a top performance marketing agency. You specialize in finding unique, non-obvious angles that cut through ad fatigue. You think in terms of emotional triggers, audience psychology, and positioning frameworks.`,
    },
    {
      role: "user",
      content: `Generate 8 unique marketing angles for:

Product: ${input.product}
Audience: ${input.audience}
Problem: ${input.problem}
Competitors: ${input.competitors || "Not specified"}
Price Point: ${input.pricePoint}

For each angle, provide:

---ANGLE X: [Angle Name]---
TYPE: (one of: Pain Point, Aspiration, Fear/Urgency, Social Proof, Contrarian, Luxury/Status, Value/Savings, Identity/Belonging)
POSITIONING: One sentence - how this angle positions the product
EMOTIONAL TRIGGER: The core emotion this angle activates
TARGET SEGMENT: Specific sub-audience this angle resonates with most
HOOK EXAMPLE: A ready-to-use hook using this angle (under 15 words)
AD CONCEPT: 2-3 sentences describing an ad that uses this angle
WHY IT WORKS: 1 sentence explaining the psychology

Make each angle genuinely different. Avoid generic angles. Think like a creative director pitching to a demanding client.`,
    },
  ],
  parseOutput: (raw) => {
    const angles = raw
      .split(/---ANGLE \d+/)
      .filter((block) => block.trim())
      .map((block) => {
        const lines: Record<string, string> = {};
        const parts = block.split("\n");
        let currentKey = "";
        for (const line of parts) {
          const match = line.match(/^([A-Z\s]+):\s*(.*)/);
          if (match) {
            currentKey = match[1].trim().toLowerCase().replace(/\s+/g, "_");
            lines[currentKey] = match[2].trim();
          } else if (currentKey && line.trim()) {
            lines[currentKey] += " " + line.trim();
          }
        }
        return lines;
      });
    return { angles };
  },
};
