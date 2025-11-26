export type DayNumber = number;

/**
 * Normaliza un día de mes al rango 1-31. Acepta decimales o NaN y retorna un entero seguro.
 * Casos a testear:
 * - clampDay(0) => 1
 * - clampDay(32) => 31
 * - clampDay(15.8) => 16
 * - clampDay(Number.NaN) => 1
 */
export function clampDay(value: number): DayNumber {
  if (!Number.isFinite(value)) return 1;
  return Math.min(31, Math.max(1, Math.round(value)));
}

/**
 * Retorna la diferencia en meses entre dos fechas (from -> to), ignorando el día.
 * Casos a testear:
 * - misma fecha => 0
 * - de enero a marzo mismo año => 2
 * - de diciembre a enero siguiente => 1
 * - de fecha futura a pasada => negativo acorde.
 */
export function getMonthDiff(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/**
 * Devuelve el inicio del mes (UTC-safe) sin mutar el objeto original.
 * Casos a testear:
 * - mantiene año/mes y pone día 1.
 * - no modifica el objeto fuente.
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
