import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { logger } from "@/lib/logging/logger";
import { startTrace } from "@/lib/observability/trace";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";
import { notDeleted } from "@/lib/softDelete";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("purchases.list", requestId, async () => {
    const rate = await ensureRateLimit(req, { max: 30, windowMs: 60_000 });
    if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trace = startTrace("api:purchases:list", requestId);
    trace.add("route", "/api/purchases/list");
    trace.add("userId", user.id);

    try {
      const purchases = await prisma.purchase.findMany({
        where: {
          userId: user.id,
          ...notDeleted,  // Excluir compras eliminadas
        },
        orderBy: { createdAt: "desc" },
      });

      trace.end();
      return NextResponse.json({ success: true, purchases });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      logger.error({ msg: "purchases.list.error", err: error, requestId });
      trace.add("error", error instanceof Error ? error.message : String(error));
      trace.end();
      return NextResponse.json(
        { success: false, error: "Failed to fetch purchases" },
        { status: 500 }
      );
    }
  });
}
