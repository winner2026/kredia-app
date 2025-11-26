import { redisCache } from "@/lib/cache/cache";
import { projectionKey } from "@/lib/cache/keys";
import { calculateMonthlyProjection, type ScheduleConfig, type ScheduleInput } from "./paymentSchedule";

export async function getMonthlyProjection(
  purchases: ScheduleInput[],
  config: ScheduleConfig,
  ctx?: { userId?: string; requestId?: string },
) {
  const key = ctx?.userId ? `${projectionKey(ctx.userId)}:${purchases.length}:${config.closingDay}:${config.dueDay}` : undefined;

  const compute = async () => calculateMonthlyProjection(purchases, config, 12);

  if (!key) return compute();
  return redisCache(key, compute, 300, { requestId: ctx?.requestId });
}
