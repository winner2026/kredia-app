import "server-only";

import { prisma } from "./prisma";

/**
 * Retorna el cliente Prisma singleton con logging ya habilitado.
 */
export function prismaWithLogging() {
  return prisma;
}

export { prisma };
