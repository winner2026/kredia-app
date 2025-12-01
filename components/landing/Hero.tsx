"use client";

import Link from "next/link";
import { Check, Play, Shield } from "lucide-react";

const bullets = [
  "Organiza tu dinero mensual en minutos",
  "Evita deudas y sal del ciclo de pagos mínimos",
  "Presupuesto inteligente y claro, sin hojas de cálculo",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#05152b] via-[#0b213d] to-[#0f2e51] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,128,0.12),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_34%)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.05fr,0.95fr] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
            Nuevo · Kredia Planner
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Tu presupuesto inteligente para vivir sin deudas
            </h1>
            <p className="text-lg text-slate-200">
              Claridad financiera real para planear tu mes, controlar gastos y ahorrar con calma. Diseñado para adultos que
              quieren libertad y cero sorpresas.
            </p>
          </div>

          <ul className="space-y-2 text-base text-slate-100">
            {bullets.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300/20 text-amber-200">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-[#0c1e36] shadow-[0_15px_45px_rgba(218,180,106,0.35)] transition hover:-translate-y-[1px] hover:bg-amber-200"
            >
              Comienza gratis
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-200/60"
            >
              <Play className="h-4 w-4" aria-hidden />
              Ver cómo funciona
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-200">
            <Shield className="h-4 w-4 text-amber-200" aria-hidden />
            Datos seguros · Sin letras pequeñas · Soporte humano
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-amber-200/10" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Dashboard</p>
                  <p className="text-sm text-slate-100">Kredia Planner</p>
                </div>
                <span className="rounded-full bg-amber-300/20 px-3 py-1 text-[11px] font-semibold text-amber-100">
                  Finanzas claras
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0c1e36] p-5 shadow-inner shadow-black/20">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Presupuesto mensual</span>
                  <span className="rounded-full bg-amber-200/15 px-2 py-1 text-[11px] text-amber-100">Sugerido</span>
                </div>
                <p className="mt-4 text-3xl font-semibold text-amber-200">$1,250</p>
                <p className="text-sm text-slate-300">Disponible para tus metas sin tocar tus básicos.</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-200">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[11px] text-slate-300">Gastos fijos</p>
                    <p className="text-lg font-semibold text-white">$1,050</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[11px] text-slate-300">Deuda controlada</p>
                    <p className="text-lg font-semibold text-amber-200">$420</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[11px] text-slate-300">Ahorro</p>
                    <p className="text-lg font-semibold text-emerald-200">$280</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-100">Claridad</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Sin deudas en 7 meses</h3>
                  <p className="text-sm text-slate-200">Plan recomendado con alertas para no desviarte.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-100">Control</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Gasto diario seguro</h3>
                  <p className="text-sm text-slate-200">Montos límite para llegar tranquilo a fin de mes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
