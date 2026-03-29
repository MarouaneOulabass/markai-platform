import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create services
  const serviceData = [
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
