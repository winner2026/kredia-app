"use client";

import Link from "next/link";

export function PricingSection() {
  return (
    <section className="relative isolate bg-[#0d2440] text-white">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
        <div className="rounded-3xl border border-amber-200/25 bg-gradient-to-br from-[#0c1e36] via-[#0b213d] to-[#0f2e51] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Precio simple</p>
              <h3 className="text-3xl font-semibold">Plan único Premium</h3>
              <p className="text-lg text-slate-200">
                Pago único. Sin suscripciones ocultas. Obtén todas las funciones para planear tu dinero con tranquilidad.
              </p>
              <ul className="space-y-2 text-sm text-slate-100">
                <li>• Presupuesto inteligente y alertas mensuales</li>
                <li>• Plan de salida de deudas</li>
                <li>• Ahorro guiado para metas</li>
                <li>• Soporte humano y acompañamiento</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-inner shadow-black/20">
              <p className="text-sm uppercase tracking-[0.22em] text-amber-200">Pago único</p>
              <p className="mt-2 text-4xl font-bold">$9.99 USD</p>
              <p className="text-sm text-slate-200">Acceso completo · Sin cargos recurrentes</p>
              <Link
                href="/login"
                className="mt-4 inline-block rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-[#0c1e36] shadow-[0_15px_45px_rgba(218,180,106,0.35)] transition hover:-translate-y-[1px] hover:bg-amber-200"
              >
                Activar Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
