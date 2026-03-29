import { ServiceDefinition } from "./index";

export const contentRepurposer: ServiceDefinition = {
  slug: "content-repurposer",
  name: "Content Repurposer",
  description:
    "Transform any content into multiple formats. Turn a blog post into tweets, a video script into a newsletter, or an article into LinkedIn posts.",
  category: "CONTENT",
  icon: "RefreshCw",
  tokenCost: 20,
  isPremium: false,
  inputSchema: [
    {
      name: "content",
      label: "Original Content",
      type: "textarea",
      placeholder: "Paste the content you want to repurpose...",
      required: true,
    },
    {
      name: "sourceFormat",
      label: "Source Format",
      type: "select",
      required: true,
      options: [
        { label: "Blog Post / Article", value: "blog" },
        { label: "Video Script", value: "video_script" },
        { label: "Podcast Notes", value: "podcast" },
        { label: "Email / Newsletter", value: "email" },
        { label: "Presentation", value: "presentation" },
      ],
    },
    {
      name: "targetFormat",
      label: "Target Format",
      type: "select",
      required: true,
      options: [
        { label: "Twitter/X Thread", value: "twitter_thread" },
        { label: "LinkedIn Post", value: "linkedin" },
        { label: "Instagram Caption", value: "instagram" },
        { label: "TikTok Script", value: "tiktok" },
        { label: "Email Newsletter", value: "newsletter" },
        { label: "Blog Summary", value: "blog_summary" },
      ],
    },
    {
      name: "tone",
      label: "Desired Tone",
      type: "select",
      required: true,
      options: [
        { label: "Same as original", value: "original" },
        { label: "More casual", value: "casual" },
        { label: "More professional", value: "professional" },
        { label: "More engaging", value: "engaging" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a content repurposing expert. You transform content between formats while preserving the core message and adapting to platform conventions. You understand what works on each platform.`,
    },
    {
      role: "user",
      content: `Repurpose the following content:

ORIGINAL FORMAT: ${input.sourceFormat}
TARGET FORMAT: ${input.targetFormat}
TONE: ${input.tone}

ORIGINAL CONTENT:
${input.content}

Rules:
- Adapt to ${input.targetFormat} platform conventions and best practices
- Keep the core message and key insights
- Optimize for engagement on the target platform
- If Twitter thread: create 5-8 tweets, each under 280 chars
- If LinkedIn: use line breaks, emojis sparingly, professional tone
- If Instagram: include hashtag suggestions
- If TikTok script: include visual/action cues
- If Newsletter: include subject line, preview text, body
- If Blog summary: create a concise summary with key takeaways

Output the repurposed content ready to use.`,
    },
  ],
  parseOutput: (raw) => {
    return { repurposedContent: raw.trim() };
  },
};
