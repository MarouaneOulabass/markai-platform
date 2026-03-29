import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const run = await prisma.run.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { service: true, client: true },
  });

  if (!run) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(run);
}
