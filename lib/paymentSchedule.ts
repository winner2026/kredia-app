// Compatibilidad: este archivo expone las funciones del dominio financiero desde lib/domain/*.
// Las funciones son puras y no dependen de React/Next.

import {
  buildSchedule,
  calculateFreedomDate,
  calculateMonthlyProjection,
  calcularFechaVencimiento,
  calcularMesSegunCierre,
  type InstallmentSchedule,
  type ScheduleConfig,
  type ScheduleInput,
} from "./domain/paymentSchedule";

export type { InstallmentSchedule, ScheduleConfig, ScheduleInput };
export {
  buildSchedule as construirSchedule,
  calculateMonthlyProjection as proyectarMeses,
  calculateFreedomDate as obtenerFechaLibertad,
  calcularFechaVencimiento,
  calcularMesSegunCierre,
};
