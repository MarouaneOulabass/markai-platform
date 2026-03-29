"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  TrendingDown,
  TrendingUp,
  Gift,
  RotateCcw,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface LedgerEntry {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
}

const tokenPacks = [
  { id: "starter", amount: 500, price: 9.99, label: "Starter", popular: false },
  { id: "growth", amount: 2000, price: 29.99, label: "Growth", popular: true },
  { id: "pro", amount: 5000, price: 59.99, label: "Pro", popular: false },
  { id: "agency", amount: 15000, price: 149.99, label: "Agency", popular: false },
];

export default function TokensPage() {
  const searchParams = useSearchParams();
  const [balance, setBalance] = useState<number | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingPack, setBuyingPack] = useState<string | null>(null);
  const success = searchParams.get("success");

  useEffect(() => {
    Promise.all([
      fetch("/api/tokens/balance").then((r) => r.json()),
      fetch("/api/tokens/ledger").then((r) => r.json()),
    ])
      .then(([balData, ledData]) => {
        setBalance(balData.balance);
        setLedger(ledData.entries || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleBuy(packId: string) {
    setBuyingPack(packId);
    try {
      const res = await fetch("/api/tokens/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
        setBuyingPack(null);
      }
    } catch {
      alert("Something went wrong");
      setBuyingPack(null);
    }
  }

  const typeConfig: Record<string, { icon: any; color: string; variant: any }> = {
    PURCHASE: { icon: TrendingUp, color: "text-green-500", variant: "success" },
    CONSUMPTION: { icon: TrendingDown, color: "text-red-500", variant: "destructive" },
    REFUND: { icon: RotateCcw, color: "text-blue-500", variant: "default" },
    BONUS: { icon: Gift, color: "text-purple-500", variant: "secondary" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tokens</h1>
        <p className="text-gray-500 mt-1">
          Manage your token balance and purchase more
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            Payment successful! Your tokens have been added to your account.
          </p>
        </div>
      )}

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-8 h-8 text-yellow-300" />
            <span className="text-lg font-medium text-blue-100">
              Current Balance
            </span>
          </div>
          <p className="text-4xl font-bold">
            {balance !== null ? balance.toLocaleString() : "..."}{" "}
            <span className="text-lg font-normal text-blue-200">tokens</span>
          </p>
        </CardContent>
      </Card>

      {/* Token Packs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Buy Tokens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tokenPacks.map((pack) => (
            <Card
              key={pack.id}
              className={`relative hover:shadow-md transition-shadow ${
                pack.popular ? "border-blue-500 ring-1 ring-blue-500" : ""
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {pack.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {pack.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mb-4">tokens</p>
                <p className="text-xl font-semibold text-gray-900 mb-4">
                  ${pack.price}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  ${((pack.price / pack.amount) * 100).toFixed(1)}¢ per token
                </p>
                <Button
                  className="w-full"
                  variant={pack.popular ? "default" : "outline"}
                  disabled={buyingPack !== null}
                  onClick={() => handleBuy(pack.id)}
                >
                  {buyingPack === pack.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : ledger.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ledger.map((entry) => {
                const config = typeConfig[entry.type] || typeConfig.CONSUMPTION;
                const Icon = config.icon;
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <div>
                        <p className="text-sm text-gray-900">
                          {entry.description || entry.type}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(entry.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        entry.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {entry.amount > 0 ? "+" : ""}
                      {entry.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
