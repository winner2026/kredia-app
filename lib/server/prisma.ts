import "server-only";

import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logging/logger";

type GlobalWithPrisma = typeof globalThis & {
  __prisma?: PrismaClient;
  __prismaTracerAttached?: boolean;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

const now = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

function attachPrismaTracer(client: PrismaClient) {
  if (globalForPrisma.__prismaTracerAttached) return;

  const middleware = (client as any).$use;
  if (typeof middleware !== "function") return;

  middleware.call(client, async (params: any, next: any) => {
    const start = now();
    const requestId = (params as unknown as { context?: { requestId?: string } })?.context?.requestId;
    try {
      const result = await next(params);
      const durationMs = now() - start;
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
      const durationMs = now() - start;
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

  globalForPrisma.__prismaTracerAttached = true;
}

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: ["query"],
  });

attachPrismaTracer(prisma);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
