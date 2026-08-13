import type { Request, Response, NextFunction } from "express";

type Bucket = { startedAt: number; count: number };

export function createRateWindowGate({ windowMs, maxRequests, now = () => Date.now() }: { windowMs: number; maxRequests: number; now?: () => number }) {
  const buckets = new Map<string, Bucket>();
  return (key: string) => {
    const current = now();
    const bucket = buckets.get(key);
    if (!bucket || current - bucket.startedAt >= windowMs) {
      buckets.set(key, { startedAt: current, count: 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    bucket.count += 1;
    if (bucket.count <= maxRequests) return { allowed: true, retryAfterSeconds: 0 };
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (current - bucket.startedAt)) / 1000)) };
  };
}

export function createTrpcRateLimitMiddleware() {
  const gate = createRateWindowGate({ windowMs: 60_000, maxRequests: 120 });
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") return next();
    const result = gate(req.ip || "unknown");
    if (result.allowed) return next();
    res.setHeader("Retry-After", String(result.retryAfterSeconds));
    res.status(429).json({ error: "rate_limited", retryAfterSeconds: result.retryAfterSeconds });
  };
}
