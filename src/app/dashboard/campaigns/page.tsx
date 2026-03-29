"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, X, Trash2 } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  client: { name: string } | null;
  _count: { runs: number };
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    clientId: "",
  });

  const [error, setError] = useState("");

  async function fetchData() {
    setError("");
    try {
      const [campRes, clientRes] = await Promise.all([
        fetch("/api/campaigns"),
        fetch("/api/clients"),
      ]);
      if (!campRes.ok) throw new Error("Failed to load campaigns");
      const campData = await campRes.json();
      const clientData = await clientRes.json();
      setCampaigns(campData.campaigns || []);
      setClients(clientData.clients || []);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", description: "", clientId: "" });
        setShowForm(false);
        fetchData();
      }
    } catch {}
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign?")) return;
    try {
      await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      fetchData();
    } catch {}
  }

  const statusVariant: Record<string, any> = {
    ACTIVE: "success",
    PAUSED: "warning",
    COMPLETED: "default",
    ARCHIVED: "secondary",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">
            Organize your marketing runs into campaigns
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <><X className="w-4 h-4 mr-2" /> Cancel</>
          ) : (
            <><Plus className="w-4 h-4 mr-2" /> New Campaign</>
          )}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Campaign</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Q1 Product Launch"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <Select
                    options={clients.map((c) => ({ label: c.name, value: c.id }))}
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Campaign description..."
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Campaign"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No campaigns yet</p>
          <p className="text-sm mt-1">Create a campaign to organize your work</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <FolderOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-xs text-gray-500">
                      {campaign.client?.name || "No client"} &middot; {campaign._count.runs} runs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
