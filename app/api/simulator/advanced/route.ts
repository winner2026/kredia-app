import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import {
  calcularMesSegunCierre,
  calcularFechaVencimiento,
} from "@/lib/paymentSchedule";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { SimulatorAdvancedSchema } from "@/lib/validators/simulator";
import { logger } from "@/lib/logging/logger";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("simulator.advanced", requestId, async () => {
    try {
      const rate = await ensureRateLimit(req, { max: 10, windowMs: 60_000 });
      if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const parsed = SimulatorAdvancedSchema.safeParse(await req.json());
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: "extraPayment y interestRateMonthly son requeridos",
          },
          { status: 400 },
        );
      }

      const { extraPayment, interestRateMonthly } = parsed.data;

      const purchases = await prisma.purchase.findMany({
        where: { userId: user.id },
      });

      if (purchases.length === 0) {
        return NextResponse.json(
          { success: false, error: "No hay compras para simular" },
          { status: 404 },
        );
      }

      const card = await prisma.creditCard.findFirst({ where: { userId: user.id } });

      if (!card) {
        return NextResponse.json(
          { success: false, error: "No se encontró la tarjeta del usuario" },
          { status: 404 },
        );
      }

      const working = purchases.map((p) => ({
        id: p.id,
        amountPerMonth: p.amountPerMonth,
        balance: p.amountPerMonth * p.remaining,
        startOffset: Math.max(
          0,
          calcularMesSegunCierre(new Date(p.purchaseDate ?? p.createdAt), card.closingDay),
        ),
      }));

      let remainingExtra = extraPayment;
      const rateValue = interestRateMonthly / 100;

      working.sort((a, b) => b.balance - a.balance);

      for (const w of working) {
        if (remainingExtra <= 0) break;

        const payDown = Math.min(w.balance, remainingExtra);
        w.balance -= payDown;
        remainingExtra -= payDown;
      }

      const months = Array.from({ length: 12 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        return {
          month: d.toLocaleString("es-ES", { month: "short" }),
          total: 0,
          dueDate: calcularFechaVencimiento(i, card.dueDay).toISOString(),
        };
      });

      for (let m = 0; m < 12; m += 1) {
        let monthTotal = 0;

        for (const w of working) {
          if (w.balance <= 0) continue;
          if (m < w.startOffset) continue;

          const interest = w.balance * rateValue;
          const payment = Math.min(w.amountPerMonth, w.balance + interest);

          const principalPaid = payment - interest;
          w.balance -= principalPaid;

          monthTotal += payment;
        }

        months[m].total = Math.round(monthTotal);
      }

      const newMonthlyTotal = months[0].total;
      const newUtilization = Math.round((newMonthlyTotal / card.limit) * 100);

      let newRisk: "green" | "yellow" | "red" = "green";
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
      console.error("Error en simulador avanzado:", error);
      logger.error({ msg: "simulator.advanced.error", err: error, requestId });
      return NextResponse.json(
        { success: false, error: "Error interno en simulador avanzado" },
        { status: 500 },
      );
    }
  });
}
