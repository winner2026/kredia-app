import { AlertOctagon } from "lucide-react";

const painPoints = [
  "No sabes cuánto debes hoy ni mañana.",
  "El banco solo muestra el pasado, nunca el futuro.",
  "El estado de cuenta es confuso.",
  "Pagas mínimo y nunca terminas.",
  "Te quedas sin límite cuando menos lo esperas.",
];

export function ProblemSection() {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10">
          <div className="absolute inset-px rounded-[22px] bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-emerald-400/10" />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.26em] text-indigo-200/80">
              Sección del problema
            </p>
            <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              El verdadero problema no eres tú. Es la oscuridad del sistema.
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {painPoints.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3 text-slate-200">
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 via-indigo-500/25 to-slate-800/80 shadow-inner shadow-white/5">
                    <AlertOctagon className="h-4 w-4 text-rose-200" aria-hidden />
                  </span>
                  <span className="text-sm leading-6 text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


