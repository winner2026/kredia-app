import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(45,212,191,0.14),transparent_35%)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.1fr,0.9fr] md:items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-indigo-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
            Beta privada · Modo seguro
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              Tu tarjeta bajo control. Tu mente en paz.
            </h1>
            <p className="text-lg leading-7 text-slate-300 sm:text-xl">
              <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> te muestra cuánto debes realmente, cuántas cuotas te quedan, qué pagarás cada mes y cuándo vuelves a estar en cero.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1567A6] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(21,103,166,0.35)] transition-transform duration-150 hover:-translate-y-[3px] active:translate-y-[1px]"
            >
              <span className="whitespace-nowrap">
                Probar <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> gratis
              </span>
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />
              Encriptado y sin cobros ocultos
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
              <Sparkles className="h-4 w-4 text-indigo-200" aria-hidden />
              Claridad accionable en segundos
            </div>
            <p className="text-slate-400">Sin formularios eternos. Sin letra chica.</p>
          </div>
        </div>

        <div className="relative">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-indigo-100/80">
                  <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> Dash
                  </p>
                  <p className="text-sm text-slate-200">Claridad instantánea</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Riesgo bajo
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 via-slate-900/70 to-emerald-400/15 p-5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>
                    Tarjeta <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">Crédito</span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-slate-50 tracking-[0.24em]">
                  •••• 8241
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-300">
                  <div>
                    <p className="text-[11px] text-slate-400">Total estimado hoy</p>
                    <p className="text-lg font-semibold text-emerald-200">$4,280</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Cuotas restantes</p>
                    <p className="text-lg font-semibold text-slate-50">7</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Vuelves a $0 en</p>
                    <p className="text-lg font-semibold text-indigo-100">05/Ago</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="glass-panel relative rounded-2xl p-4">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                  <div className="relative flex items-center justify-between">
                    <p className="text-sm text-slate-200">Proyección 12m</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-100">
                      Optimizada
                    </span>
                  </div>
                  <div className="relative mt-4 h-16 w-full overflow-hidden rounded-lg bg-slate-900/40">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 via-indigo-400/35 to-transparent" />
                    <div className="absolute bottom-0 left-0 flex h-full w-full items-end gap-1 px-3 pb-2">
                      {[40, 52, 70, 62, 80, 68, 90].map((height, index) => (
                        <div
                          key={height + index}
                          className="w-full rounded-t-lg bg-white/60"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-panel relative rounded-2xl p-4">
                  <div className="relative flex items-center justify-between">
                    <p className="text-sm text-slate-200">Indicador de riesgo inteligente</p>
                    <span className="text-xs text-emerald-200">Verde</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                  </div>
                  <p className="mt-3 text-xs text-slate-300">Pago recomendado: $620 hoy · Evitas intereses y mantienes tu score.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





