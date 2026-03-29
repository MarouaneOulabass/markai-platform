"use client";

import { useState } from "react";
import { services } from "@/lib/ai/services";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Megaphone,
  ShoppingBag,
  RefreshCw,
  Search,
  Coins,
  ArrowRight,
  Store,
  Film,
  Mail,
  Mails,
  Layout,
  Calendar,
  AudioLines,
  Compass,
  ScanSearch,
  Target,
  Layers,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = {
  Zap,
  Megaphone,
  ShoppingBag,
  RefreshCw,
  Search,
  Film,
  Mail,
  Mails,
  Layout,
  Calendar,
  AudioLines,
  Compass,
  ScanSearch,
  Target,
  Layers,
};

const categoryLabels: Record<string, string> = {
  ADS: "Advertising",
  CONTENT: "Content",
  VIDEO: "Video",
  SEO: "SEO",
  SOCIAL: "Social Media",
  EMAIL: "Email",
  ANALYTICS: "Analytics",
  CONVERSION: "Conversion",
};

const categoryColors: Record<string, string> = {
  ADS: "bg-red-100 text-red-700",
  CONTENT: "bg-blue-100 text-blue-700",
  VIDEO: "bg-purple-100 text-purple-700",
  SEO: "bg-green-100 text-green-700",
  SOCIAL: "bg-pink-100 text-pink-700",
  EMAIL: "bg-yellow-100 text-yellow-700",
  ANALYTICS: "bg-cyan-100 text-cyan-700",
  CONVERSION: "bg-orange-100 text-orange-700",
};

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      !selectedCategory || service.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-500 mt-1">
          Choose a service, configure it, and launch. It&apos;s that simple.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat === selectedCategory ? null : cat)
              }
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No services found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const Icon = iconMap[service.icon] || Zap;
            return (
              <Card
                key={service.slug}
                className="group hover:shadow-md hover:border-blue-200 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        categoryColors[service.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {categoryLabels[service.category] || service.category}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        {service.tokenCost}
                      </span>
                      <span className="text-xs text-gray-400">tokens</span>
                    </div>
                    <Link href={`/dashboard/marketplace/${service.slug}`}>
                      <Button size="sm" className="gap-1">
                        Launch <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>

                  {service.isPremium && (
                    <Badge variant="warning" className="mt-3">
                      Premium
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
