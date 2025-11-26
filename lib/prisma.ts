import { PrismaClient } from "@prisma/client";
import { attachPrismaTracer } from "@/lib/perf/prismaTracer";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaTracer: boolean | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (!globalForPrisma.prismaTracer) {
  attachPrismaTracer(prisma);
  globalForPrisma.prismaTracer = true;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
