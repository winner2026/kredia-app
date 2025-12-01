import { ClipboardCheck, Coins, Gauge, HeartHandshake, ShieldCheck, Target } from "lucide-react";

const benefits = [
  {
    icon: ClipboardCheck,
    title: "Presupuesto inteligente",
    description: "Te propone montos realistas con base en tus ingresos y gastos fijos, sin fórmulas raras.",
  },
  {
    icon: Gauge,
    title: "Control sin esfuerzo",
    description: "Alertas claras para no pasarte y recomendaciones para mantenerte en verde cada mes.",
  },
  {
    icon: Coins,
    title: "Ahorro sin estrés",
    description: "Reserva automática para metas: emergencias, viajes o pagos grandes sin endeudarte.",
  },
  {
    icon: Target,
    title: "Salir del ciclo de deuda",
    description: "Plan paso a paso para dejar de pagar mínimos y liquidar más rápido.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad y privacidad",
    description: "Datos cifrados y alojados de forma segura. Sin ventas de información ni publicidad.",
  },
  {
    icon: HeartHandshake,
    title: "Acompañamiento humano",
    description: "Soporte cercano para resolver dudas. Hablamos tu idioma y entendemos tu contexto.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative isolate bg-[#0d2440] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Solución</p>
            <h2 className="text-3xl font-semibold">Kredia Planner te da claridad y calma.</h2>
            <p className="max-w-2xl text-lg text-slate-200">
              Toda tu vida financiera en un panel simple: lo que entra, lo que sale, lo que puedes gastar y cuándo estarás libre
              de deudas.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-amber-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 via-transparent to-white/5 opacity-0 transition group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/15 text-amber-100">
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
