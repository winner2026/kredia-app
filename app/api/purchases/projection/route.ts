import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { proyectarMeses } from "@/lib/paymentSchedule";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { logger } from "@/lib/logging/logger";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("purchases.projection", requestId, async () => {
    const rate = await ensureRateLimit(req, { max: 20, windowMs: 60_000 });
    if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const card = await prisma.creditCard.findFirst({
        where: { userId: user.id },
      });

      if (!card) {
        return NextResponse.json(
          { success: false, error: "No se encontró la tarjeta del usuario" },
          { status: 404 },
        );
      }

      const purchases = await prisma.purchase.findMany({
        where: { userId: user.id },
      });

      const projection = await proyectarMeses(
        purchases.map((purchase) => ({
          purchaseDate: new Date(purchase.purchaseDate ?? purchase.createdAt),
          installments: purchase.installments,
          paidInstallments: purchase.installments - purchase.remaining,
          amountPerMonth: purchase.amountPerMonth,
        })),
        { closingDay: card.closingDay, dueDay: card.dueDay },
      );

      const months = projection.map((m) => ({
        month: m.label,
        total: m.total,
        dueDates: m.dueDates.map((d) => d.toISOString()),
      }));

      return NextResponse.json({ success: true, months });
    } catch (error) {
      console.error("Error calculando proyección, devolviendo datos demo:", error);
      logger.error({ msg: "purchases.projection.error", err: error, requestId });

      const months = Array.from({ length: 12 }).map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        return {
          month: date.toLocaleString("es-ES", { month: "short" }),
          total: 0,
          dueDates: [],
        };
      });

      return NextResponse.json({ success: true, fallback: true, months });
    }
  });
}
