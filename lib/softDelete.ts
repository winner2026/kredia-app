import { prisma } from "@/lib/server/prisma";

/**
 * Soft delete de una compra
 * Marca la compra como eliminada sin borrarla de la DB
 */
export async function softDeletePurchase(purchaseId: string, userId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) {
    throw new Error("Compra no encontrada");
  }

  if (purchase.userId !== userId) {
    throw new Error("No tienes permiso para eliminar esta compra");
  }

  if (purchase.deletedAt) {
    throw new Error("La compra ya está eliminada");
  }

  return await prisma.purchase.update({
    where: { id: purchaseId },
    data: { deletedAt: new Date() },
  });
}

/**
 * Soft delete de una tarjeta
 * Marca la tarjeta y todas sus compras como eliminadas
 */
export async function softDeleteCard(cardId: string, userId: string) {
  const card = await prisma.creditCard.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new Error("Tarjeta no encontrada");
  }

  if (card.userId !== userId) {
    throw new Error("No tienes permiso para eliminar esta tarjeta");
  }

  if (card.deletedAt) {
    throw new Error("La tarjeta ya está eliminada");
  }

  const now = new Date();

  // Transacción: eliminar tarjeta y sus compras
  return await prisma.$transaction(async (tx) => {
    // Marcar todas las compras de la tarjeta como eliminadas
    await tx.purchase.updateMany({
      where: {
        cardId,
        deletedAt: null,
      },
      data: { deletedAt: now },
    });

    // Marcar la tarjeta como eliminada
    return await tx.creditCard.update({
      where: { id: cardId },
      data: { deletedAt: now },
    });
  });
}

/**
 * Restaurar una compra soft-deleted
 */
export async function restorePurchase(purchaseId: string, userId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) {
    throw new Error("Compra no encontrada");
  }

  if (purchase.userId !== userId) {
    throw new Error("No tienes permiso para restaurar esta compra");
  }

  if (!purchase.deletedAt) {
    throw new Error("La compra no está eliminada");
  }

  return await prisma.purchase.update({
    where: { id: purchaseId },
    data: { deletedAt: null },
  });
}

/**
 * Restaurar una tarjeta soft-deleted
 * No restaura automáticamente las compras
 */
export async function restoreCard(cardId: string, userId: string) {
  const card = await prisma.creditCard.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new Error("Tarjeta no encontrada");
  }

  if (card.userId !== userId) {
    throw new Error("No tienes permiso para restaurar esta tarjeta");
  }

  if (!card.deletedAt) {
    throw new Error("La tarjeta no está eliminada");
  }

  return await prisma.creditCard.update({
    where: { id: cardId },
    data: { deletedAt: null },
  });
}

/**
 * Helper para filtrar solo registros no eliminados en queries
 */
export const notDeleted = { deletedAt: null };
