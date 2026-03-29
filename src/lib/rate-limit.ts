import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production for multi-instance)
const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}, 300_000);

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max } = options;

  return function check(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now > entry.resetAt) {
      store.set(identifier, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: max - 1 };
    }

    if (entry.count >= max) {
      return { success: false, remaining: 0 };
    }

    entry.count++;
    return { success: true, remaining: max - entry.count };
  };
}

// Pre-configured limiters
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }); // 20 per 15min
export const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }); // 5 per hour
export const executeLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 }); // 10 per minute
export const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 }); // 60 per minute

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
