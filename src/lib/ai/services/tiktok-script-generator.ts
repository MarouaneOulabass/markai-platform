import { ServiceDefinition } from "./index";

export const tiktokScriptGenerator: ServiceDefinition = {
  slug: "tiktok-script-generator",
  name: "TikTok Script Generator",
  description:
    "Generate viral TikTok video scripts with hooks, scenes, transitions, and CTAs. Optimized for short-form vertical video.",
  category: "VIDEO",
  icon: "Film",
  tokenCost: 20,
  isPremium: false,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., Skincare routine kit",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Women 18-30 interested in skincare",
      required: true,
    },
    {
      name: "videoStyle",
      label: "Video Style",
      type: "select",
      required: true,
      options: [
        { label: "UGC / Testimonial", value: "ugc" },
        { label: "Before & After", value: "before_after" },
        { label: "Tutorial / How-To", value: "tutorial" },
        { label: "Storytelling", value: "story" },
        { label: "Trend / Challenge", value: "trend" },
        { label: "Product Demo", value: "demo" },
      ],
    },
    {
      name: "duration",
      label: "Video Duration",
      type: "select",
      required: true,
      options: [
        { label: "15 seconds", value: "15s" },
        { label: "30 seconds", value: "30s" },
        { label: "60 seconds", value: "60s" },
      ],
    },
    {
      name: "cta",
      label: "Call to Action",
      type: "text",
      placeholder: "e.g., Link in bio, Shop now, Follow for more",
      required: true,
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a TikTok content strategist who creates viral video scripts. You understand TikTok trends, pacing, and what makes people watch until the end. You write scripts with clear visual directions.`,
    },
    {
      role: "user",
      content: `Create a TikTok video script for:

Product: ${input.product}
Target Audience: ${input.audience}
Video Style: ${input.videoStyle}
Duration: ${input.duration}
CTA: ${input.cta}

Generate a complete script with:
1. HOOK (first 3 seconds — must stop the scroll)
2. SCENE-BY-SCENE breakdown with:
   - [VISUAL]: What appears on screen
   - [TEXT OVERLAY]: On-screen text
   - [VOICEOVER]: What the narrator says
   - [TIMING]: Approximate duration
3. CTA (final seconds)
4. CAPTION: TikTok caption with hashtags
5. SOUND SUGGESTION: Type of audio/music

Make it feel native to TikTok — casual, authentic, fast-paced.`,
    },
  ],
  parseOutput: (raw) => {
    return { script: raw.trim() };
  },
};
