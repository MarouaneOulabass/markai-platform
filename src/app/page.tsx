import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Coins,
  Users,
  BarChart3,
  Shield,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Services",
    description:
      "Launch marketing campaigns with AI. Generate ads, content, hooks — in seconds.",
  },
  {
    icon: Coins,
    title: "Pay Per Use",
    description:
      "Token-based pricing. See the cost before you run. No hidden fees, no subscriptions.",
  },
  {
    icon: Users,
    title: "Multi-Client",
    description:
      "Manage multiple clients from one dashboard. Track results and spending per client.",
  },
  {
    icon: BarChart3,
    title: "Track Everything",
    description:
      "Full history of every run. See what worked, measure performance, optimize continuously.",
  },
  {
    icon: Shield,
    title: "Open Source First",
    description:
      "No vendor lock-in. Pluggable AI providers. You own your data and your pipeline.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Choose, Configure, Launch, Get results. No learning curve, no complexity.",
  },
];

const servicesList = [
  { name: "Full Campaign Generator", tokens: 60, category: "Premium" },
  { name: "Hook Generator", tokens: 15, category: "Content" },
  { name: "Ad Copy Generator", tokens: 25, category: "Ads" },
  { name: "Angle Generator", tokens: 20, category: "Ads" },
  { name: "Multi-Variant Ads", tokens: 30, category: "Ads" },
  { name: "Ad Analysis Tool", tokens: 15, category: "Analytics" },
  { name: "Competitor Analysis", tokens: 25, category: "Analytics" },
  { name: "Email Sequences", tokens: 35, category: "Email" },
  { name: "TikTok Scripts", tokens: 20, category: "Video" },
  { name: "Landing Page Copy", tokens: 35, category: "Conversion" },
  { name: "Social Calendar", tokens: 30, category: "Social" },
  { name: "SEO Meta Generator", tokens: 10, category: "SEO" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MarkAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Marketing Automation, Simplified
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            The App Store for
            <br />
            <span className="text-blue-600">Marketing Automation</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Stop juggling 10+ tools. One platform, all your marketing services.
            Choose, launch, get results. Powered by AI.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg text-base transition-colors"
            >
              Start Free — 500 Tokens
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-lg text-base transition-colors"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            No credit card required. Start generating in 30 seconds.
          </p>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Services Ready to Launch
            </h2>
            <p className="mt-3 text-gray-500">
              Each service is an app. Configure and launch in seconds.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {servicesList.map((service) => (
              <div
                key={service.name}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs font-semibold text-gray-600">
                      {service.tokens}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-3 text-gray-500">
              Built for agencies and freelancers who need to move fast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose",
                description: "Browse the marketplace and pick a service",
              },
              {
                step: "2",
                title: "Configure",
                description: "Fill in your product, audience, and preferences",
              },
              {
                step: "3",
                title: "Launch",
                description: "Get results instantly. Copy, download, use.",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Automate Your Marketing?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join agencies already saving hours every week.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-600">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">MarkAI</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MarkAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
