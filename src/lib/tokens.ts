import { prisma } from "./prisma";

export async function getTokenBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true },
  });
  return user?.tokenBalance ?? 0;
}

export async function consumeTokens(
  userId: string,
  amount: number,
  runId?: string,
  description?: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true },
  });

  if (!user || user.tokenBalance < amount) {
    return false;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { tokenBalance: { decrement: amount } },
    }),
    prisma.tokenLedger.create({
      data: {
        userId,
        amount: -amount,
        type: "CONSUMPTION",
        runId: runId ?? null,
        description: description ?? `Service execution`,
      },
    }),
  ]);

  return true;
}

export async function addTokens(
  userId: string,
  amount: number,
  type: "PURCHASE" | "BONUS" | "REFUND",
  description?: string
): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { tokenBalance: { increment: amount } },
    }),
    prisma.tokenLedger.create({
      data: {
        userId,
        amount,
        type,
        description: description ?? `${type.toLowerCase()} of ${amount} tokens`,
      },
    }),
  ]);
}
