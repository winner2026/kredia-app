import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { logger } from "@/lib/logging/logger";
import { CardCreateSchema } from "@/lib/validators/card";
import { withTrace } from "@/lib/observability/trace";
import { getRequestId } from "@/lib/observability/request";
import { invalidateCard } from "@/lib/cache/invalidation";
import { profileApi } from "@/lib/perf/apiProfiler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  return profileApi("cards.create", requestId, async () =>
    withTrace("api:cards:create", req, async (trace) => {
      trace.add("route", "/api/cards");
      trace.add("method", "POST");
      trace.add("requestId", requestId);

      try {
        const rate = await ensureRateLimit(req, { max: 20, windowMs: 60_000 });
        if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

        const user = await getCurrentUser();
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        trace.add("userId", user.id);

        const parsed = CardCreateSchema.safeParse(await req.json());
        if (!parsed.success) {
          return NextResponse.json(
            { success: false, error: "bank, limit, closingDay y dueDay (1-31) son requeridos" },
            { status: 400 },
          );
        }

        trace.add("input", parsed.data);

        const { bank, limit, closingDay, dueDay } = parsed.data;

        const card = await prisma.creditCard.create({
          data: {
            userId: user.id,
            bank,
            limit,
            closingDay,
            dueDay,
          },
        });

        await invalidateCard(user.id, card.id);

        trace.add("cardId", card.id);
        logger.info({ msg: "card.created", userId: user.id, cardId: card.id, requestId });
        return NextResponse.json({ success: true, card });
      } catch (error) {
        console.error("Error creating card:", error);
        trace.add("error", error instanceof Error ? error.message : String(error));
        logger.error({ msg: "card.create.error", err: error, requestId });
        return NextResponse.json(
          { success: false, error: "Failed to create card" },
          { status: 500 }
        );
      }
    }),
  );
}
