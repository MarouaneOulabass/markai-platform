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
  if (amount <= 0) return false;

  // Atomic: decrement only if balance >= amount (prevents race condition)
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { tokenBalance: true },
      });

      if (!user || user.tokenBalance < amount) {
        throw new Error("INSUFFICIENT_TOKENS");
      }

      await tx.user.update({
        where: { id: userId },
        data: { tokenBalance: { decrement: amount } },
      });

      await tx.tokenLedger.create({
        data: {
          userId,
          amount: -amount,
          type: "CONSUMPTION",
          runId: runId ?? null,
          description: description ?? "Service execution",
        },
      });

      return true;
    });

    return result;
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_TOKENS") return false;
    throw error;
  }
}

export async function addTokens(
  userId: string,
  amount: number,
  type: "PURCHASE" | "BONUS" | "REFUND",
  description?: string
): Promise<void> {
  if (amount <= 0) return;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { tokenBalance: { increment: amount } },
    });

    await tx.tokenLedger.create({
      data: {
        userId,
        amount,
        type,
        description: description ?? `${type.toLowerCase()} of ${amount} tokens`,
      },
    });
  });
}
