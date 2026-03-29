import { ServiceDefinition } from "./index";

export const productDescriptionGenerator: ServiceDefinition = {
  slug: "product-description-generator",
  name: "Product Page Generator",
  description:
    "Generate complete product descriptions optimized for e-commerce. Includes features, benefits, SEO-optimized copy, and compelling storytelling.",
  category: "CONTENT",
  icon: "ShoppingBag",
  tokenCost: 20,
  isPremium: false,
  inputSchema: [
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      placeholder: "e.g., UltraFit Pro Smart Watch",
      required: true,
    },
    {
      name: "features",
      label: "Key Features",
      type: "textarea",
      placeholder: "List the main features (one per line)",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Health-conscious millennials",
      required: true,
    },
    {
      name: "priceRange",
      label: "Price Range",
      type: "select",
      required: true,
      options: [
        { label: "Budget ($1-50)", value: "budget" },
        { label: "Mid-range ($50-200)", value: "midrange" },
        { label: "Premium ($200-500)", value: "premium" },
        { label: "Luxury ($500+)", value: "luxury" },
      ],
    },
    {
      name: "style",
      label: "Writing Style",
      type: "select",
      required: true,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Playful", value: "playful" },
        { label: "Minimalist", value: "minimalist" },
        { label: "Luxurious", value: "luxurious" },
        { label: "Technical", value: "technical" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are an expert e-commerce copywriter. You write product descriptions that sell by combining emotional appeal with practical information. You understand conversion psychology.`,
    },
    {
      role: "user",
      content: `Create a complete product page copy for:

Product: ${input.productName}
Features: ${input.features}
Target Audience: ${input.audience}
Price Range: ${input.priceRange}
Style: ${input.style}

Generate:
1. TAGLINE: One punchy line (max 10 words)
2. SHORT DESCRIPTION: 2-3 sentences for product cards
3. LONG DESCRIPTION: Full product description (150-200 words) with emotional storytelling
4. BULLET POINTS: 5 benefit-focused bullet points
5. SOCIAL PROOF LINE: A line that implies trust/credibility

Format with clear section headers.`,
    },
  ],
  parseOutput: (raw) => {
    const sections: Record<string, string> = {};
    let currentSection = "";
    const lines = raw.split("\n");

    for (const line of lines) {
      const headerMatch = line.match(
        /^(?:\d+\.\s*)?(?:\*\*)?([A-Z\s]+)(?:\*\*)?:\s*(.*)/
      );
      if (headerMatch) {
        currentSection = headerMatch[1].trim().toLowerCase().replace(/\s+/g, "_");
        sections[currentSection] = headerMatch[2] || "";
      } else if (currentSection && line.trim()) {
        sections[currentSection] += "\n" + line;
      }
    }

    return { sections };
  },
};
