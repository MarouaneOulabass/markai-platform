import { prisma } from "../prisma";
import { consumeTokens, addTokens } from "../tokens";
import { getAIProvider } from "./provider";
import { getServiceBySlug } from "./services";

interface ExecuteServiceParams {
  serviceSlug: string;
  input: Record<string, any>;
  userId: string;
  clientId?: string;
  campaignId?: string;
}

export async function executeService(params: ExecuteServiceParams) {
  const { serviceSlug, input, userId, clientId, campaignId } = params;

  const serviceDef = getServiceBySlug(serviceSlug);
  if (!serviceDef) {
    throw new Error(`Service not found: ${serviceSlug}`);
  }

  // Validate clientId belongs to user if provided
  if (clientId) {
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId },
    });
    if (!client) {
      throw new Error("Client not found or access denied");
    }
  }

  // Validate campaignId belongs to user if provided
  if (campaignId) {
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });
    if (!campaign) {
      throw new Error("Campaign not found or access denied");
    }
  }

  // Check tokens BEFORE creating run
  const hasTokens = await consumeTokens(
    userId,
    serviceDef.tokenCost,
    undefined,
    `${serviceDef.name} execution`
  );

  if (!hasTokens) {
    throw new Error("Insufficient tokens");
  }

  // Find or create the service in DB
  let service = await prisma.service.findUnique({
    where: { slug: serviceSlug },
  });

  if (!service) {
    service = await prisma.service.create({
      data: {
        slug: serviceDef.slug,
        name: serviceDef.name,
        description: serviceDef.description,
        category: serviceDef.category as any,
        icon: serviceDef.icon,
        tokenCost: serviceDef.tokenCost,
        inputSchema: serviceDef.inputSchema as any,
        isPremium: serviceDef.isPremium,
      },
    });
  }

  // Create run (tokens already consumed)
  const run = await prisma.run.create({
    data: {
      status: "RUNNING",
      input: input as any,
      tokensCost: serviceDef.tokenCost,
      userId,
      clientId: clientId || null,
      campaignId: campaignId || null,
      serviceId: service.id,
    },
  });

  const startTime = Date.now();

  try {
    const messages = serviceDef.buildPrompt(input);
    const provider = getAIProvider();
    const response = await provider.generate(messages);

    const parsedOutput = serviceDef.parseOutput(response.content);
    const duration = Date.now() - startTime;

    const completedRun = await prisma.run.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        output: {
          raw: response.content,
          parsed: parsedOutput,
        } as any,
        duration,
        completedAt: new Date(),
      },
      include: { service: true },
    });

    return completedRun;
  } catch (error: any) {
    const duration = Date.now() - startTime;

    await prisma.run.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        error: error.message || "Unknown error",
        duration,
        completedAt: new Date(),
      },
    });

    // Refund tokens on AI failure
    await addTokens(
      userId,
      serviceDef.tokenCost,
      "REFUND",
      `Refund for failed ${serviceDef.name} execution (run: ${run.id})`
    );

    throw error;
  }
}
