"use client";

import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Incluido en beta",
    description: "Panel claro, alertas básicas y ruta a $0 sin compartir datos sensibles.",
    perks: ["Presupuesto inteligente", "Alertas de gasto", "Plan de deuda guiado"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99 USD",
    description: "Todo KredIA para operar mes a mes con recomendaciones en tiempo real.",
    perks: ["Presupuesto avanzado", "Plan de salida acelerado", "Ahorro guiado para metas", "Soporte humano prioritario"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "Próximamente",
    description: "Optimización a medida para equipos o familias con reportes profundos.",
    perks: ["Reportes personalizados", "Acompañamiento dedicado", "Controles multiusuario"],
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section className="relative isolate bg-[#0d2440] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Planes</p>
          <h3 className="text-3xl font-extrabold tracking-tight">Elige cómo empezar. Sin letra chica.</h3>
          <p className="max-w-3xl text-lg text-slate-200">
            Mismo panel claro en todos los planes. Activa hoy, valida valor y decide antes de compartir datos sensibles.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border ${
                plan.highlight ? "border-blue-300/50 bg-gradient-to-br from-[#0c1e36] via-[#0b213d] to-[#0f2e51]" : "border-white/10 bg-white/5"
              } p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-100">{plan.name}</p>
                {plan.highlight && (
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-50">
                    Recomendado
                  </span>
                )}
              </div>
              <p className="mt-3 text-3xl font-bold">{plan.price}</p>
              <p className="mt-2 text-sm text-slate-200">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-100">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-200" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(37,99,235,0.35)] transition hover:-translate-y-[1px] hover:bg-blue-500"
              >
                Comenzar ahora
              </Link>
              <p className="mt-3 text-xs text-slate-300">Sin datos sensibles. Primero te mostramos valor.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
