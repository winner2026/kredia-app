type Bucket = {
  count: number;
  windowStart: number;
};

const buckets = new Map<string, Bucket>();

function getKey(req: Request, overrideKey?: string) {
  if (overrideKey) return overrideKey;
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "anonymous";
  return "anonymous";
}

export async function ensureRateLimit(
  req: Request,
  options: { max: number; windowMs: number; key?: string },
) {
  const now = Date.now();
  const key = getKey(req, options.key);
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > options.windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { ok: true };
  }

  if (bucket.count >= options.max) {
    return { ok: false };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return { ok: true };
}
