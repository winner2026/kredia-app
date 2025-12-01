import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative isolate bg-[#07152a] text-white">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
        <div className="overflow-hidden rounded-3xl border border-amber-200/20 bg-gradient-to-br from-[#0c1e36] via-[#0b213d] to-[#0f2e51] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">CTA Final</p>
            <h3 className="text-3xl font-semibold">Libertad financiera con un plan que sí puedes seguir.</h3>
            <p className="text-lg text-slate-200">
              Kredia Planner te acompaña para que dejes de preocuparte por el dinero y empieces a usarlo con intención.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-amber-300 px-6 py-3 text-sm font-semibold text-[#0c1e36] shadow-[0_15px_45px_rgba(218,180,106,0.35)] transition hover:-translate-y-[1px] hover:bg-amber-200"
              >
                Comienza gratis
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-200/60"
              >
                Activar Premium
              </Link>
            </div>
            <p className="text-sm text-amber-100">Un solo pago · Sin letra chica · Diseñado para personas reales</p>
          </div>
        </div>
      </div>
    </section>
  );
}
