import { AIMessage } from "../provider";

export interface ServiceDefinition {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tokenCost: number;
  isPremium: boolean;
  inputSchema: InputField[];
  buildPrompt: (input: Record<string, any>) => AIMessage[];
  parseOutput: (raw: string) => Record<string, any>;
}

export interface InputField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

// Import all services
import { hookGenerator } from "./hook-generator";
import { adCopyGenerator } from "./ad-copy-generator";
import { productDescriptionGenerator } from "./product-description-generator";
import { contentRepurposer } from "./content-repurposer";
import { seoMetaGenerator } from "./seo-meta-generator";
import { tiktokScriptGenerator } from "./tiktok-script-generator";
import { emailSubjectGenerator } from "./email-subject-generator";
import { landingPageCopy } from "./landing-page-copy";
import { socialMediaCalendar } from "./social-media-calendar";
import { brandVoiceAnalyzer } from "./brand-voice-analyzer";

export const services: ServiceDefinition[] = [
  hookGenerator,
  adCopyGenerator,
  productDescriptionGenerator,
  contentRepurposer,
  seoMetaGenerator,
  tiktokScriptGenerator,
  emailSubjectGenerator,
  landingPageCopy,
  socialMediaCalendar,
  brandVoiceAnalyzer,
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return services.find((s) => s.slug === slug);
}
