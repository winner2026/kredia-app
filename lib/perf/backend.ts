import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function redisCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds = 300,
): Promise<T> {
  if (redis) {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;
    const value = await fn();
    await redis.set(key, value, { ex: ttlSeconds });
    return value;
  }
  const now = Date.now();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > now) {
    return entry.value as T;
  }
  const value = await fn();
  memoryCache.set(key, { value, expiresAt: now + ttlSeconds * 1000 });
  return value;
}

export function memoizeDomain<T extends (...args: any[]) => Promise<any>>(fn: T, ttlMs = 60_000) {
  const cacheLocal = new Map<string, CacheEntry<Awaited<ReturnType<T>>>>();
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const hit = cacheLocal.get(key);
    if (hit && hit.expiresAt > now) {
      return hit.value;
    }
    const value = await fn(...args);
    cacheLocal.set(key, { value, expiresAt: now + ttlMs });
    return value;
  };
}

export async function profileApiRoute<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    return result;
  } finally {
    const end = performance.now();
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(`[api-profile] ${name}: ${(end - start).toFixed(2)}ms`);
    }
  }
}
