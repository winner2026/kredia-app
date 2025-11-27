import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { proyectarMeses } from "@/lib/paymentSchedule";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { SimulatorSimpleSchema } from "@/lib/validators/simulator";
import { logger } from "@/lib/logging/logger";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("simulator.simple", requestId, async () => {
    try {
      const rate = await ensureRateLimit(req, { max: 15, windowMs: 60_000 });
      if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const parsed = SimulatorSimpleSchema.safeParse(await req.json());
      if (!parsed.success) {
        return NextResponse.json({ success: false, error: "extraPayment es requerido" }, { status: 400 });
      }

      const { extraPayment } = parsed.data;

      const purchases = await prisma.purchase.findMany({
        where: { userId: user.id },
      });

      const purchasesCopy = purchases.map((p) => ({ ...p }));
      let remainingExtra = extraPayment;

      purchasesCopy.sort((a, b) => a.remaining - b.remaining);

      for (const p of purchasesCopy) {
        if (remainingExtra <= 0) break;

        const deudaCompra = p.amountPerMonth * p.remaining;

        if (remainingExtra >= deudaCompra) {
          remainingExtra -= deudaCompra;
          p.remaining = 0;
        } else {
          const cuotasPagadas = Math.floor(remainingExtra / p.amountPerMonth);
          p.remaining -= cuotasPagadas;
          remainingExtra -= cuotasPagadas * p.amountPerMonth;
        }
      }

      const card = await prisma.creditCard.findFirst({ where: { userId: user.id } });
      if (!card) {
        return NextResponse.json(
          { success: false, error: "No se encontró la tarjeta del usuario" },
          { status: 404 },
        );
      }

      const projection = await proyectarMeses(
        purchasesCopy.map((p) => ({
          purchaseDate: new Date(p.purchaseDate ?? p.createdAt),
          installments: p.installments,
          paidInstallments: p.installments - p.remaining,
          amountPerMonth: p.amountPerMonth,
        })),
        { closingDay: card.closingDay, dueDay: card.dueDay },
      );

      const months = projection.map((m) => ({
        month: m.label,
        total: m.total,
        dueDates: m.dueDates.map((d) => d.toISOString()),
      }));

      const newMonthlyTotal = months[0]?.total ?? 0;
      const newUtilization = Math.round((newMonthlyTotal / card.limit) * 100);

      let newRisk = "green";
      if (newUtilization >= 70) newRisk = "red";
      else if (newUtilization >= 30) newRisk = "yellow";

      return NextResponse.json({
        success: true,
        months,
        newMonthlyTotal,
        newUtilization,
        newRisk,
        remainingExtra,
      });
    } catch (error) {
      console.error(error);
      logger.error({ msg: "simulator.simple.error", err: error, requestId });
      return NextResponse.json({ success: false }, { status: 500 });
    }
  });
}
