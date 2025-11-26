import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { getRequestId } from "@/lib/observability/request";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

type WebhookVerificationResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

const memoryReplay = new Map<string, number>(); // nonce -> expiresAt

function timingSafeEqual(a: string, b: string) {
  const buffA = Buffer.from(a);
  const buffB = Buffer.from(b);
  if (buffA.length !== buffB.length) return false;
  return crypto.timingSafeEqual(buffA, buffB);
}

async function markReplay(nonce: string, ttlSeconds: number) {
  if (redis) {
    await redis.set(`webhook-replay:${nonce}`, true, { ex: ttlSeconds });
  } else {
    memoryReplay.set(nonce, Date.now() + ttlSeconds * 1000);
  }
}

async function isReplay(nonce: string, ttlSeconds: number) {
  if (redis) {
    const exists = await redis.get<boolean>(`webhook-replay:${nonce}`);
    return Boolean(exists);
  }
  const expires = memoryReplay.get(nonce);
  if (!expires) return false;
  if (Date.now() > expires) {
    memoryReplay.delete(nonce);
    return false;
  }
  return true;
}

export async function verifyWebhookSignature(
  req: Request,
  bodyRaw: string,
  opts: { secret: string; toleranceSeconds?: number; replayWindowSeconds?: number },
): Promise<WebhookVerificationResult> {
  const requestId = getRequestId(req);
  const signature = req.headers.get("x-signature") || "";
  const timestampHeader = req.headers.get("x-timestamp");
  const nonce = req.headers.get("x-nonce") || "";

  if (!timestampHeader) {
    return { ok: false, status: 401, error: "invalid signature" };
  }

  const timestamp = Number(timestampHeader);
  const tolerance = (opts.toleranceSeconds ?? 300) * 1000;
  const now = Date.now();
  if (Number.isNaN(timestamp) || Math.abs(now - timestamp) > tolerance) {
    return { ok: false, status: 408, error: "expired timestamp" };
  }

  const replayWindow = opts.replayWindowSeconds ?? 300;
  if (nonce) {
    const replayed = await isReplay(nonce, replayWindow);
    if (replayed) {
      return { ok: false, status: 409, error: "replay detected" };
    }
  }

  const payload = `${timestamp}.${bodyRaw}`;
  const expected = crypto.createHmac("sha256", opts.secret).update(payload).digest("hex");

  if (!timingSafeEqual(signature, expected)) {
    return { ok: false, status: 401, error: "invalid signature" };
  }

  if (nonce) {
    await markReplay(nonce, replayWindow);
  }

  return { ok: true };
}
