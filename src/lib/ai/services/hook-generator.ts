import { ServiceDefinition } from "./index";

export const hookGenerator: ServiceDefinition = {
  slug: "hook-generator",
  name: "Hook Generator",
  description:
    "Generate attention-grabbing hooks for ads, social media, and content. Get 10 high-converting hooks tailored to your product and audience.",
  category: "CONTENT",
  icon: "Zap",
  tokenCost: 15,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., AI-powered fitness app",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Busy professionals aged 25-40",
      required: true,
    },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      required: true,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Casual", value: "casual" },
        { label: "Urgent", value: "urgent" },
        { label: "Inspirational", value: "inspirational" },
        { label: "Provocative", value: "provocative" },
      ],
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      required: true,
      options: [
        { label: "TikTok", value: "tiktok" },
        { label: "Instagram", value: "instagram" },
        { label: "Facebook", value: "facebook" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "YouTube", value: "youtube" },
        { label: "Twitter/X", value: "twitter" },
        { label: "General", value: "general" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are an expert copywriter specializing in viral hooks and attention-grabbing openers. You write hooks that stop the scroll and drive engagement. Always output exactly 10 hooks, numbered 1-10.`,
    },
    {
      role: "user",
      content: `Generate 10 powerful hooks for the following:

Product/Service: ${input.product}
Target Audience: ${input.audience}
Tone: ${input.tone}
Platform: ${input.platform}

Requirements:
- Each hook must be under 15 words
- Hooks should trigger curiosity, urgency, or emotion
- Adapt style to the platform (${input.platform})
- Mix different hook formulas (question, statement, statistic, story, challenge)
- Number each hook 1-10

Output ONLY the 10 hooks, one per line, numbered.`,
    },
  ],
  parseOutput: (raw) => {
    const hooks = raw
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0);
    return { hooks };
  },
};
