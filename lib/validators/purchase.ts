import { z } from "zod";

export const PurchaseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  cardId: z.string().uuid(),
  description: z.string().min(1),
  amountTotal: z.number().int().nonnegative(),
  amountPerMonth: z.number().int().nonnegative(),
  installments: z.number().int().nonnegative(),
  remaining: z.number().int().nonnegative(),
  purchaseDate: z.date(),
  createdAt: z.date().optional(),
});

export const PurchaseCreateSchema = z.object({
  cardId: z.string().uuid(),
  description: z.string().min(1),
  amountTotal: z.number().positive(),
  installments: z.number().int().positive(),
  paidInstallments: z.number().int().nonnegative().optional(),
  purchaseDate: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
});
