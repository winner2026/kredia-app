import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { assertCardOwnership } from "@/lib/security/rbac";
import { PurchaseCreateSchema } from "@/lib/validators/purchase";
import { logger } from "@/lib/logging/logger";
import { invalidateCard, invalidateProjections } from "@/lib/cache/invalidation";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("purchases.create", requestId, async () => {
    try {
      const rate = await ensureRateLimit(req, { max: 20, windowMs: 60_000 });
      if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const parseBody = PurchaseCreateSchema.safeParse(await req.json());
      if (!parseBody.success) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 },
        );
      }

      const { cardId, description, amountTotal, installments, purchaseDate, paidInstallments } = parseBody.data;

      const parsedDate = purchaseDate ? new Date(purchaseDate) : new Date();
      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "purchaseDate debe ser una fecha válida" },
          { status: 400 },
        );
      }

      const total = Number(amountTotal);
      const installmentsNum = Number(installments);
      const paidInstallmentsNum = Math.max(0, Math.min(Number(paidInstallments ?? 0), installmentsNum));

      // Validar que la tarjeta existe y pertenece al usuario
      const card = await assertCardOwnership(cardId, user.id);

      const amountPerMonth = installmentsNum > 0 ? Math.round(total / installmentsNum) : 0;

      const purchase = await prisma.purchase.create({
        data: {
          userId: user.id,
          cardId,
          description,
          amount: total,
          amountTotal: total,
          amountPerMonth,
          installments: installmentsNum,
          remaining: Math.max(0, installmentsNum - paidInstallmentsNum),
          purchaseDate: parsedDate,
        },
      });

      await Promise.all([
        invalidateCard(user.id, cardId),
        invalidateProjections(user.id),
      ]);

      logger.info({ msg: "purchase.created", userId: user.id, cardId, purchaseId: purchase.id, requestId });
      return NextResponse.json({ success: true, purchase });
    } catch (error) {
      console.error("Error creando compra, devolviendo item demo:", error);
      logger.error({ msg: "purchase.create.error", err: error, requestId });

      const fallbackPurchase = {
        id: "demo-purchase-id",
        userId: "demo-user",
        cardId: "demo-card",
        description: "Compra demo",
        amountTotal: 0,
        amountPerMonth: 0,
        installments: 0,
        remaining: 0,
        purchaseDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({ success: true, fallback: true, purchase: fallbackPurchase });
    }
  });
}
