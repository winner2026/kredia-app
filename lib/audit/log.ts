import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { logger } from "@/lib/logging/logger";
import { captureException } from "@/lib/observability/sentry.server";

type AuditMetadata = Record<string, unknown>;

type AuditParams = {
  req: Request;
  action: string;
  route: string;
  userId?: string | null;
  ip?: string | null;
  metadata?: AuditMetadata;
};

export async function createAuditLog(params: AuditParams) {
  const createdAt = new Date();

  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        route: params.route,
        ip: params.ip ?? null,
        requestId: params.req.headers.get("x-request-id"),
        metadata: (params.metadata ?? {}) as Prisma.InputJsonValue,
        createdAt,
      },
    });
  } catch (err) {
    logger.error({ msg: "audit_log.failed", err });
    captureException(err, {
      route: params.route,
      action: params.action,
      userId: params.userId ?? undefined,
    });
  }
}
