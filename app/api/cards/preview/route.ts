import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import {
  calcularFechaVencimiento,
  calcularMesSegunCierre,
  construirSchedule,
  obtenerFechaLibertad,
  proyectarMeses,
} from "@/lib/paymentSchedule";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { logger } from "@/lib/logging/logger";
import { z } from "zod";
import { withTrace } from "@/lib/observability/trace";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";
import { notDeleted } from "@/lib/softDelete";

export const runtime = "nodejs";

type Body = {
  cardId?: string;
  amount?: number;
  installments?: number;
  purchaseDate?: string;
};

function calcRisk(utilization: number) {
  if (utilization < 25) return "green";
  if (utilization < 45) return "yellow";
  return "red";
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  return profileApi("cards.preview", requestId, async () =>
    withTrace("api:cards:preview", req, async (trace) => {
      trace.add("route", "/api/cards/preview");
      trace.add("method", "POST");
      trace.add("requestId", requestId);

      try {
        const rate = await ensureRateLimit(req, { max: 15, windowMs: 60_000 });
        if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

        const user = await getCurrentUser();
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        trace.add("userId", user.id);

        const body = (await req.json()) as Body;
        const parseBody = z.object({
          cardId: z.string().uuid(),
          amount: z.number().positive(),
          installments: z.number().int().positive(),
          purchaseDate: z.string().optional(),
        });

        const parsed = parseBody.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json({ success: false, error: "cardId, amount y installments son requeridos" }, { status: 400 });
        }

        trace.add("input", parsed.data);

        const { cardId, amount, installments, purchaseDate: purchaseDateRaw } = parsed.data;
        const purchaseDate = purchaseDateRaw ? new Date(purchaseDateRaw) : new Date();

        if (Number.isNaN(purchaseDate.getTime())) {
          return NextResponse.json({ success: false, error: "purchaseDate must be valid" }, { status: 400 });
        }

        const card = await prisma.creditCard.findUnique({
          where: { id: cardId },
        });

        if (!card || card.userId !== user.id) {
          return NextResponse.json({ success: false, error: "Card not found for user" }, { status: 404 });
        }

        trace.add("cardId", card.id);

        const purchases = await prisma.purchase.findMany({
          where: { userId: user.id, cardId },
        });

        const config = { closingDay: card.closingDay, dueDay: card.dueDay };

        const scheduleInputs = purchases.map((p) => ({
          purchaseDate: new Date(p.purchaseDate ?? p.createdAt),
          installments: p.installments,
          paidInstallments: p.installments - p.remaining,
          amountPerMonth: p.amountPerMonth,
        }));

        const newPurchase = {
          purchaseDate,
          installments,
          paidInstallments: 0,
          amountPerMonth: Math.round(amount / installments),
        };

        const monthsWithNew = await proyectarMeses([...scheduleInputs, newPurchase], config);
        const monthsCurrent = await proyectarMeses(scheduleInputs, config);

        const newMonthlyTotal = monthsWithNew[0]?.total ?? 0;
        const existingMonthly = monthsCurrent[0]?.total ?? 0;
        const newMonthlyDelta = Math.max(0, newMonthlyTotal - existingMonthly);

        const newUtilization = card.limit > 0 ? Number(((newMonthlyTotal / card.limit) * 100).toFixed(2)) : 0;
        const newRisk = calcRisk(newUtilization);

        trace.add("newMonthlyTotal", newMonthlyTotal);
        trace.add("newUtilization", newUtilization);
        trace.add("newRisk", newRisk);

        const freedomDate = await obtenerFechaLibertad([...scheduleInputs, newPurchase], config);
        const freedomDateWithExtra = freedomDate
          ? new Date(freedomDate.getFullYear(), freedomDate.getMonth() - 1, freedomDate.getDate())
          : null;

        const recommendedPayment = Math.max(0, Math.round(newMonthlyTotal * 0.35));
        const interestSavings = Math.max(0, Math.round(newMonthlyDelta * 0.18));

        const scheduleNew = await construirSchedule(newPurchase, config, Number.POSITIVE_INFINITY);
        const mesPrimeraCuota = calcularMesSegunCierre(purchaseDate, card.closingDay);
        const firstDueDate = scheduleNew[0]?.dueDate ?? calcularFechaVencimiento(mesPrimeraCuota, card.dueDay);
        const lastDueDate = scheduleNew[scheduleNew.length - 1]?.dueDate ?? firstDueDate;

        const earliestDue = (
          await Promise.all(
            [...scheduleInputs, newPurchase].map((p) =>
              construirSchedule(p, config, Number.POSITIVE_INFINITY),
            ),
          )
        )
          .flat()
          .filter((s) => s.monthIndex >= 0)
          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0]?.dueDate;

        const timeline = monthsWithNew.map((m) => ({
          month: m.label,
          total: m.total,
          dueDates: m.dueDates.map((d) => d.toISOString()),
        }));

        return NextResponse.json({
          success: true,
          card,
          newMonthlyTotal,
          newMonthlyDelta,
          newUtilization,
          newRisk,
          freedomDate: freedomDate?.toISOString() ?? null,
          freedomDateWithExtra: freedomDateWithExtra?.toISOString() ?? null,
          recommendedPayment,
          interestSavings,
          mesPrimeraCuota,
          firstDueDate: firstDueDate?.toISOString() ?? null,
          lastDueDate: lastDueDate?.toISOString() ?? null,
          nextDueDate: earliestDue?.toISOString() ?? null,
          timeline,
          daysToNextPeriod: Math.max(0, card.closingDay - purchaseDate.getDate() + 1),
        });
      } catch (error) {
        console.error("Error creating preview:", error);
        logger.error({ msg: "card.preview.error", err: error, requestId });
        trace.add("error", error instanceof Error ? error.message : String(error));
        return NextResponse.json({ success: false, error: "Failed to create preview" }, { status: 500 });
      }
    }),
  );
}
