"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  History,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Eye,
  X,
  Copy,
  Download,
  ExternalLink,
} from "lucide-react";

interface RunItem {
  id: string;
  status: string;
  input: any;
  output: any;
  error: string | null;
  tokensCost: number;
  duration: number | null;
  createdAt: string;
  service: { name: string; slug: string };
  client: { name: string } | null;
}

export default function HistoryPage() {
  const [runs, setRuns] = useState<RunItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<RunItem | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, hasNext: false, hasPrev: false });

  const fetchRuns = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/runs?page=${p}&limit=20`);
      const result = await res.json();
      setRuns(result.data || []);
      setPagination(result.pagination || { totalPages: 1, hasNext: false, hasPrev: false });
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRuns(page);
  }, [page, fetchRuns]);

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedRun(null);
    }
    if (selectedRun) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedRun]);

  const statusConfig: Record<string, { icon: any; variant: any; label: string }> = {
    COMPLETED: { icon: CheckCircle, variant: "success", label: "Completed" },
    RUNNING: { icon: Loader2, variant: "default", label: "Running" },
    FAILED: { icon: AlertCircle, variant: "destructive", label: "Failed" },
    PENDING: { icon: Clock, variant: "secondary", label: "Pending" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Run History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View all your service executions</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : runs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No runs yet</p>
          <p className="text-sm mt-1">Launch a service to see results here</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {runs.map((run) => {
              const config = statusConfig[run.status] || statusConfig.PENDING;
              const Icon = config.icon;
              return (
                <Card key={run.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon
                        className={`w-5 h-5 ${
                          run.status === "COMPLETED"
                            ? "text-green-500"
                            : run.status === "FAILED"
                            ? "text-red-500"
                            : run.status === "RUNNING"
                            ? "text-blue-500 animate-spin"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {run.service.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {run.client?.name || "No client"} &middot;{" "}
                          {new Date(run.createdAt).toLocaleString()} &middot;{" "}
                          {run.tokensCost} tokens
                          {run.duration != null && (
                            <> &middot; {(run.duration / 1000).toFixed(1)}s</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.variant}>{config.label}</Badge>
                      {run.status === "COMPLETED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRun(run)}
                          aria-label="View result"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Result Modal */}
      {selectedRun && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">
                {selectedRun.service.name} — Result
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text =
                      selectedRun.output?.raw ||
                      JSON.stringify(selectedRun.output?.parsed, null, 2);
                    navigator.clipboard.writeText(text);
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = selectedRun.output?.raw || JSON.stringify(selectedRun.output?.parsed, null, 2);
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${selectedRun.service.slug}-result.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
                <a href={`/dashboard/marketplace/${selectedRun.service.slug}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" /> Re-run
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRun(null)}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {selectedRun.output?.raw ||
                  JSON.stringify(selectedRun.output?.parsed, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
