"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/providers/theme-provider";
import { useToast } from "@/components/ui/toast";
import { Save, Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    agencyName: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          agencyName: data.agencyName || "",
        });
      })
      .catch(() => {});
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast("Profile saved successfully", "success");
      } else {
        toast("Failed to save profile", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    }
    setSaving(false);
  }

  const themeOptions = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input value={session?.user?.email || ""} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agency Name
              </label>
              <Input
                value={form.agencyName}
                onChange={(e) =>
                  setForm({ ...form, agencyName: e.target.value })
                }
                placeholder="Your Agency"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose your preferred theme.
          </p>
          <div className="flex gap-3">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  theme === opt.value
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">AI Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Configure which AI provider to use. Set via environment variables.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 font-mono text-xs text-gray-600 dark:text-gray-400">
            <p>AI_PROVIDER={process.env.NEXT_PUBLIC_AI_PROVIDER || "ollama"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
