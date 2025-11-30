import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import {
  calcularFechaVencimiento,
  calcularMesSegunCierre,
  obtenerFechaLibertad,
  proyectarMeses,
} from "@/lib/paymentSchedule";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { logger } from "@/lib/logging/logger";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";
import { notDeleted } from "@/lib/softDelete";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("dashboard.overview", requestId, async () => {
    const rate = await ensureRateLimit(req, { max: 40, windowMs: 60_000 });
    if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({
        success: true,
        card: null,
        purchases: [],
        monthlyTotal: 0,
        utilization: 0,
        freedomDate: null,
        projection: [],
      });
    }

    try {
      const card = await prisma.creditCard.findFirst({
        where: {
          userId: user.id,
          ...notDeleted,  // Excluir tarjetas eliminadas
        },
      });

      if (!card) {
        return NextResponse.json({
          success: true,
          card: null,
          purchases: [],
          monthlyTotal: 0,
          utilization: 0,
          freedomDate: null,
          projection: [],
        });
      }

      const purchases = await prisma.purchase.findMany({
        where: {
          userId: user.id,
          cardId: card.id,
          ...notDeleted,  // Excluir compras eliminadas
        },
        orderBy: { createdAt: "desc" },
      });

      const scheduleInputs = purchases.map((p) => ({
        purchaseDate: new Date(p.purchaseDate ?? p.createdAt),
        installments: p.installments,
        paidInstallments: p.installments - p.remaining,
        amountPerMonth: p.amountPerMonth,
      }));

      const projection = await proyectarMeses(scheduleInputs, {
        closingDay: card.closingDay,
        dueDay: card.dueDay,
      }, 12, { userId: user.id, cardId: card.id, requestId });

      const freedomDate = await obtenerFechaLibertad(scheduleInputs, {
        closingDay: card.closingDay,
        dueDay: card.dueDay,
      }, { userId: user.id, cardId: card.id, requestId });

      const months = projection.map((m, idx) => {
        const fallbackDue = (() => {
          const base = new Date();
          base.setMonth(base.getMonth() + idx);
          return calcularFechaVencimiento(
            calcularMesSegunCierre(base, card.closingDay),
            card.dueDay,
          );
        })();

        return {
          month: m.label,
          total: m.total,
          dueDates: (m.dueDates.length > 0 ? m.dueDates : [fallbackDue]).map((d) =>
            d.toISOString(),
          ),
        };
      });

      const monthlyTotal = projection[0]?.total ?? 0;
      const utilization = card.limit > 0 ? Math.round((monthlyTotal / card.limit) * 100) : 0;

      return NextResponse.json({
        success: true,
        card,
        purchases,
        monthlyTotal,
        utilization,
        freedomDate: freedomDate?.toISOString() ?? null,
        projection: months,
      });
    } catch (error) {
      console.error("Error building dashboard overview:", error);
      logger.error({ msg: "dashboard.overview.error", err: error, requestId });
      return NextResponse.json({ error: "Failed to build overview" }, { status: 500 });
    }
  });
}
