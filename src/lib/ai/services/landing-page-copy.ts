import { ServiceDefinition } from "./index";

export const landingPageCopy: ServiceDefinition = {
  slug: "landing-page-copy",
  name: "Landing Page Copy Generator",
  description:
    "Generate complete landing page copy: hero, features, social proof, FAQ, and CTA sections. Conversion-optimized and ready to use.",
  category: "CONVERSION",
  icon: "Layout",
  tokenCost: 35,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service Name",
      type: "text",
      placeholder: "e.g., TaskFlow - AI Project Management",
      required: true,
    },
    {
      name: "description",
      label: "What does it do?",
      type: "textarea",
      placeholder: "Describe your product in 2-3 sentences",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Remote teams of 5-50 people",
      required: true,
    },
    {
      name: "usp",
      label: "Unique Selling Point",
      type: "text",
      placeholder: "What makes you different from competitors?",
      required: true,
    },
    {
      name: "goal",
      label: "Page Goal",
      type: "select",
      required: true,
      options: [
        { label: "Sign up / Free trial", value: "signup" },
        { label: "Purchase / Buy now", value: "purchase" },
        { label: "Book a demo", value: "demo" },
        { label: "Download / Lead magnet", value: "download" },
        { label: "Waitlist", value: "waitlist" },
      ],
    },
    {
      name: "tone",
      label: "Brand Tone",
      type: "select",
      required: true,
      options: [
        { label: "Professional & Trust", value: "professional" },
        { label: "Bold & Disruptive", value: "bold" },
        { label: "Friendly & Approachable", value: "friendly" },
        { label: "Minimalist & Clean", value: "minimal" },
        { label: "Playful & Creative", value: "playful" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a conversion copywriter who builds landing pages that convert. You understand visual hierarchy, objection handling, and persuasion frameworks (PAS, AIDA, BAB). Write copy that can be directly placed into sections.`,
    },
    {
      role: "user",
      content: `Generate complete landing page copy for:

Product: ${input.product}
Description: ${input.description}
Audience: ${input.audience}
USP: ${input.usp}
Page Goal: ${input.goal}
Tone: ${input.tone}

Generate each section clearly labeled:

---HERO---
Headline (max 10 words, powerful)
Subheadline (1-2 sentences)
CTA Button Text
Social proof line (e.g., "Trusted by 500+ teams")

---PROBLEM---
3 pain points the audience faces (short, punchy)

---SOLUTION---
How the product solves each pain point (benefit-focused)

---FEATURES---
4 features with:
- Feature title
- One-line description
- Benefit statement

---SOCIAL PROOF---
3 fake but realistic testimonial quotes with name, role, company

---FAQ---
5 common objections as FAQ with answers

---FINAL CTA---
Headline
Subheadline
CTA Button Text
Urgency/scarcity line

Keep everything conversion-focused for the goal: ${input.goal}.`,
    },
  ],
  parseOutput: (raw) => {
    const sections: Record<string, string> = {};
    const parts = raw.split(/---([A-Z\s]+)---/);
    for (let i = 1; i < parts.length; i += 2) {
      const key = parts[i].trim().toLowerCase().replace(/\s+/g, "_");
      sections[key] = (parts[i + 1] || "").trim();
    }
    return { sections };
  },
};
