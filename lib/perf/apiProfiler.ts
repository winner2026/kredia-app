import { logger } from "@/lib/logging/logger";

const now = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

export async function profileApi(name: string, requestId: string | undefined, fn: () => Promise<Response>) {
  const start = now();
  try {
    const res = await fn();
    const durationMs = now() - start;
    logger.info({ msg: "api.profile", name, durationMs, requestId });
    return res;
  } catch (err) {
    const durationMs = now() - start;
    logger.error({ msg: "api.profile.error", name, durationMs, requestId, err });
    throw err;
  }
}
