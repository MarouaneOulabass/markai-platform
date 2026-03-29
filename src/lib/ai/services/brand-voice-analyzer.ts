import { ServiceDefinition } from "./index";

export const brandVoiceAnalyzer: ServiceDefinition = {
  slug: "brand-voice-analyzer",
  name: "Brand Voice Analyzer",
  description:
    "Analyze your existing content and extract a complete brand voice guide. Get tone, vocabulary, style rules, and do's & don'ts for consistent messaging.",
  category: "ANALYTICS",
  icon: "AudioLines",
  tokenCost: 25,
  isPremium: false,
  inputSchema: [
    {
      name: "sampleContent",
      label: "Sample Content (paste 3-5 pieces)",
      type: "textarea",
      placeholder: "Paste your existing website copy, social posts, emails, or any brand content...",
      required: true,
    },
    {
      name: "brandName",
      label: "Brand Name",
      type: "text",
      placeholder: "e.g., Acme Inc",
      required: true,
    },
    {
      name: "industry",
      label: "Industry",
      type: "text",
      placeholder: "e.g., Fintech, Fashion, Food & Beverage",
      required: true,
    },
    {
      name: "outputFormat",
      label: "Output Format",
      type: "select",
      required: true,
      options: [
        { label: "Full Brand Voice Guide", value: "full" },
        { label: "Quick Summary (1-page)", value: "summary" },
        { label: "Style Rules Only", value: "rules" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a brand strategist who specializes in voice and tone analysis. You can deconstruct any brand's communication patterns and create actionable guidelines for content teams.`,
    },
    {
      role: "user",
      content: `Analyze the following brand content and create a brand voice guide:

Brand: ${input.brandName}
Industry: ${input.industry}
Output Format: ${input.outputFormat}

SAMPLE CONTENT:
${input.sampleContent}

Generate a brand voice analysis with:

1. VOICE SUMMARY: 3-word brand voice description (e.g., "Bold, Warm, Direct")

2. TONE ATTRIBUTES: Rate each 1-5 with explanation
   - Formal ←→ Casual
   - Serious ←→ Playful
   - Reserved ←→ Enthusiastic
   - Technical ←→ Simple

3. VOCABULARY:
   - Words TO USE (10 on-brand words)
   - Words TO AVOID (10 off-brand words)
   - Signature phrases detected

4. STYLE RULES:
   - Sentence length preference
   - Active vs passive voice
   - Punctuation patterns
   - Emoji usage
   - Capitalization style

5. DO'S AND DON'TS:
   - 5 specific do's with examples
   - 5 specific don'ts with examples

6. PLATFORM ADAPTATION:
   - How to adapt this voice for: Website, Email, Social Media, Ads

Make it actionable — a content writer should be able to follow this guide immediately.`,
    },
  ],
  parseOutput: (raw) => {
    return { voiceGuide: raw.trim() };
  },
};
