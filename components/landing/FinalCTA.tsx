import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section id="cta" className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="glass-panel relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-400/15 via-indigo-500/10 to-slate-900/60 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(45,212,191,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.2),transparent_35%)]" />
          <div className="relative grid gap-8 md:grid-cols-[1.2fr,0.8fr] md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.26em] text-emerald-100/80">
                CTA Final
              </p>
              <h3 className="text-3xl font-semibold text-slate-50">
                ¿Listo para recuperar el control de tu tarjeta?
              </h3>
              <p className="text-base text-slate-300">
                Prueba la claridad de <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> antes de compartir cualquier dato.
              </p>
              <Link href="/dashboard" className="btn-primary">
                Comenzar ahora
              </Link>
              <p className="text-sm text-slate-300">No pedimos datos hasta que veas valor.</p>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="relative space-y-3">
                <p className="text-sm text-slate-200">
                  <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> Score
                </p>
                <div className="h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200" />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>Hoy: 71</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-100">Objetivo: 90</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Ruta a $0</span>
                    <span className="text-emerald-200">05 / Ago</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-slate-50">Sigue el plan · Evita intereses · Mantén tu línea viva.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




