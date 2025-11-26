import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

type MemoryBucket = {
  count: number;
  windowStart: number;
};

// Fallback en memoria: solo para dev/CI, NO usar en producción.
const memoryBuckets = new Map<string, MemoryBucket>();

function getKey(key: string) {
  return `ratelimit:${key}`;
}

async function checkRedisLimit(key: string, options: { max: number; windowMs: number }) {
  if (!redis) return true;
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const redisKey = getKey(key);

  const tx = redis.multi();
  tx.zremrangebyscore(redisKey, 0, windowStart);
  tx.zadd(redisKey, { score: now, member: `${now}` });
  tx.zcard(redisKey);
  tx.pexpire(redisKey, options.windowMs);
  const [, , count] = (await tx.exec()) as [unknown, unknown, number];

  return count <= options.max;
}

function checkMemoryLimit(key: string, options: { max: number; windowMs: number }) {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now - bucket.windowStart > options.windowMs) {
    memoryBuckets.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (bucket.count >= options.max) return false;
  bucket.count += 1;
  memoryBuckets.set(key, bucket);
  return true;
}

export async function checkDistributedRateLimit(
  key: string,
  options: { max: number; windowMs: number },
): Promise<boolean> {
  if (redis) {
    return checkRedisLimit(key, options);
  }
  return checkMemoryLimit(key, options);
}
