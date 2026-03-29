import { prisma } from "../prisma";
import { addTokens } from "../tokens";
import { getAIProvider } from "./provider";
import { getServiceBySlug } from "./services";
import { logger } from "../logger";

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
    throw new Error("Service not found");
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

  // ATOMIC: consume tokens + create run in single transaction
  const run = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    if (!user || user.tokenBalance < serviceDef.tokenCost) {
      throw new Error("Insufficient tokens");
    }

    await tx.user.update({
      where: { id: userId },
      data: { tokenBalance: { decrement: serviceDef.tokenCost } },
    });

    await tx.tokenLedger.create({
      data: {
        userId,
        amount: -serviceDef.tokenCost,
        type: "CONSUMPTION",
        description: `${serviceDef.name} execution`,
      },
    });

    return tx.run.create({
      data: {
        status: "RUNNING",
        input: input as any,
        tokensCost: serviceDef.tokenCost,
        userId,
        clientId: clientId || null,
        campaignId: campaignId || null,
        serviceId: service!.id,
      },
      include: { service: true },
    });
  });

  // Background execution with proper error catching
  processRunInBackground(run.id, serviceDef, input, userId).catch((err) => {
    logger.error("Unhandled background execution error", {
      runId: run.id,
      error: String(err),
    });
  });

  return run;
}

async function processRunInBackground(
  runId: string,
  serviceDef: ReturnType<typeof getServiceBySlug> & {},
  input: Record<string, any>,
  userId: string
) {
  const startTime = Date.now();

  try {
    const messages = serviceDef.buildPrompt(input);
    const provider = getAIProvider();
    const response = await provider.generate(messages);

    const parsedOutput = serviceDef.parseOutput(response.content);
    const duration = Date.now() - startTime;

    await prisma.run.update({
      where: { id: runId },
      data: {
        status: "COMPLETED",
        output: { raw: response.content, parsed: parsedOutput } as any,
        duration,
        completedAt: new Date(),
      },
    });

    logger.info("Run completed", { runId, service: serviceDef.slug, duration });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    try {
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "FAILED",
          error: error.message || "Unknown error",
          duration,
          completedAt: new Date(),
        },
      });

      await addTokens(
        userId,
        serviceDef.tokenCost,
        "REFUND",
        `Refund for failed ${serviceDef.name} (run: ${runId})`
      );
    } catch (refundErr) {
      logger.error("CRITICAL: Failed to refund tokens", {
        runId,
        userId,
        amount: serviceDef.tokenCost,
        error: String(refundErr),
      });
    }

    logger.error("Run failed", {
      runId,
      service: serviceDef.slug,
      error: error.message,
      duration,
    });
  }
}
