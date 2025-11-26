import { redisCache, memoizeDomain } from "./backend";

type ScheduleInput = {
  cardId: string;
  userId: string;
  payloadKey: string;
  compute: () => Promise<unknown>;
};

export async function cacheSchedule({ cardId, userId, payloadKey, compute }: ScheduleInput) {
  const key = `schedule:${userId}:${cardId}:${payloadKey}`;
  return redisCache(key, compute, 300);
}

export const memoizeProjection = memoizeDomain(async (userId: string, cardId: string, payloadKey: string, fn: () => Promise<unknown>) => {
  const key = `projection:${userId}:${cardId}:${payloadKey}`;
  return redisCache(key, fn, 300);
});

export function memoizeRiskScore<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return memoizeDomain(fn, 120_000);
}

export const heavyWorkerStub = {
  enqueue: async (_task: string, _payload: unknown) => {
    return Promise.resolve();
  },
};
