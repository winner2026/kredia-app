import { z } from "zod";

export const SimulatorSimpleSchema = z.object({
  extraPayment: z.number().nonnegative(),
});

export const SimulatorAdvancedSchema = z.object({
  extraPayment: z.number().nonnegative(),
  interestRateMonthly: z.number().nonnegative(),
});
