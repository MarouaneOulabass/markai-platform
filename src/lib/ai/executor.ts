import { prisma } from "../prisma";
import { consumeTokens, addTokens } from "../tokens";
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

/**
 * Starts a service execution: validates, consumes tokens, creates run,
 * then kicks off AI generation in the background.
 * Returns the run immediately (status: RUNNING).
 */
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

  // Create run record (status: RUNNING)
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
    include: { service: true },
  });

  // Fire-and-forget: execute AI in background
  processRunInBackground(run.id, serviceDef, input, userId);

  return run;
}

/**
 * Runs AI generation in the background, updates run on completion/failure.
 */
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
        output: {
          raw: response.content,
          parsed: parsedOutput,
        } as any,
        duration,
        completedAt: new Date(),
      },
    });

    logger.info("Service execution completed", {
      runId,
      service: serviceDef.slug,
      duration,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    await prisma.run.update({
      where: { id: runId },
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
      `Refund for failed ${serviceDef.name} execution (run: ${runId})`
    );

    logger.error("Service execution failed", {
      runId,
      service: serviceDef.slug,
      error: error.message,
      duration,
    });
  }
}
