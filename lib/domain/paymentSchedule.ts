import { redisCache } from "@/lib/cache/cache";
import { scheduleKey } from "@/lib/cache/keys";
import { profileDomain } from "@/lib/perf/domainProfiler";

export type InstallmentSchedule = {
  installmentNumber: number;
  monthIndex: number;
  dueDate: Date;
  amount: number;
};

export type ScheduleInput = {
  purchaseDate: Date;
  installments: number;
  paidInstallments?: number;
  amountPerMonth: number;
};

export type ScheduleConfig = {
  closingDay: number;
  dueDay: number;
  referenceDate?: Date;
};

function clampDay(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(31, Math.max(1, Math.round(value)));
}

function getMonthDiff(from: Date, to: Date) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

export function calcularMesSegunCierre(
  fechaCompra: Date,
  diaCierre: number,
  referenceDate: Date = new Date(),
) {
  const safeClosingDay = clampDay(diaCierre);
  const purchase = new Date(fechaCompra);
  purchase.setHours(0, 0, 0, 0);

  const firstBillingMonth = new Date(purchase.getFullYear(), purchase.getMonth(), 1);
  const purchaseDay = purchase.getDate();

  if (purchaseDay > safeClosingDay) {
    firstBillingMonth.setMonth(firstBillingMonth.getMonth() + 1);
  }

  const referenceMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  return getMonthDiff(referenceMonth, firstBillingMonth);
}

export function calcularFechaVencimiento(
  mes: number,
  diaVencimiento: number,
  referenceDate: Date = new Date(),
) {
  const safeDueDay = clampDay(diaVencimiento);
  const referenceMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  referenceMonth.setMonth(referenceMonth.getMonth() + mes);

  const daysInTargetMonth = new Date(
    referenceMonth.getFullYear(),
    referenceMonth.getMonth() + 1,
    0,
  ).getDate();
  const day = Math.min(safeDueDay, daysInTargetMonth);

  return new Date(referenceMonth.getFullYear(), referenceMonth.getMonth(), day);
}

export async function buildSchedule(
  input: ScheduleInput,
  config: ScheduleConfig,
  monthsToProject = 12,
  ctx?: { userId?: string; cardId?: string; requestId?: string },
): Promise<InstallmentSchedule[]> {
  const key =
    ctx?.userId && ctx?.cardId
      ? `${scheduleKey(ctx.userId, ctx.cardId)}:${monthsToProject}:${input.installments}:${input.paidInstallments ?? 0}:${input.amountPerMonth}:${input.purchaseDate.toISOString()}`
      : undefined;

  const compute = async (): Promise<InstallmentSchedule[]> => {
    const paid = Math.max(0, Math.min(input.installments, input.paidInstallments ?? 0));
    const mesPrimeraCuota = calcularMesSegunCierre(
      input.purchaseDate,
      config.closingDay,
      config.referenceDate,
    );

    const schedule: InstallmentSchedule[] = [];
    for (let installment = paid + 1; installment <= input.installments; installment++) {
      const monthIndex = mesPrimeraCuota + (installment - paid - 1);
      const dueDate = calcularFechaVencimiento(
        monthIndex,
        config.dueDay,
        config.referenceDate,
      );

      schedule.push({
        installmentNumber: installment,
        monthIndex,
        dueDate,
        amount: input.amountPerMonth,
      });
    }

    return schedule.filter((s) => s.monthIndex < monthsToProject);
  };

  const profiledCompute = async () =>
    profileDomain("domain.schedule", ctx?.requestId, async () => {
      const result = await compute();
      return { value: result, inputSize: 1, outputSize: result.length };
    });

  if (!key) return profiledCompute();
  return redisCache(key, profiledCompute, 300, { requestId: ctx?.requestId });
}

export const construirSchedule = buildSchedule;

export async function calculateMonthlyProjection(
  purchases: ScheduleInput[],
  config: ScheduleConfig,
  monthsToProject = 12,
  ctx?: { userId?: string; cardId?: string; requestId?: string },
) {
  const key =
    ctx?.userId && ctx?.cardId
      ? `${scheduleKey(ctx.userId, ctx.cardId)}:projection:${monthsToProject}:${purchases.length}`
      : undefined;

  const compute = () => {
    const months = Array.from({ length: monthsToProject }).map((_, idx) => {
      const d = new Date(config.referenceDate ?? new Date());
      d.setMonth(d.getMonth() + idx);
      return {
        label: d.toLocaleDateString("es-ES", { month: "short" }),
        total: 0,
        dueDates: [] as Date[],
      };
    });

    purchases.forEach((purchase) => {
      const scheduleForPurchase = (() => {
        const paid = Math.max(0, Math.min(purchase.installments, purchase.paidInstallments ?? 0));
        const mesPrimeraCuota = calcularMesSegunCierre(
          purchase.purchaseDate,
          config.closingDay,
          config.referenceDate,
        );
        const sch: InstallmentSchedule[] = [];
        for (let installment = paid + 1; installment <= purchase.installments; installment++) {
          const monthIndex = mesPrimeraCuota + (installment - paid - 1);
          const dueDate = calcularFechaVencimiento(
            monthIndex,
            config.dueDay,
            config.referenceDate,
          );

          sch.push({
            installmentNumber: installment,
            monthIndex,
            dueDate,
            amount: purchase.amountPerMonth,
          });
        }
        return sch.filter((s) => s.monthIndex < monthsToProject);
      })();

      scheduleForPurchase.forEach((item) => {
        if (item.monthIndex < 0 || item.monthIndex >= monthsToProject) return;
        months[item.monthIndex].total += item.amount;
        months[item.monthIndex].dueDates.push(item.dueDate);
      });
    });

    months.forEach((month) =>
      month.dueDates.sort((a, b) => a.getTime() - b.getTime()),
    );

    return months;
  };

  const profiledCompute = async () =>
    profileDomain("domain.projection", ctx?.requestId, async () => {
      const result = await compute();
      return { value: result, inputSize: purchases.length, outputSize: result.length };
    });

  if (!key) return profiledCompute();
  return redisCache(key, profiledCompute, 300, { requestId: ctx?.requestId });
}

export const proyectarMeses = calculateMonthlyProjection;

export async function calculateFreedomDate(
  purchases: ScheduleInput[],
  config: ScheduleConfig,
  ctx?: { userId?: string; cardId?: string; requestId?: string },
) {
  const key =
    ctx?.userId && ctx?.cardId
      ? `${scheduleKey(ctx.userId, ctx.cardId)}:freedom:${purchases.length}`
      : undefined;

  const compute = () => {
    const schedules = purchases.flatMap((purchase) => {
      const paid = Math.max(0, Math.min(purchase.installments, purchase.paidInstallments ?? 0));
      const mesPrimeraCuota = calcularMesSegunCierre(
        purchase.purchaseDate,
        config.closingDay,
        config.referenceDate,
      );

      const sch: InstallmentSchedule[] = [];
      for (let installment = paid + 1; installment <= purchase.installments; installment++) {
        const monthIndex = mesPrimeraCuota + (installment - paid - 1);
        const dueDate = calcularFechaVencimiento(
          monthIndex,
          config.dueDay,
          config.referenceDate,
        );

        sch.push({
          installmentNumber: installment,
          monthIndex,
          dueDate,
          amount: purchase.amountPerMonth,
        });
      }
      return sch;
    });

    if (schedules.length === 0) return null;
    const last = schedules.reduce((latest, current) =>
      current.dueDate > latest.dueDate ? current : latest,
    );
    return last.dueDate;
  };

  const profiledCompute = async () =>
    profileDomain("domain.freedomDate", ctx?.requestId, async () => {
      const result = await compute();
      const outputSize = result ? 1 : 0;
      return { value: result, inputSize: purchases.length, outputSize };
    });

  if (!key) return profiledCompute();
  return redisCache(key, profiledCompute, 300, { requestId: ctx?.requestId });
}

export const obtenerFechaLibertad = calculateFreedomDate;
