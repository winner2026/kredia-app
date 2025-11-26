import { performance } from "perf_hooks";
import type { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logging/logger";

export function attachPrismaTracer(prisma: PrismaClient) {
  // @ts-expect-error attach flag to avoid double registration
  if (prisma.__tracerAttached) return;
  // @ts-expect-error flag marker
  prisma.__tracerAttached = true;

  prisma.$use(async (params, next) => {
    const start = performance.now();
    const requestId = (params as unknown as { context?: { requestId?: string } })?.context?.requestId;
    try {
      const result = await next(params);
      const durationMs = performance.now() - start;
      const level = durationMs > 50 ? "warn" : "info";
      logger[level]({
        msg: durationMs > 50 ? "prisma.query.slow" : "prisma.query",
        model: params.model,
        action: params.action,
        durationMs,
        query: params.args,
        requestId,
      });
      return result;
    } catch (err) {
      const durationMs = performance.now() - start;
      logger.error({
        msg: "prisma.query.error",
        model: params.model,
        action: params.action,
        durationMs,
        query: params.args,
        requestId,
        err,
      });
      throw err;
    }
  });
}
