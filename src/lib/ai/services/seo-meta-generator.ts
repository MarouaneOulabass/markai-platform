import { ServiceDefinition } from "./index";

export const seoMetaGenerator: ServiceDefinition = {
  slug: "seo-meta-generator",
  name: "SEO Meta Generator",
  description:
    "Generate SEO-optimized meta titles, descriptions, keywords, and Open Graph tags. Boost your search rankings and click-through rates.",
  category: "SEO",
  icon: "Search",
  tokenCost: 10,
  isPremium: false,
  inputSchema: [
    {
      name: "pageUrl",
      label: "Page URL or Topic",
      type: "text",
      placeholder: "e.g., /products/smart-watch or 'AI fitness coaching'",
      required: true,
    },
    {
      name: "pageContent",
      label: "Page Content Summary",
      type: "textarea",
      placeholder: "Brief description of the page content...",
      required: true,
    },
    {
      name: "targetKeywords",
      label: "Target Keywords",
      type: "text",
      placeholder: "e.g., smart watch, fitness tracker, health monitor",
      required: true,
    },
    {
      name: "pageType",
      label: "Page Type",
      type: "select",
      required: true,
      options: [
        { label: "Product Page", value: "product" },
        { label: "Blog Post", value: "blog" },
        { label: "Landing Page", value: "landing" },
        { label: "Service Page", value: "service" },
        { label: "Homepage", value: "homepage" },
        { label: "Category Page", value: "category" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are an SEO specialist who writes meta tags that rank and convert. You balance keyword optimization with compelling copy that drives clicks.`,
    },
    {
      role: "user",
      content: `Generate complete SEO meta tags for:

Page: ${input.pageUrl}
Content: ${input.pageContent}
Target Keywords: ${input.targetKeywords}
Page Type: ${input.pageType}

Generate:
1. META TITLE: (50-60 chars, include primary keyword)
2. META DESCRIPTION: (150-160 chars, compelling with CTA)
3. OG TITLE: (for social sharing)
4. OG DESCRIPTION: (for social sharing)
5. PRIMARY KEYWORDS: (5 keywords, comma-separated)
6. SECONDARY KEYWORDS: (5 long-tail keywords, comma-separated)
7. H1 SUGGESTION: (main heading)
8. URL SLUG: (SEO-friendly URL slug)

Format each with the label followed by the value.`,
    },
  ],
  parseOutput: (raw) => {
    const meta: Record<string, string> = {};
    const lines = raw.split("\n");

    for (const line of lines) {
      const match = line.match(
        /^(?:\d+\.\s*)?(?:\*\*)?([A-Z\s_]+)(?:\*\*)?:\s*(.*)/
      );
      if (match) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
        meta[key] = match[2].trim();
      }
    }

    return { meta };
  },
};
