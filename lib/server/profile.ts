import "server-only";

import type { Prisma } from "@prisma/client";

type QueryRunner<T> = () => Promise<T>;

/**
 * Perf profiling de queries Prisma (solo server).
 */
export async function profileQuery<T>(label: string, runQuery: QueryRunner<T>): Promise<T> {
  const start = performance.now();

  try {
    return await runQuery();
  } finally {
    if (process.env.NODE_ENV !== "production") {
      const elapsedMs = performance.now() - start;
      // eslint-disable-next-line no-console
      console.log(`[prisma-profile] ${label}: ${elapsedMs.toFixed(2)}ms`);
    }
  }
}

/**
 * Deteccion simple de N+1 (solo en desarrollo).
 */
export function detectNPlusOne(queries: Prisma.PrismaPromise<unknown>[], threshold = 5): number {
  const count = queries.length;

  if (process.env.NODE_ENV !== "production" && count >= threshold) {
    // eslint-disable-next-line no-console
    console.warn(`[prisma-profile] Posible N+1 detectado: ${count} queries (umbral ${threshold})`);
  }

  return count;
}
