import { ServiceDefinition } from "./index";

export const emailSubjectGenerator: ServiceDefinition = {
  slug: "email-subject-generator",
  name: "Email Subject Line Generator",
  description:
    "Generate high-open-rate email subject lines and preview text. A/B test variants included. Optimized for deliverability and engagement.",
  category: "EMAIL",
  icon: "Mail",
  tokenCost: 10,
  isPremium: false,
  inputSchema: [
    {
      name: "emailTopic",
      label: "Email Topic / Content",
      type: "textarea",
      placeholder: "What is the email about?",
      required: true,
    },
    {
      name: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g., SaaS founders, e-commerce buyers",
      required: true,
    },
    {
      name: "emailType",
      label: "Email Type",
      type: "select",
      required: true,
      options: [
        { label: "Promotional / Sale", value: "promo" },
        { label: "Newsletter", value: "newsletter" },
        { label: "Product Launch", value: "launch" },
        { label: "Welcome / Onboarding", value: "welcome" },
        { label: "Re-engagement", value: "reengagement" },
        { label: "Cart Abandonment", value: "cart" },
      ],
    },
    {
      name: "tone",
      label: "Tone",
      type: "select",
      required: true,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Casual & Friendly", value: "casual" },
        { label: "Urgent / FOMO", value: "urgent" },
        { label: "Curious / Intriguing", value: "curious" },
        { label: "Personal", value: "personal" },
      ],
    },
  ],
  buildPrompt: (input) => [
    {
      role: "system",
      content: `You are an email marketing expert who specializes in writing subject lines that get opened. You understand deliverability, spam triggers, and psychology of the inbox.`,
    },
    {
      role: "user",
      content: `Generate email subject lines for:

Topic: ${input.emailTopic}
Audience: ${input.audience}
Email Type: ${input.emailType}
Tone: ${input.tone}

Generate:
1. 10 SUBJECT LINES (numbered, max 50 characters each)
2. For each subject line, a matching PREVIEW TEXT (max 90 characters)
3. Mark your TOP 3 picks with a star (*)
4. For the top 3, explain briefly WHY they work

Rules:
- Avoid spam trigger words (FREE, ACT NOW, etc.)
- Mix techniques: question, number, curiosity gap, personalization, urgency
- Keep under 50 chars (mobile-optimized)
- Preview text should complement, not repeat the subject`,
    },
  ],
  parseOutput: (raw) => {
    return { subjectLines: raw.trim() };
  },
};
