import { prisma } from "../prisma";
import { consumeTokens } from "../tokens";
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

  // Create the run record
  const run = await prisma.run.create({
    data: {
      status: "PENDING",
      input: input as any,
      tokensCost: serviceDef.tokenCost,
      userId,
      clientId: clientId || null,
      campaignId: campaignId || null,
      serviceId: service.id,
    },
  });

  // Check and consume tokens
  const hasTokens = await consumeTokens(
    userId,
    serviceDef.tokenCost,
    run.id,
    `${serviceDef.name} execution`
  );

  if (!hasTokens) {
    await prisma.run.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        error: "Insufficient tokens",
        completedAt: new Date(),
      },
    });
    throw new Error("Insufficient tokens");
  }

  // Update status to running
  await prisma.run.update({
    where: { id: run.id },
    data: { status: "RUNNING" },
  });

  const startTime = Date.now();

  try {
    // Build the prompt and execute
    const messages = serviceDef.buildPrompt(input);
    const provider = getAIProvider();
    const response = await provider.generate(messages);

    // Parse the output
    const parsedOutput = serviceDef.parseOutput(response.content);

    const duration = Date.now() - startTime;

    // Update run with results
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
      include: {
        service: true,
      },
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

    // Refund tokens on failure
    const { addTokens } = await import("../tokens");
    await addTokens(
      userId,
      serviceDef.tokenCost,
      "REFUND",
      `Refund for failed ${serviceDef.name} execution`
    );

    throw error;
  }
}
