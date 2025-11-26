// CreditLinearGauge.tsx
"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

type Props = {
  percentageUsed: number;
};

const WIDTH = 400;
const HEIGHT = 24;

const segments = [
  { color: "#22c55e", x: 0 },
  { color: "#facc15", x: 0.25 },
  { color: "#fb923c", x: 0.5 },
  { color: "#ef4444", x: 0.75 },
];

type Level = "verde" | "amarillo" | "naranja" | "rojo";

const tipsByLevel: Record<Level, string[]> = {
  verde: [
    "Sigue pagando el total mensual para cerrar el período limpio.",
    "Mantén tu uso bajo 30%: mejora tu score y reduce intereses.",
    "Si puedes, adelanta un pago pequeño y gana colchón para imprevistos.",
    "Configura recordatorios de pago automático y evita recargos.",
    "Aprovecha las cuotas sin interés solo si encajan en tu presupuesto.",
    "Revisa tus suscripciones: cancela las que no uses este mes.",
    "Guarda un 5% extra de tu ingreso para prevenir uso de crédito.",
    "Compra solo lo que puedas pagar en un ciclo completo.",
    "Haz un control semanal de movimientos para detectar cargos raros.",
    "Usa el crédito como puente, no como ingreso adicional.",
  ],
  amarillo: [
    "Baja a 30% usando un pago adicional planificado esta semana.",
    "Prioriza pagar compras con interés más alto primero.",
    "Evita nuevas compras hasta que bajes de 30% de uso.",
    "Revisa si alguna compra puede refinanciarse sin costo.",
    "Sube tu pago mínimo en 10-15% para salir del amarillo.",
    "Agrupa pagos el mismo día para no olvidar ninguno.",
    "Si recibes ingresos variables, aparta una parte para adelantar cuotas.",
    "Evita retiros en efectivo con la tarjeta: tienen cargos altos.",
    "No uses cuotas largas para gastos diarios: encarecen el mes.",
    "Compara tu uso actual con tu plan anual y corrige desviaciones.",
  ],
  naranja: [
    "Haz un pago de choque: reduce al menos 10% del saldo total.",
    "Reordena gastos: mueve compras esenciales a débito este mes.",
    "Congela compras no urgentes hasta volver al amarillo.",
    "Busca cargos duplicados o servicios no usados y reclámalos.",
    "Negocia diferir intereses o cuotas si el comercio lo permite.",
    "Evita cuotas nuevas: cada compra sube tu riesgo y costo.",
    "Programa dos pagos en el mes: divide el esfuerzo y baja interés.",
    "Redirige ingresos extra a la deuda más cara primero.",
    "Revisa el calendario: paga antes del corte para bajar intereses.",
    "Anota cada pago en tu plan para no perder el rumbo.",
  ],
  rojo: [
    "Detén nuevas compras: prioriza volver al naranja cuanto antes.",
    "Haz el pago más grande posible antes del corte.",
    "Llama y verifica cargos dudosos de inmediato.",
    "Lista tus compras: paga primero las que tienen más interés.",
    "Si tienes ahorros líquidos, usa una parte para bajar a <80%.",
    "Divide tu pago en fechas cercanas para reducir intereses diarios.",
    "Cancela suscripciones y gastos variables hasta estabilizar.",
    "Evita pagos mínimos: solo alargan la deuda y suben el costo.",
    "Establece un monto fijo semanal para salir del rojo rápido.",
    "Cuando bajes, mantén un colchón en efectivo para no recaer.",
  ],
};

export default function CreditLinearGauge({ percentageUsed }: Props) {
  const clipPathId = `gauge-clip-${useId().replace(/:/g, "")}`;
  const pct = Math.max(0, Math.min(100, percentageUsed));

  const level: Level = useMemo(() => {
    if (pct < 30) return "verde";
    if (pct < 60) return "amarillo";
    if (pct < 80) return "naranja";
    return "rojo";
  }, [pct]);

  const arrowPosition = useMemo(() => {
    if (level === "verde") return 0.125;
    if (level === "amarillo") return 0.375;
    if (level === "naranja") return 0.625;
    return 0.875;
  }, [level]);

  const memoryRef = useRef<{
    remaining: Record<Level, number[]>;
    last: Record<Level, number | null>;
  }>({
    remaining: {
      verde: Array.from({ length: 10 }, (_, i) => i),
      amarillo: Array.from({ length: 10 }, (_, i) => i),
      naranja: Array.from({ length: 10 }, (_, i) => i),
      rojo: Array.from({ length: 10 }, (_, i) => i),
    },
    last: { verde: null, amarillo: null, naranja: null, rojo: null },
  });

  const [tip, setTip] = useState(() => tipsByLevel[level][0]);

  const getTipForLevel = useCallback(
    (currentLevel: Level) => {
      const { remaining, last } = memoryRef.current;
      let pool = remaining[currentLevel];

      if (pool.length === 0) {
        pool = Array.from({ length: 10 }, (_, i) => i);
        // Evita repetir inmediatamente el último mostrado al reiniciar.
        if (last[currentLevel] !== null && pool.length > 1) {
          pool = pool.filter((idx) => idx !== last[currentLevel]);
        }
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      const chosenIdx = pool[randomIndex];
      const updatedPool = pool.filter((_, i) => i !== randomIndex);

      memoryRef.current = {
        remaining: { ...remaining, [currentLevel]: updatedPool },
        last: { ...last, [currentLevel]: chosenIdx },
      };

      return tipsByLevel[currentLevel][chosenIdx];
    },
    [],
  );

  useEffect(() => {
    setTip(getTipForLevel(level));
  }, [getTipForLevel, level]);

  const arrowX = arrowPosition * WIDTH;

  return (
    <div className="w-full" style={{ maxWidth: WIDTH }}>
      <div className="relative">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Uso: ${pct}%`}>
          <defs>
            <clipPath id={clipPathId}>
              <rect x={0} y={0} width={WIDTH} height={HEIGHT} rx={HEIGHT / 2} />
            </clipPath>
          </defs>

          <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#0b0f17" rx={HEIGHT / 2} />
          <g clipPath={`url(#${clipPathId})`}>
            {segments.map((seg, idx) => (
              <rect
                key={idx}
                x={seg.x * WIDTH}
                y={0}
                width={WIDTH * 0.25}
                height={HEIGHT}
                fill={seg.color}
              />
            ))}
          </g>
        </svg>
        <svg
          width={16}
          height={12}
          viewBox="0 0 16 12"
          className="pointer-events-none absolute -top-6"
          style={{ left: arrowX - 8 }}
        >
          <path d="M0 0L8 12L16 0H0Z" fill="white" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-slate-300">{tip}</p>
    </div>
  );
}
