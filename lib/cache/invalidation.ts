import { deleteCacheKey } from "./cache";
import { dashboardOverviewKey, projectionKey, riskKey, scheduleKey } from "./keys";

export async function invalidateUser(userId: string) {
  await Promise.all([
    deleteCacheKey(dashboardOverviewKey(userId)),
    deleteCacheKey(projectionKey(userId)),
    deleteCacheKey(riskKey(userId)),
  ]);
}

export async function invalidateCard(userId: string, cardId: string) {
  await Promise.all([
    deleteCacheKey(scheduleKey(userId, cardId)),
    deleteCacheKey(dashboardOverviewKey(userId)),
  ]);
}

export async function invalidateProjections(userId: string) {
  await Promise.all([
    deleteCacheKey(projectionKey(userId)),
    deleteCacheKey(dashboardOverviewKey(userId)),
  ]);
}

export async function invalidateRisk(userId: string) {
  await Promise.all([
    deleteCacheKey(riskKey(userId)),
    deleteCacheKey(dashboardOverviewKey(userId)),
  ]);
}
