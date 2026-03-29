"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  X,
  Building2,
  Globe,
  Zap,
  Trash2,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  notes: string | null;
  _count: { runs: number };
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    notes: "",
  });

  async function fetchClients() {
    setError("");
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to load clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch (e: any) {
      setError(e.message || "Failed to load clients");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", industry: "", website: "", notes: "" });
        setShowForm(false);
        fetchClients();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create client");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            Manage your clients and track their campaigns
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="w-4 h-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </>
          )}
        </Button>
      </div>

      {/* New Client Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Acme Corp"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <Input
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    placeholder="E-commerce, SaaS, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <Input
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Any relevant notes about the client..."
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create Client"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Client List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No clients yet</p>
          <p className="text-sm mt-1">Add your first client to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900">{client.name}</h3>

                {client.industry && (
                  <p className="text-sm text-gray-500 mt-1">
                    {client.industry}
                  </p>
                )}

                {client.website && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Globe className="w-3 h-3" />
                    {client.website}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs text-gray-500">
                      {client._count.runs} runs
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Added{" "}
                    {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
