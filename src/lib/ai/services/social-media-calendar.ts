import { ServiceDefinition } from "./index";

export const socialMediaCalendar: ServiceDefinition = {
  slug: "social-media-calendar",
  name: "Social Media Calendar",
  description:
    "Generate a full week of social media posts for any platform. Includes captions, hashtags, posting times, and content themes.",
  category: "SOCIAL",
  icon: "Calendar",
  tokenCost: 30,
  isPremium: false,
  inputSchema: [
    {
      name: "brand",
      label: "Brand / Business",
      type: "text",
      placeholder: "e.g., Organic coffee roastery",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Coffee lovers, millennials, health-conscious",
      required: true,
    },
    {
      name: "platform",
      label: "Platform",
      type: "select",
      required: true,
      options: [
        { label: "Instagram", value: "instagram" },
        { label: "TikTok", value: "tiktok" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Twitter/X", value: "twitter" },
        { label: "Facebook", value: "facebook" },
      ],
    },
    {
      name: "postsPerWeek",
      label: "Posts Per Week",
      type: "select",
      required: true,
      options: [
        { label: "3 posts", value: "3" },
        { label: "5 posts", value: "5" },
        { label: "7 posts (daily)", value: "7" },
      ],
    },
    {
      name: "goals",
      label: "Content Goals",
      type: "select",
      required: true,
      options: [
        { label: "Brand Awareness", value: "awareness" },
        { label: "Engagement & Community", value: "engagement" },
        { label: "Drive Sales", value: "sales" },
        { label: "Educate & Inform", value: "educate" },
        { label: "Mix of Everything", value: "mix" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a social media strategist who plans content calendars that drive consistent engagement. You understand platform algorithms, optimal posting times, and content mix strategies.`,
    },
    {
      role: "user",
      content: `Create a 1-week social media calendar for:

Brand: ${input.brand}
Audience: ${input.audience}
Platform: ${input.platform}
Posts per week: ${input.postsPerWeek}
Content goals: ${input.goals}

For each post, provide:
- DAY & TIME: Best posting time
- CONTENT TYPE: (carousel, reel, story, static, text, poll, etc.)
- THEME: Content pillar / theme
- CAPTION: Full caption ready to post
- HASHTAGS: 5-10 relevant hashtags
- VISUAL IDEA: Brief description of what the image/video should show
- CTA: What action to drive

Also include:
- A weekly CONTENT MIX summary (% educational, promotional, entertaining, etc.)
- 3 ENGAGEMENT TIPS specific to ${input.platform}

Format clearly by day.`,
    },
  ],
  parseOutput: (raw) => {
    return { calendar: raw.trim() };
  },
};
