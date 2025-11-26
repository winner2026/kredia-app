// DashboardView.tsx
"use client";

import { useMemo, useState } from "react";
import CreditLinearGauge from "./CreditLinearGauge";

type FormData = {
  nombreTarjeta: string;
  limiteTarjeta: string;
  descripcion: string;
  montoCuota: string;
  cuotasPagadas: string;
  cantidadCuotas: string;
};

type Purchase = {
  id: string;
  descripcion: string;
  montoCuota: number;
  cuotasPagadas: number;
  cantidadCuotas: number;
};

export default function DashboardView() {
  const [form, setForm] = useState<FormData>({
    nombreTarjeta: "",
    limiteTarjeta: "",
    descripcion: "",
    montoCuota: "",
    cuotasPagadas: "",
    cantidadCuotas: "",
  });
  const [resumen, setResumen] = useState<FormData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [cardLocked, setCardLocked] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    if (cardLocked && (field === "nombreTarjeta" || field === "limiteTarjeta")) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const montoCuota = Number(form.montoCuota);
    const cuotasPagadas = Number(form.cuotasPagadas);
    const cantidadCuotas = Number(form.cantidadCuotas);
    const limite = Number(form.limiteTarjeta || resumen?.limiteTarjeta || 0);

    if (!form.nombreTarjeta || !limite || !form.descripcion || !montoCuota || !cantidadCuotas) return;

    const compra: Purchase = {
      id: editingId ?? crypto.randomUUID(),
      descripcion: form.descripcion,
      montoCuota,
      cuotasPagadas,
      cantidadCuotas,
    };

    if (editingId) {
      setPurchases((prev) => prev.map((p) => (p.id === editingId ? compra : p)));
      setEditingId(null);
    } else {
      setPurchases((prev) => [...prev, compra]);
    }

    setResumen(form);
    if (!cardLocked) setCardLocked(true);
    setForm((prev) => ({
      ...prev,
      descripcion: "",
      montoCuota: "",
      cuotasPagadas: "",
      cantidadCuotas: "",
    }));
  };

  const startEdit = (purchase: Purchase) => {
    setForm((prev) => ({
      ...prev,
      descripcion: purchase.descripcion,
      montoCuota: String(purchase.montoCuota),
      cuotasPagadas: String(purchase.cuotasPagadas),
      cantidadCuotas: String(purchase.cantidadCuotas),
    }));
    setEditingId(purchase.id);
  };

  const inputClass =
    "w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 placeholder-slate-400 shadow-sm focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/30";

  const totalCompras = useMemo(
    () => purchases.reduce((sum, p) => sum + p.montoCuota * p.cantidadCuotas, 0),
    [purchases],
  );

  const limiteMaximo = useMemo(
    () => Number(form.limiteTarjeta || resumen?.limiteTarjeta || 0),
    [form.limiteTarjeta, resumen?.limiteTarjeta],
  );

  const usoPorcentaje = useMemo(() => {
    if (limiteMaximo <= 0) return 0;
    return Math.min(100, Math.round((totalCompras / limiteMaximo) * 100));
  }, [totalCompras, limiteMaximo]);

  const limiteTotalUsado = useMemo(() => totalCompras, [totalCompras]);

  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }).map((_, idx) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() + idx);
      const label = d.toLocaleDateString("es-ES", { month: "short" });
      return { label, total: 0 };
    });

    purchases.forEach((p) => {
      const totalInstallments = Math.max(0, p.cantidadCuotas);
      const alreadyPaid = Math.min(Math.max(0, p.cuotasPagadas), totalInstallments);
      const remainingMonths = Math.min(12, totalInstallments - alreadyPaid);

      for (let i = 0; i < remainingMonths; i++) {
        months[i].total += p.montoCuota;
      }
    });

    return months;
  }, [purchases]);

  const maxTotal = monthlyTotals.reduce((max, m) => Math.max(max, m.total), 0);
  const displayMaxTotal = maxTotal || 0;
  const referenceLines = displayMaxTotal
    ? [1, 0.75, 0.5, 0.25].map((pct) => ({
        pct,
        amount: Math.round(displayMaxTotal * pct),
      }))
    : [];
  const scaleLevels = referenceLines.length ? [...referenceLines, { pct: 0, amount: 0 }] : [{ pct: 0, amount: 0 }];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#E13787]">Dashboard de compras</h1>
          <p className="text-sm text-slate-400">
            Registra las compras de tu tarjeta y visualiza un resumen de forma clara y profesional.
          </p>
        </header>

        {purchases.length > 0 && (
          <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-200">Tarjeta</p>
                <p className="mt-1 inline-block rounded-md bg-blue-900 px-3 py-1 text-3xl font-bold text-slate-50">
                  {resumen?.nombreTarjeta || form.nombreTarjeta || "-"}
                </p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>Uso del límite</p>
                <p className="text-3xl font-bold text-[#2ECC71]">{usoPorcentaje}%</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <CreditLinearGauge percentageUsed={usoPorcentaje} />
              <p className="text-sm text-slate-300">
                Límite total usado: <span className="text-[#2ECC71] font-semibold">${limiteTotalUsado}</span>
              </p>
            </div>
          </section>
        )}

        <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#F8B738]">Registrar compra</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nombre de la tarjeta</label>
                <input
                  className={inputClass}
                  type="text"
                  value={form.nombreTarjeta}
                  onChange={(e) => handleChange("nombreTarjeta", e.target.value)}
                  placeholder="Ej. Visa Crédito"
                  disabled={cardLocked}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Límite de la tarjeta</label>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={form.limiteTarjeta}
                  onChange={(e) => handleChange("limiteTarjeta", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Ej. 500000"
                  disabled={cardLocked}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nombre de la compra</label>
                <input
                  className={inputClass}
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  placeholder="Ej. Suscripción streaming"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Cantidad de cuotas</label>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={form.cantidadCuotas}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 2);
                    if (!onlyDigits) return handleChange("cantidadCuotas", "");
                    const num = Math.min(Number(onlyDigits), 60);
                    if (num === 0) return handleChange("cantidadCuotas", "");
                    handleChange("cantidadCuotas", String(num));
                  }}
                  placeholder="Ej. 6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Monto de cada cuota</label>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={form.montoCuota}
                  onChange={(e) => handleChange("montoCuota", e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="Ej. 120000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Cuotas pagadas</label>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={form.cuotasPagadas}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
                    if (!digits) return handleChange("cuotasPagadas", "");

                    const cuotasTotales = Number(form.cantidadCuotas) || 0;
                    const value = Number(digits);
                    const clamped = cuotasTotales > 0 ? Math.min(value, cuotasTotales) : value;

                    handleChange("cuotasPagadas", String(clamped));
                  }}
                  placeholder="Ej. 2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300"
            >
              {editingId ? "Guardar cambios" : "Registrar compra"}
            </button>
          </form>
        </section>

        {purchases.length > 0 && resumen && (
          <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-center text-fuchsia-400">Compras ingresadas</h3>
            <div className="text-sm text-slate-200">
              <p>
                <span className="font-medium">Tarjeta: </span>
                {resumen.nombreTarjeta || "-"}
              </p>
              <p>
                <span className="font-medium">Límite: </span>
                <span className="text-[#2ECC71]">
                  {resumen.limiteTarjeta ? `$${resumen.limiteTarjeta}` : "-"}
                </span>
              </p>
            </div>
            <div className="space-y-3">
              {purchases.map((p) => (
                <div
                  key={p.id}
                  className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-slate-100 flex flex-col gap-2"
                >
                  <p>
                    <span className="font-medium">Nombre de la compra: </span>
                    {p.descripcion}
                  </p>
                  <p>
                    <span className="font-medium">Monto de cada cuota: </span>
                    <span className="text-[#2ECC71]">${p.montoCuota}</span>
                  </p>
                  <p>
                    <span className="font-medium">Cantidad de cuotas: </span>
                    {p.cantidadCuotas}
                  </p>
                  <p>
                    <span className="font-medium">Valor total de la compra: </span>
                    <span className="text-[#2ECC71]">${p.montoCuota * p.cantidadCuotas}</span>
                  </p>
                  <p>
                    <span className="font-medium">Cuotas pagadas: </span>
                    {p.cuotasPagadas}
                  </p>
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="w-fit rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {purchases.length > 0 && (
          <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold text-center text-yellow-300">Proyección 12 meses</h3>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-left">
                  <p className="mt-1 text-sm text-slate-300">¿Cuánto pagarás desde el mes actual?</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-right">
                  <p className="text-sm text-slate-300">Total mensual máximo</p>
                  <p className="text-[#2ECC71] font-semibold">${displayMaxTotal}</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-900/60 p-5 shadow-inner shadow-black/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(232,121,249,0.06),transparent_35%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(14,165,233,0.05),transparent_35%)]" />
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-900/30 p-4">
                <div className="grid grid-cols-[72px,1fr] items-end gap-3">
                  <div className="relative h-64 pr-2 text-[11px] text-slate-200">
                    <div className="absolute right-0 inset-y-0 w-px bg-white/15" />
                    {scaleLevels.map((level) => (
                      <span
                        key={level.pct}
                        className="absolute right-1 -translate-y-1/2 text-right tabular-nums"
                        style={{ top: `${(1 - level.pct) * 100}%` }}
                      >
                        ${level.amount}
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-10 flex flex-col justify-between">
                      {referenceLines.map((line) => (
                        <span key={line.pct} className="block h-px w-full bg-white/5" />
                      ))}
                    </div>
                    <div className="grid grid-cols-12 items-end gap-2 sm:gap-3">
                      {monthlyTotals.map((m, idx) => {
                        const heightPercent = displayMaxTotal > 0 ? Math.min(100, (m.total / displayMaxTotal) * 100) : 0;
                        return (
                          <div key={idx} className="group flex flex-col items-center justify-end">
                            <div
                              className="group relative flex h-64 w-8 items-end justify-center overflow-hidden rounded-lg bg-slate-900/50 ring-1 ring-white/5 sm:w-9"
                              aria-label={`Pago en ${m.label}: $${m.total}`}
                              title={`$${m.total}`}
                            >
                              <div
                                className="w-full rounded-b-lg bg-gradient-to-t from-[#db2777] via-[#ec4899] to-[#f9a8d4] transition-all duration-300 ease-out"
                                style={{ height: `${heightPercent}%` }}
                              />
                              <div className="pointer-events-none absolute -top-10 translate-y-1 opacity-0 rounded-md bg-black/80 px-2 py-1 text-[11px] text-white shadow transition group-hover:translate-y-0 group-hover:opacity-100">
                                {m.label}: ${m.total}
                              </div>
                            </div>
                            <span className="mt-2 text-[11px] uppercase tracking-wide text-slate-300">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
