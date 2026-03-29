import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create services
  const serviceData = [
    {
      slug: "full-campaign-generator",
      name: "Full Campaign Generator",
      description: "Generate a complete marketing campaign in one click: hooks, ads, scripts, posts, emails, and a 7-day plan.",
      category: "CONTENT" as const,
      icon: "Rocket",
      tokenCost: 60,
      inputSchema: {},
    },
    {
      slug: "hook-generator",
      name: "Hook Generator",
      description: "Generate attention-grabbing hooks for ads, social media, and content.",
      category: "CONTENT" as const,
      icon: "Zap",
      tokenCost: 15,
      inputSchema: {},
    },
    {
      slug: "ad-copy-generator",
      name: "Ad Copy Generator",
      description: "Create high-converting ad copy for any platform.",
      category: "ADS" as const,
      icon: "Megaphone",
      tokenCost: 25,
      inputSchema: {},
    },
    {
      slug: "product-description-generator",
      name: "Product Page Generator",
      description: "Generate complete product descriptions optimized for e-commerce.",
      category: "CONTENT" as const,
      icon: "ShoppingBag",
      tokenCost: 20,
      inputSchema: {},
    },
    {
      slug: "content-repurposer",
      name: "Content Repurposer",
      description: "Transform any content into multiple formats.",
      category: "CONTENT" as const,
      icon: "RefreshCw",
      tokenCost: 20,
      inputSchema: {},
    },
    {
      slug: "seo-meta-generator",
      name: "SEO Meta Generator",
      description: "Generate SEO-optimized meta titles, descriptions, and keywords.",
      category: "SEO" as const,
      icon: "Search",
      tokenCost: 10,
      inputSchema: {},
    },
    {
      slug: "tiktok-script-generator",
      name: "TikTok Script Generator",
      description: "Generate viral TikTok video scripts with hooks, scenes, and CTAs.",
      category: "VIDEO" as const,
      icon: "Film",
      tokenCost: 20,
      inputSchema: {},
    },
    {
      slug: "email-subject-generator",
      name: "Email Subject Line Generator",
      description: "Generate high-open-rate email subject lines and preview text.",
      category: "EMAIL" as const,
      icon: "Mail",
      tokenCost: 10,
      inputSchema: {},
    },
    {
      slug: "landing-page-copy",
      name: "Landing Page Copy Generator",
      description: "Generate complete landing page copy: hero, features, FAQ, CTA.",
      category: "CONVERSION" as const,
      icon: "Layout",
      tokenCost: 35,
      inputSchema: {},
    },
    {
      slug: "social-media-calendar",
      name: "Social Media Calendar",
      description: "Generate a full week of social media posts with captions and hashtags.",
      category: "SOCIAL" as const,
      icon: "Calendar",
      tokenCost: 30,
      inputSchema: {},
    },
    {
      slug: "brand-voice-analyzer",
      name: "Brand Voice Analyzer",
      description: "Analyze content and extract a complete brand voice guide.",
      category: "ANALYTICS" as const,
      icon: "AudioLines",
      tokenCost: 25,
      inputSchema: {},
    },
    {
      slug: "angle-generator",
      name: "Marketing Angle Generator",
      description: "Generate 5-10 unique marketing angles with positioning and hooks.",
      category: "ADS" as const,
      icon: "Compass",
      tokenCost: 20,
      inputSchema: {},
    },
    {
      slug: "ad-analysis-tool",
      name: "Ad Analysis Tool",
      description: "Analyze any ad copy and get performance insights and improvements.",
      category: "ANALYTICS" as const,
      icon: "ScanSearch",
      tokenCost: 15,
      inputSchema: {},
    },
    {
      slug: "competitor-analysis",
      name: "Competitor Analysis Generator",
      description: "Analyze competitor marketing and find gaps to exploit.",
      category: "ANALYTICS" as const,
      icon: "Target",
      tokenCost: 25,
      inputSchema: {},
    },
    {
      slug: "email-sequence-generator",
      name: "Email Sequence Generator",
      description: "Generate complete email marketing sequences (3-7 emails).",
      category: "EMAIL" as const,
      icon: "Mails",
      tokenCost: 35,
      inputSchema: {},
    },
    {
      slug: "multi-variant-ad-generator",
      name: "Multi-Variant Ad Generator",
      description: "Generate 5-10 ad variations for A/B testing at scale.",
      category: "ADS" as const,
      icon: "Layers",
      tokenCost: 30,
      inputSchema: {},
    },
  ];

  for (const service of serviceData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log("Services seeded.");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@markai.io" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@markai.io",
      hashedPassword,
      agencyName: "Demo Agency",
      tokenBalance: 1000,
    },
  });

  // Add welcome bonus to ledger
  await prisma.tokenLedger.create({
    data: {
      userId: user.id,
      amount: 1000,
      type: "BONUS",
      description: "Welcome bonus - 1000 free tokens",
    },
  });

  // Create a demo client
  await prisma.client.upsert({
    where: { id: "demo-client" },
    update: {},
    create: {
      id: "demo-client",
      name: "Acme Corp",
      industry: "E-commerce",
      website: "https://acme.example.com",
      userId: user.id,
    },
  });

  console.log("Demo user created: demo@markai.io / demo1234");
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
