import { ClipboardCheck, Coins, Gauge, HeartHandshake, ShieldCheck, Target } from "lucide-react";

const benefits = [
  {
    icon: ClipboardCheck,
    title: "Presupuesto por IA",
    description: "Calcula montos seguros según tus ingresos y deudas en segundos.",
  },
  {
    icon: Gauge,
    title: "Alertas en tiempo real",
    description: "Te avisa antes de pasarte y mantiene tus números en verde.",
  },
  {
    icon: Coins,
    title: "Ahorro programado",
    description: "Aparta para metas sin tocar lo esencial ni recurrir al crédito.",
  },
  {
    icon: Target,
    title: "Plan de salida de deuda",
    description: "Ruta clara para dejar de pagar mínimos y adelantar pagos con seguridad.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad bancaria",
    description: "Datos cifrados, sin ventas de información ni publicidad invasiva.",
  },
  {
    icon: HeartHandshake,
    title: "Acompañamiento experto",
    description: "Personas reales para ajustes y dudas. Hablamos tu idioma y contexto.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative isolate bg-[#0d2440] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Solución</p>
            <h2 className="text-3xl font-extrabold tracking-tight">KredIA te entrega claridad lista para actuar.</h2>
            <p className="max-w-2xl text-lg text-slate-200">
              Un panel simple y accionable: cuánto puedes gastar hoy, cuánto destinar a deudas y la fecha en la que vuelves a $0.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-blue-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-transparent to-white/5 opacity-0 transition group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-200/15 text-blue-100">
                  <benefit.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="text-sm text-slate-200">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
