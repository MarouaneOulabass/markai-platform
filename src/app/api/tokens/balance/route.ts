import { auth } from "@/lib/auth";
import { getTokenBalance } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const balance = await getTokenBalance(session.user.id);
  return NextResponse.json({ balance });
}
