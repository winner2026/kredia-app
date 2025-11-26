import Link from "next/link";
import { ActivitySquare, Calculator, CalendarClock, Gauge, Target } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    title: "Calculadora automática de cuotas",
    description: "Cada compra se convierte en un plan claro con pagos optimizados para ahorrar intereses.",
    icon: Calculator,
  },
  {
    title: "Proyección real a 12 meses",
    description: "Ve tu futuro financiero mes a mes sin hojas de cálculo ni suposiciones.",
    icon: CalendarClock,
  },
  {
    title: "Indicador de riesgo inteligente",
    description: "Semáforo vivo que anticipa límites, cargos y desbalances antes de que ocurran.",
    icon: ActivitySquare,
  },
  {
    title: "Fecha exacta en que vuelves a $0",
    description: (
      <>
        <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> te marca el día que tu tarjeta respira en cero y cómo
        acelerarlo.
      </>
    ),
    icon: Target,
  },
  {
    title: (
      <>
        <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> Score — tu nivel de libertad financiera
      </>
    ),
    description: "Una métrica accionable que sube cuando tomas decisiones correctas, no cuando gastas más.",
    icon: Gauge,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.26em] text-indigo-200/80">
              Cómo te libera <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span>
            </p>
            <h2 className="text-3xl font-semibold text-slate-50">Acciones claras, cero confusión.</h2>
            <p className="max-w-2xl text-base text-slate-300">
              Reinventamos la relación con tu tarjeta: datos en tiempo real, decisiones automatizadas y control total sin fricción.
            </p>
          </div>
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1567A6] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(21,103,166,0.28)] transition hover:-translate-y-[2px] hover:bg-[#115782]"
          >
            Ver demo sin registrarme
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}




