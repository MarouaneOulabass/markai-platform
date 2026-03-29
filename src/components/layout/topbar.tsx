"use client";

import { useSession } from "next-auth/react";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar() {
  const { data: session } = useSession();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/tokens/balance");
        if (res.ok) {
          const data = await res.json();
          setTokenBalance(data.balance);
        }
      } catch {}
    }
    if (session?.user) fetchBalance();
  }, [session]);

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
      <div className="pl-10 lg:pl-0">
        <h2 className="text-sm text-gray-500">Welcome back,</h2>
        <p className="text-sm font-semibold text-gray-900">
          {session?.user?.name || "User"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Token balance */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold text-gray-900">
            {tokenBalance !== null ? tokenBalance.toLocaleString() : "..."}
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">tokens</span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {(session?.user?.name && session.user.name.length > 0)
            ? session.user.name[0].toUpperCase()
            : "U"}
        </div>
      </div>
    </header>
  );
}
