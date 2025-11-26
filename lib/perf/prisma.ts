import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function profileQuery<T>(label: string, query: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    return await query();
  } finally {
    const end = performance.now();
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(`[prisma-profile] ${label}: ${(end - start).toFixed(2)}ms`);
    }
  }
}

export function detectNPlusOne(queries: Prisma.PrismaPromise<unknown>[]) {
  // Stub: en producción se debe instrumentar con Prisma middleware + análisis de logs
  return queries.length;
}

export function prismaWithLogging() {
  return prisma;
}
