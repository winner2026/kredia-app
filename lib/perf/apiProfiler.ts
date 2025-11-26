import { performance } from "perf_hooks";
import { logger } from "@/lib/logging/logger";

export async function profileApi(name: string, requestId: string | undefined, fn: () => Promise<Response>) {
  const start = performance.now();
  try {
    const res = await fn();
    const durationMs = performance.now() - start;
    logger.info({ msg: "api.profile", name, durationMs, requestId });
    return res;
  } catch (err) {
    const durationMs = performance.now() - start;
    logger.error({ msg: "api.profile.error", name, durationMs, requestId, err });
    throw err;
  }
}
