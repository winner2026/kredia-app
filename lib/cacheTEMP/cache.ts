import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logging/logger";
import { registerHit, registerMiss } from "./metrics";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

type MemoryEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, MemoryEntry<unknown>>();

type CacheContext = {
  requestId?: string;
};

export async function redisCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number,
  ctx: CacheContext = {},
): Promise<T> {
  if (redis) {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      registerHit();
      logger.info({ msg: "cache.hit", key, requestId: ctx.requestId });
      return cached;
    }
    registerMiss();
    logger.info({ msg: "cache.miss", key, requestId: ctx.requestId });
    const value = await fn();
    await redis.set(key, value, { ex: ttlSeconds });
    return value;
  }

  const now = Date.now();
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > now) {
    registerHit();
    logger.info({ msg: "cache.hit", key, requestId: ctx.requestId });
    return entry.value as T;
  }

  registerMiss();
  logger.info({ msg: "cache.miss", key, requestId: ctx.requestId });
  const value = await fn();
  memoryCache.set(key, { value, expiresAt: now + ttlSeconds * 1000 });
  return value;
}

export function deleteCacheKey(key: string) {
  if (redis) {
    return redis.del(key);
  }
  memoryCache.delete(key);
  return Promise.resolve();
}
