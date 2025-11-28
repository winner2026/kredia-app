// DashboardView.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CreditLinearGauge from "./CreditLinearGauge";
import {
  construirSchedule,
  obtenerFechaLibertad,
  proyectarMeses,
  type InstallmentSchedule,
} from "@/lib/paymentSchedule";

const HEIGHT_CLASSES = [
  "h-[0%]",
  "h-[5%]",
  "h-[10%]",
  "h-[15%]",
  "h-[20%]",
  "h-[25%]",
  "h-[30%]",
  "h-[35%]",
  "h-[40%]",
  "h-[45%]",
  "h-[50%]",
  "h-[55%]",
  "h-[60%]",
  "h-[65%]",
  "h-[70%]",
  "h-[75%]",
  "h-[80%]",
  "h-[85%]",
  "h-[90%]",
  "h-[95%]",
  "h-[100%]",
];

function getHeightClass(value: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const idx = Math.round(clamped / 5);
  return HEIGHT_CLASSES[idx] ?? "h-[0%]";
}

type FormData = {
  nombreTarjeta: string;
  limiteTarjeta: string;
  diaCierre: string;
  diaVencimiento: string;
  descripcion: string;
  montoCuota: string;
  cuotasPagadas: string;
  cantidadCuotas: string;
  fechaCompra: string;
};

type Purchase = {
  id: string;
  descripcion: string;
  montoCuota: number;
  cuotasPagadas: number;
  cantidadCuotas: number;
  fechaCompra: string;
};

type DashboardProps = {
  initialCard?: {
    id?: string;
    nombreTarjeta: string;
    limiteTarjeta: number;
    diaCierre: number;
    diaVencimiento: number;
  } | null;
  initialPurchases?: Purchase[];
};

const toLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date(value);
  return new Date(year, month - 1, day);
};

const getTodayLocalIso = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const clampDayInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 2);
  if (!digits) return "";
  const num = Math.min(31, Math.max(1, Number(digits)));
  return String(num);
};

export default function DashboardView({ initialCard = null, initialPurchases = [] }: DashboardProps) {
  const router = useRouter();
  const todayIso = getTodayLocalIso();

  const initialForm: FormData = {
    nombreTarjeta: initialCard?.nombreTarjeta ?? "",
    limiteTarjeta: initialCard ? String(initialCard.limiteTarjeta) : "",
    diaCierre: initialCard ? String(initialCard.diaCierre) : "",
    diaVencimiento: initialCard ? String(initialCard.diaVencimiento) : "",
    descripcion: "",
    montoCuota: "",
    cuotasPagadas: "",
    cantidadCuotas: "",
    fechaCompra: todayIso,
  };

  const [form, setForm] = useState<FormData>({
    ...initialForm,
  });
  const [resumen, setResumen] = useState<FormData | null>(initialCard ? { ...initialForm } : null);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [cardLocked, setCardLocked] = useState(Boolean(initialCard));
  const [cardId, setCardId] = useState<string | null>(initialCard?.id ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    if (
      cardLocked &&
      (field === "nombreTarjeta" ||
        field === "limiteTarjeta" ||
        field === "diaCierre" ||
        field === "diaVencimiento")
    )
      return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const closingDay = Number(resumen?.diaCierre || form.diaCierre);
  const dueDay = Number(resumen?.diaVencimiento || form.diaVencimiento);
  const closingValid = closingDay >= 1 && closingDay <= 31;
  const dueValid = dueDay >= 1 && dueDay <= 31;
  const hasCalendar = closingValid && dueValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (submitting) return;
    setSubmitting(true);

    const montoCuota = Number(form.montoCuota);
    const cuotasPagadas = Number(form.cuotasPagadas);
    const cantidadCuotas = Number(form.cantidadCuotas);
    const limite = Number(form.limiteTarjeta || resumen?.limiteTarjeta || 0);
    const fechaCompra = form.fechaCompra || todayIso;

    if (
      !form.nombreTarjeta ||
      !limite ||
      !form.descripcion ||
      !montoCuota ||
      !cantidadCuotas ||
      !closingValid ||
      !dueValid
    ) {
      setSubmitting(false);
      return;
    }

    try {
      let nextCardId = cardId;
      if (!nextCardId) {
        const createCard = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bank: form.nombreTarjeta,
            limit: limite,
            closingDay: closingDay,
            dueDay: dueDay,
          }),
        });

        if (!createCard.ok) {
          const err = await createCard.json().catch(() => null);
          if (createCard.status === 401) {
            router.push("/login");
            return;
          }
          setError(err?.error ?? "No se pudo crear la tarjeta.");
          setSubmitting(false);
          return;
        }

        const payload = await createCard.json();
        nextCardId = payload.card?.id ?? null;
        if (nextCardId) setCardId(nextCardId);
      }

      if (!nextCardId) {
        setError("No se pudo asociar la tarjeta.");
        setSubmitting(false);
        return;
      }

      const totalCompra = montoCuota * cantidadCuotas;

      const createPurchase = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: nextCardId,
          description: form.descripcion,
          amountTotal: totalCompra,
          installments: cantidadCuotas,
          paidInstallments: cuotasPagadas,
          purchaseDate: fechaCompra,
        }),
      });

      if (!createPurchase.ok) {
        const err = await createPurchase.json().catch(() => null);
        if (createPurchase.status === 401) {
          router.push("/login");
          return;
        }
        setError(err?.error ?? "No se pudo registrar la compra.");
        setSubmitting(false);
        return;
      }

      const purchaseResponse = await createPurchase.json();
      const created = purchaseResponse.purchase;
      const newPurchase: Purchase = {
        id: created?.id ?? crypto.randomUUID(),
        descripcion: created?.description ?? form.descripcion,
        montoCuota: created?.amountPerMonth ?? montoCuota,
        cuotasPagadas: created ? created.installments - created.remaining : cuotasPagadas,
        cantidadCuotas: created?.installments ?? cantidadCuotas,
        fechaCompra: created?.purchaseDate
          ? new Date(created.purchaseDate).toISOString().split("T")[0]
          : fechaCompra,
      };

      if (editingId) {
        setPurchases((prev) => prev.map((p) => (p.id === editingId ? newPurchase : p)));
        setEditingId(null);
      } else {
        setPurchases((prev) => [...prev, newPurchase]);
      }

      setResumen({
        ...form,
        limiteTarjeta: form.limiteTarjeta || String(limite),
        diaCierre: form.diaCierre || String(closingDay),
        diaVencimiento: form.diaVencimiento || String(dueDay),
      });
      if (!cardLocked) setCardLocked(true);
      setForm((prev) => ({
        ...prev,
        descripcion: "",
        montoCuota: "",
        cuotasPagadas: "",
        cantidadCuotas: "",
        fechaCompra: todayIso,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (purchase: Purchase) => {
    setForm((prev) => ({
      ...prev,
      descripcion: purchase.descripcion,
      montoCuota: String(purchase.montoCuota),
      cuotasPagadas: String(purchase.cuotasPagadas),
      cantidadCuotas: String(purchase.cantidadCuotas),
      fechaCompra: purchase.fechaCompra,
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

  const [monthlyTotals, setMonthlyTotals] = useState<{ label: string; total: number; dueDates: Date[] }[]>([]);
  const [freedomDate, setFreedomDate] = useState<Date | null>(null);
  const [scheduleMap, setScheduleMap] = useState<Record<string, InstallmentSchedule[]>>({});

  useEffect(() => {
    const recompute = async () => {
      if (!hasCalendar) {
        const now = new Date();
        const fallback = Array.from({ length: 12 }).map((_, idx) => {
          const d = new Date(now);
          d.setMonth(d.getMonth() + idx);
          const label = d.toLocaleDateString("es-ES", { month: "short" });
          return { label, total: 0, dueDates: [] as Date[] };
        });
        setMonthlyTotals(fallback);
        setFreedomDate(null);
        setScheduleMap({});
        return;
      }

      const inputs = purchases.map((p) => ({
        purchaseDate: toLocalDate(p.fechaCompra),
        installments: p.cantidadCuotas,
        paidInstallments: p.cuotasPagadas,
        amountPerMonth: p.montoCuota,
      }));

      const [projection, freedom] = await Promise.all([
        proyectarMeses(inputs, { closingDay, dueDay }),
        obtenerFechaLibertad(inputs, { closingDay, dueDay }),
      ]);

      setMonthlyTotals(projection);
      setFreedomDate(freedom ?? null);

      const schedules = await Promise.all(
        purchases.map(async (p) => {
          const sched = await construirSchedule(
            {
              purchaseDate: toLocalDate(p.fechaCompra),
              installments: p.cantidadCuotas,
              paidInstallments: p.cuotasPagadas,
              amountPerMonth: p.montoCuota,
            },
            { closingDay, dueDay },
            Number.POSITIVE_INFINITY,
          );
          return [p.id, sched] as const;
        }),
      );
      setScheduleMap(Object.fromEntries(schedules));
    };

    void recompute();
  }, [hasCalendar, purchases, closingDay, dueDay]);

  const maxTotal = monthlyTotals.reduce((max, m) => Math.max(max, m.total), 0);
  const displayMaxTotal = maxTotal || 0;

  const freedomDateLabel = useMemo(() => {
    if (!hasCalendar || purchases.length === 0 || !freedomDate) return "Ya estás a $0";
    return freedomDate.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  }, [hasCalendar, purchases.length, freedomDate]);

  const getEndDateLabel = (purchase: Purchase) => {
    if (!hasCalendar) return "-";
    const schedule = scheduleMap[purchase.id] ?? [];
    const last = schedule[schedule.length - 1];
    if (!last) return "-";
    return last.dueDate.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  };

  const nextDueDate = useMemo(() => {
    const allDates = monthlyTotals.flatMap((m) => m.dueDates ?? []);
    if (!allDates.length) return null;
    const sorted = [...allDates].sort((a, b) => a.getTime() - b.getTime());
    return sorted[0];
  }, [monthlyTotals]);

  const latestPurchase = purchases[purchases.length - 1];
  const latestSchedule = latestPurchase ? scheduleMap[latestPurchase.id] ?? [] : [];

  const ultimaCuotaFecha =
    latestSchedule.length > 0
      ? latestSchedule[latestSchedule.length - 1].dueDate
      : null;

  const diasParaProximoPeriodo = useMemo(() => {
    if (!hasCalendar || !form.fechaCompra) return null;
    const fecha = toLocalDate(form.fechaCompra);
    if (Number.isNaN(fecha.getTime())) return null;
    const compraDay = fecha.getDate();
    if (compraDay > closingDay) return 0;
    return Math.max(0, closingDay - compraDay + 1);
  }, [form.fechaCompra, hasCalendar, closingDay]);

  const formatDescription = (text: string) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        <header className="space-y-2 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-[#E13787]">Dashboard de compras</h1>
          <p className="text-sm text-slate-400">
            Registra las compras de tu tarjeta y visualiza un resumen de forma clara y profesional.
          </p>
        </header>

        {purchases.length > 0 && (
          <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-slate-200">Tarjeta</p>
                <p className="mt-3 inline-block rounded-xl bg-blue-900 px-5 py-3 text-5xl font-extrabold text-slate-50">
                  {resumen?.nombreTarjeta || form.nombreTarjeta || "-"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Límite total de crédito:{" "}
                  <span className="text-[#2ECC71] font-semibold">
                    {limiteMaximo ? `$${limiteMaximo}` : "-"}
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Cierra el día <span className="text-cyan-300 font-semibold">{closingDay || "-"}</span> · Vence el día{" "}
                  <span className="text-fuchsia-300 font-semibold">{dueDay || "-"}</span>
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
                Límite total usado: <span className="text-[#2ECC71] font-semibold">${totalCompras}</span>
              </p>
            </div>
          </section>
        )}

        {purchases.length > 0 && (
          <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <div className="relative flex items-center justify-center gap-3 text-center">
              <h3 className="text-2xl font-semibold text-yellow-300 underline underline-offset-4">Proyección a 12 meses</h3>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-right">
                <p className="text-sm font-semibold">
                  Quedas <span className="text-rose-500">SIN DEUDAS</span> en:
                </p>
                <p className="text-[#2ECC71] font-semibold">{freedomDateLabel}</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-slate-900/60 via-slate-950 to-slate-900/60 p-4 shadow-inner shadow-black/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(232,121,249,0.06),transparent_35%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(14,165,233,0.05),transparent_35%)]" />
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[1, 0.75, 0.5, 0.25, 0].map((level) => (
                    <span key={level} className="block h-px w-full bg-white/5" />
                  ))}
                </div>
                <div className="grid grid-cols-12 items-end gap-2 sm:gap-3">
                  {monthlyTotals.map((m, idx) => {
                    const heightPercent = displayMaxTotal > 0 ? Math.min(100, (m.total / displayMaxTotal) * 100) : 0;
                    const heightClass = getHeightClass(heightPercent);
                    const fallbackDue = hasCalendar
                      ? (() => {
                          const base = new Date();
                          base.setMonth(base.getMonth() + idx);
                          const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
                          const day = Math.min(dueDay || 1, daysInMonth);
                          return new Date(base.getFullYear(), base.getMonth(), day);
                        })()
                      : undefined;
                    const dueDate = (m.dueDates?.[0] as Date | undefined) ?? fallbackDue;
                    const dueLabel = dueDate?.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    });
                    const isCurrentMonth = idx === 0;
                    const now = new Date();
                    const isOverdue = isCurrentMonth && dueDate ? now > dueDate : false;
                    return (
                      <div key={idx} className="group flex flex-col items-center justify-end">
                        <div
                          className="group relative flex h-32 w-full items-end justify-center overflow-hidden rounded-lg bg-slate-900/50 ring-1 ring-white/5"
                          aria-label={`Pago en ${m.label}: $${m.total}`}
                        >
                          <div
                            className={`w-full rounded-b-lg bg-linear-to-t from-[#db2777] via-[#ec4899] to-[#f9a8d4] transition-all duration-300 ease-out ${heightClass}`}
                          />
                          <span
                            className={`pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 text-[11px] font-semibold shadow ${
                              isOverdue ? "bg-rose-500/20 text-rose-200" : "bg-black/60 text-white"
                            }`}
                          >
                            {isOverdue ? "Mes vencido" : <><span className="text-[#2ECC71]">$</span>{m.total}</>}
                          </span>
                        </div>
                        <span className="mt-1 text-[11px] uppercase tracking-wide text-slate-300">{m.label}</span>
                        {dueLabel && (
                          <span className={`text-[10px] ${isOverdue ? "text-rose-300" : "text-cyan-200"}`}>
                            {isOverdue ? "Vencido " : "Vence "}
                            {dueLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {purchases.length > 0 && (
          <section className="rounded-lg border border-white/10 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-[#27C1D0]">Insights inteligentes</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-cyan-500/20 bg-white/5 p-4 text-sm text-slate-200 shadow">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Optimización por cierre</p>
                <p className="mt-2 font-semibold">
                  {diasParaProximoPeriodo === null
                    ? "Completa día de cierre y fecha de compra"
                    : diasParaProximoPeriodo === 0
                    ? "Si compras hoy, ya cae en el próximo período."
                    : `Si esperas ${diasParaProximoPeriodo} días para comprar, esta compra cae en el próximo período y te alivia este mes.`}
                </p>
              </div>
              <div className="rounded-xl border border-fuchsia-500/20 bg-white/5 p-4 text-sm text-slate-200 shadow">
                <p className="text-xs uppercase tracking-[0.14em] text-fuchsia-200">Fecha exacta de liberación</p>
                <p className="mt-2 font-semibold">
                  {ultimaCuotaFecha ? (
                    <>
                      Con esta compra quedarás libre el{" "}
                      <span className="text-[#E13787]">
                        {ultimaCuotaFecha.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      .
                    </>
                  ) : (
                    "Agrega una compra y te mostramos la fecha de tu última cuota."
                  )}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/5 p-4 text-sm text-slate-200 shadow">
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-200">Alertas inteligentes</p>
                <p className="mt-2 font-semibold">
                  {nextDueDate ? (
                    <>
                      Tu próximo pago vence el{" "}
                      <span className="text-[#E13787]">
                        {nextDueDate.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                      . Si pagas hoy evitas riesgos e intereses.
                    </>
                  ) : (
                    "Cuando registres compras con día de cierre y vencimiento, activamos alertas precisas."
                  )}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#F8B738]">Registrar compra</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-rose-300">{error}</p>}
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
                <label className="text-sm text-slate-300">Día de cierre (1-31)</label>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={form.diaCierre}
                  onChange={(e) => handleChange("diaCierre", clampDayInput(e.target.value))}
                  placeholder="Ej. 20"
                  disabled={cardLocked}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Día de vencimiento (1-31)</label>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={form.diaVencimiento}
                  onChange={(e) => handleChange("diaVencimiento", clampDayInput(e.target.value))}
                  placeholder="Ej. 28"
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
                  onChange={(e) => handleChange("montoCuota", e.target.value.replace(/\D/g, "").slice(0, 7))}
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
              <div className="space-y-2">
                <label className="text-sm text-slate-300" htmlFor="fecha-compra">
                  Fecha de compra
                </label>
                <input
                  id="fecha-compra"
                  className={inputClass}
                  type="date"
                  value={form.fechaCompra}
                  onChange={(e) => handleChange("fechaCompra", e.target.value)}
                  max="2100-12-31"
                  placeholder="YYYY-MM-DD"
                  aria-label="Fecha de compra"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-linear-to-r from-cyan-400 via-[#F8B738] to-[#E13787] px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-70"
              disabled={submitting}
            >
              {editingId ? "Guardar cambios" : "Registrar compra"}
            </button>
          </form>
        </section>

        {purchases.length > 0 && resumen && (
          <section className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <h3 className="text-3xl font-semibold text-center text-fuchsia-400 underline underline-offset-4">
              Compras ingresadas
            </h3>
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
              <p>
                <span className="font-medium">Cierre / Vencimiento: </span>
                <span className="text-cyan-300">{closingDay || "-"} / {dueDay || "-"}</span>
              </p>
            </div>
            <div className="space-y-3">
              {purchases.map((p) => {
                const schedule = scheduleMap[p.id] ?? [];
                const firstPending = schedule.find((s) => s.monthIndex >= 0);
                const lastSchedule = schedule[schedule.length - 1];

                return (
                  <div
                    key={p.id}
                    className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-slate-100 flex flex-col gap-2"
                  >
                    <p>
                      <span className="font-medium">Nombre de la compra: </span>
                      <span className="text-[#F8B738] font-semibold">{formatDescription(p.descripcion)}</span>
                    </p>
                    <p>
                      <span className="font-medium">Fecha de compra: </span>
                      {toLocalDate(p.fechaCompra).toLocaleDateString("es-ES")}
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
                    {firstPending && (
                      <p className="text-cyan-200">
                        La primera cuota pendiente cae en{" "}
                        {firstPending.dueDate.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}.
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Terminas de pagar: </span>
                      <span className="text-[#e11d48] font-semibold">
                        {lastSchedule
                          ? lastSchedule.dueDate.toLocaleDateString("es-ES", {
                              month: "short",
                              year: "numeric",
                            })
                          : getEndDateLabel(p)}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="w-fit rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300"
                    >
                      Editar
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
