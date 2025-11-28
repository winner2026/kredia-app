import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { proyectarMeses } from "@/lib/paymentSchedule";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { logger } from "@/lib/logging/logger";
import { startTrace } from "@/lib/observability/trace";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";
import { notDeleted } from "@/lib/softDelete";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("cards.stats", requestId, async () => {
    const rate = await ensureRateLimit(req, { max: 30, windowMs: 60_000 });
    if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trace = startTrace("api:cards:stats", requestId);
    trace.add("route", "/api/cards/stats");
    trace.add("userId", user.id);
    trace.add("requestId", requestId);

    try {
      const card = await prisma.creditCard.findFirst({
        where: { userId: user.id, ...notDeleted },
      });

      if (!card) {
        trace.end();
        return NextResponse.json(
          { success: false, error: "User has no card" },
          { status: 404 }
        );
      }

      const purchases = await prisma.purchase.findMany({
        where: { userId: user.id, ...notDeleted },
      });

      const months = await proyectarMeses(
        purchases.map((purchase) => ({
          purchaseDate: new Date(purchase.purchaseDate ?? purchase.createdAt),
          installments: purchase.installments,
          paidInstallments: purchase.installments - purchase.remaining,
          amountPerMonth: purchase.amountPerMonth,
        })),
        { closingDay: card.closingDay, dueDay: card.dueDay },
      );

      const monthlyTotal = months[0]?.total ?? 0;
      const utilization = (monthlyTotal / card.limit) * 100;

      let risk = "green";
      if (utilization >= 70) risk = "red";
      else if (utilization >= 30) risk = "yellow";

      const response = NextResponse.json({
        success: true,
        card,
        purchases,
        monthlyTotal,
        utilization: Math.round(utilization),
        risk,
      });
      trace.end();
      return response;
    } catch (error) {
      console.error("Error fetching card stats, returning fallback demo data:", error);
      logger.error({ msg: "card.stats.error", err: error, requestId });

      const fallbackCard = {
        id: "demo-card-id",
        userId: user.id,
        bank: "KredIA Demo",
        limit: 5000,
        closingDay: 15,
        dueDay: 25,
        createdAt: new Date().toISOString(),
      };

      const response = NextResponse.json({
        success: true,
        fallback: true,
        card: fallbackCard,
        purchases: [],
        monthlyTotal: 0,
        utilization: 0,
        risk: "green",
      });
      trace.end();
      return response;
    }
  });
}
