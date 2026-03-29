import { ServiceDefinition } from "./index";

export const fullCampaignGenerator: ServiceDefinition = {
  slug: "full-campaign-generator",
  name: "Full Campaign Generator",
  description:
    "Generate a complete marketing campaign in one click: 10 hooks, 3 ad scripts, 5 social posts, 3 email subjects, and a 7-day content plan. Everything you need to launch.",
  category: "CONTENT",
  icon: "Rocket",
  tokenCost: 60,
  isPremium: true,
  inputSchema: [
    {
      name: "product",
      label: "Product / Service",
      type: "text",
      placeholder: "e.g., Online language learning app",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., Young professionals 22-35 who want to learn Spanish",
      required: true,
    },
    {
      name: "usp",
      label: "Unique Selling Point",
      type: "textarea",
      placeholder: "What makes your product special? Key benefits?",
      required: true,
    },
    {
      name: "objective",
      label: "Campaign Objective",
      type: "select",
      required: true,
      options: [
        { label: "Product Launch", value: "launch" },
        { label: "Drive Sales / Conversions", value: "sales" },
        { label: "Lead Generation", value: "leads" },
        { label: "Brand Awareness", value: "awareness" },
        { label: "App Install", value: "install" },
      ],
    },
    {
      name: "platforms",
      label: "Primary Platform",
      type: "select",
      required: true,
      options: [
        { label: "Instagram + Facebook", value: "meta" },
        { label: "TikTok", value: "tiktok" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Multi-platform", value: "multi" },
      ],
    },
    {
      name: "tone",
      label: "Brand Tone",
      type: "select",
      required: true,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Casual & Fun", value: "casual" },
        { label: "Bold & Disruptive", value: "bold" },
        { label: "Warm & Inspiring", value: "warm" },
        { label: "Edgy & Direct", value: "edgy" },
      ],
    },
    {
      name: "offer",
      label: "Offer / CTA",
      type: "text",
      placeholder: "e.g., 7-day free trial, 30% off launch, Join waitlist",
      required: true,
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are a full-service marketing agency creative director. You produce complete campaign packages that are ready to execute. Every piece you create must be cohesive — same voice, same angle, building on each other. You think in campaigns, not isolated assets.`,
    },
    {
      role: "user",
      content: `Create a COMPLETE marketing campaign for:

Product: ${input.product}
Audience: ${input.audience}
USP: ${input.usp}
Objective: ${input.objective}
Platform: ${input.platforms}
Tone: ${input.tone}
Offer: ${input.offer}

Generate ALL of the following in one cohesive campaign:

============================
SECTION 1: CAMPAIGN STRATEGY
============================
- Campaign name (catchy, internal reference)
- Core message (one sentence that ties everything together)
- Primary angle (the main positioning approach)
- Emotional driver (the core emotion we're targeting)
- Success metrics (what to measure)

============================
SECTION 2: HOOKS (10)
============================
Generate 10 scroll-stopping hooks. Number them. Mix:
- 3 pain-point hooks
- 3 curiosity hooks
- 2 urgency hooks
- 2 social proof hooks

============================
SECTION 3: AD COPY (3 variants)
============================
For each variant:
AD [X]:
- Angle:
- Headline (under 40 chars):
- Body (under 125 chars):
- CTA:
- Visual direction:

============================
SECTION 4: VIDEO AD SCRIPTS (2)
============================
For each script:
SCRIPT [X]:
- Format: (UGC/talking head/product demo/story)
- Duration: 30s
- Hook (first 3 sec):
- Scene breakdown (3-4 scenes with voiceover + visual):
- CTA:
- Text overlay suggestions:

============================
SECTION 5: SOCIAL POSTS (5)
============================
5 ready-to-publish posts for ${input.platforms}:
POST [X]:
- Type: (carousel/reel/story/static)
- Caption:
- Hashtags (5-8):
- Visual idea:

============================
SECTION 6: EMAIL SUBJECTS (5)
============================
5 email subject lines + preview text for this campaign.

============================
SECTION 7: 7-DAY LAUNCH PLAN
============================
Day-by-day plan:
Day 1: [action] — [what to publish/launch]
Day 2: ...
...
Day 7: ...

Keep everything cohesive. Same voice, same angle, building momentum across all assets.`,
    },
  ],
  parseOutput: (raw) => {
    const sections: Record<string, string> = {};
    const parts = raw.split(/={3,}\n?SECTION \d+:\s*/i);
    for (let i = 1; i < parts.length; i++) {
      const lines = parts[i].split("\n");
      const title = (lines[0] || "").replace(/=+/g, "").trim().toLowerCase().replace(/[\s()]+/g, "_");
      sections[title] = parts[i].replace(lines[0], "").replace(/=+/g, "").trim();
    }
    return { campaign: raw.trim(), sections };
  },
};
