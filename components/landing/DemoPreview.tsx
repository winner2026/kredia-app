import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DemoPreview() {
  return (
    <section id="demo" className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-emerald-400/10" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex-1 space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                Demo visual
              </p>
              <h3 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Así se ve tu claridad financiera. En segundos.
              </h3>
              <p className="text-base text-slate-300">
                Un panel que responde en tiempo real: deuda actual, cuotas, fecha exacta de tu libertad y riesgo inteligente para no perder el control.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#1567A6] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(21,103,166,0.35)] transition-transform duration-150 hover:-translate-y-[2px] hover:bg-[#115782]"
              >
                <span className="whitespace-nowrap">
                  Entrar a <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> ahora
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="relative flex-1">
              <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-indigo-400/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span>
                      Mockup <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span>
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                      Vista previa
                    </span>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-black/70 p-5 ring-1 ring-white/5">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Tu plan de libertad</span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-100">
                        Saludable
                      </span>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-slate-400">Pago recomendado de este mes</p>
                        <p className="mt-2 text-2xl font-semibold text-emerald-200">$620</p>
                        <p className="text-xs text-slate-400">Evitas $210 en intereses.</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-slate-400">Vuelves a $0 en</p>
                        <p className="mt-2 text-2xl font-semibold text-indigo-100">05 / Ago</p>
                        <p className="text-xs text-slate-400">Si agregas $120 extra: 2 semanas antes.</p>
                      </div>
                    </div>
                    <div className="mt-5 h-32 w-full rounded-xl bg-gradient-to-br from-indigo-500/20 via-slate-800/60 to-emerald-400/20 ring-1 ring-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




