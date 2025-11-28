import { type Role, type CreditCard, type Purchase } from "@prisma/client";
import { type AuthUser } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";

export type CurrentUser = AuthUser & { role?: Role };

export function requireUser(user: CurrentUser | null): asserts user is CurrentUser {
  if (!user?.id) {
    throw new Error("Unauthorized");
  }
}

export function requireAdmin(user: CurrentUser | null): asserts user is CurrentUser & { role: Role } {
  requireUser(user);
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export function assertOwnership(userId: string, resourceUserId: string): void {
  if (userId !== resourceUserId) {
    throw new Error("Forbidden");
  }
}

/**
 * Verifica que la tarjeta existe y pertenece al usuario
 * @throws Error si no existe o no pertenece al usuario
 * @returns La tarjeta si la validación es exitosa
 */
export async function assertCardOwnership(
  cardId: string,
  userId: string
): Promise<CreditCard> {
  const card = await prisma.creditCard.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new Error("Tarjeta no encontrada");
  }

  if (card.userId !== userId) {
    throw new Error("No tienes permiso para acceder a esta tarjeta");
  }

  return card;
}

/**
 * Verifica que la compra existe y pertenece al usuario
 * @throws Error si no existe o no pertenece al usuario
 * @returns La compra si la validación es exitosa
 */
export async function assertPurchaseOwnership(
  purchaseId: string,
  userId: string
): Promise<Purchase> {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) {
    throw new Error("Compra no encontrada");
  }

  if (purchase.userId !== userId) {
    throw new Error("No tienes permiso para acceder a esta compra");
  }

  return purchase;
}
