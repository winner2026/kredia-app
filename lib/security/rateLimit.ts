import { Redis } from "@upstash/redis";

// Inicializar Redis solo si está configurado
const redis = process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    })
  : null;

// Fallback a memoria para desarrollo local
type Bucket = {
  count: number;
  windowStart: number;
};

const memoryBuckets = new Map<string, Bucket>();

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
  const identifier = getKey(req, options.key);
  const now = Date.now();

  // Usar Redis si está disponible (producción)
  if (redis) {
    const redisKey = `kredia:ratelimit:${identifier}`;
    const ttlSeconds = Math.ceil(options.windowMs / 1000);

    try {
      // Implementación sliding window con Redis
      const count = await redis.incr(redisKey);

      if (count === 1) {
        // Primera request en la ventana - establecer TTL
        await redis.expire(redisKey, ttlSeconds);
      }

      if (count > options.max) {
        return { ok: false, remaining: 0 };
      }

      return { ok: true, remaining: options.max - count };
    } catch (error) {
      console.error("Redis rate limit error, falling back to memory:", error);
      // Continuar con fallback a memoria
    }
  }

  // Fallback a memoria (desarrollo local)
  const bucket = memoryBuckets.get(identifier);

  if (!bucket || now - bucket.windowStart > options.windowMs) {
    memoryBuckets.set(identifier, { count: 1, windowStart: now });
    return { ok: true, remaining: options.max - 1 };
  }

  if (bucket.count >= options.max) {
    return { ok: false, remaining: 0 };
  }

  bucket.count += 1;
  memoryBuckets.set(identifier, bucket);
  return { ok: true, remaining: options.max - bucket.count };
}

/**
 * Resetea el rate limit para un identificador específico
 * Útil para testing y administración
 */
export async function resetRateLimit(identifier: string) {
  if (redis) {
    try {
      await redis.del(`kredia:ratelimit:${identifier}`);
    } catch (error) {
      console.error("Error resetting Redis rate limit:", error);
    }
  }
  memoryBuckets.delete(identifier);
}
