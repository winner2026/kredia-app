import type { PreviewData } from "@/types/purchase-preview";

type Props = {
  preview: PreviewData | null;
  loading?: boolean;
};

function formatMoney(value?: number) {
  if (!Number.isFinite(value ?? 0)) return "$0";
  return `$${Math.round(value ?? 0).toLocaleString("es-AR")}`;
}

function formatDateLabel(iso?: string) {
  if (!iso) return "Sin dato";
  const date = new Date(iso);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

export function PurchasePreviewCard({ preview, loading }: Props) {
  if (loading) {
    return (
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-emerald-400/10" />
        <div className="relative space-y-2 text-sm text-slate-300">Calculando claridad financiera...</div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-emerald-400/10" />
        <div className="relative space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-200/80">Libertad financiera</p>
          <h3 className="text-2xl font-semibold text-slate-50">Así se ve tu claridad financiera. En segundos.</h3>
          <p className="text-sm text-slate-300">
            Completa los campos de monto y cuotas para ver tu riesgo, pago recomendado y fecha exacta en que vuelves a
            $0.
          </p>
        </div>
      </div>
    );
  }

  const riskColor =
    preview.newRisk === "green"
      ? "text-emerald-200 bg-emerald-500/15"
      : preview.newRisk === "yellow"
      ? "text-amber-200 bg-amber-500/20"
      : "text-rose-200 bg-rose-500/20";

  const weeksAhead = (() => {
    if (!preview.freedomDate || !preview.freedomDateWithExtra) return null;
    const base = new Date(preview.freedomDate).getTime();
    const boosted = new Date(preview.freedomDateWithExtra).getTime();
    const diff = Math.max(0, base - boosted);
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 7)));
  })();

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-emerald-400/10" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-200/80">Libertad financiera</p>
              <h3 className="text-xl font-semibold text-slate-50">Así se ve tu claridad financiera. En segundos.</h3>
              <p className="text-xs text-slate-400">
                Cierre día {preview.card.closingDay} · Vence día {preview.card.dueDay}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskColor}`}>
              Riesgo {preview.newRisk}
            </span>
          </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Pago recomendado de este mes</p>
            <p className="text-2xl font-semibold text-emerald-200">{formatMoney(preview.recommendedPayment)}</p>
            <p className="text-xs text-slate-400">35% del gasto mensual proyectado.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Evitas intereses</p>
            <p className="text-2xl font-semibold text-indigo-100">{formatMoney(preview.interestSavings)}</p>
            <p className="text-xs text-slate-400">Calculado sobre el nuevo compromiso mensual.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Deuda mensual estimada</p>
            <p className="text-lg font-semibold text-slate-50">{formatMoney(preview.newMonthlyTotal)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Utilización proyectada</p>
            <p className="text-lg font-semibold text-slate-50">{preview.newUtilization}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Riesgo</p>
            <p className="text-lg font-semibold capitalize text-slate-50">{preview.newRisk}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Vuelves a $0 en</p>
            <p className="text-lg font-semibold text-slate-50">{formatDateLabel(preview.freedomDate)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Si agregas $120 extra</p>
            <p className="text-lg font-semibold text-emerald-200">
              {weeksAhead ? `${weeksAhead} semanas antes` : "Sin cambio"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Optimización por cierre</p>
            <p className="mt-2 text-sm text-slate-50">
              {preview.daysToNextPeriod === 0
                ? "Si compras hoy ya pasa al próximo período."
                : `Si esperas ${preview.daysToNextPeriod} días, cae en el próximo período y liberas este mes.`}
            </p>
          </div>
          <div className="rounded-2xl border border-fuchsia-500/20 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-fuchsia-200">Fecha exacta de liberación</p>
            <p className="mt-2 text-sm text-slate-50">
              Con esta compra quedarás libre el {formatDateLabel(preview.lastDueDate ?? preview.freedomDate)}.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">Alertas inteligentes</p>
            <p className="mt-2 text-sm text-slate-50">
              Tu próximo pago vence el {formatDateLabel(preview.nextDueDate ?? preview.firstDueDate)} — si pagas hoy evitas riesgos e intereses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
