import { z } from "zod";

export const CreditCardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bank: z.string().min(1),
  limit: z.number().int().nonnegative(),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
  createdAt: z.date().optional(),
});

export const CardCreateSchema = z.object({
  bank: z.string().min(1),
  limit: z.number().int().positive(),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
});
