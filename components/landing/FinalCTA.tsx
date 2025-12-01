import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative isolate bg-[#07152a] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="overflow-hidden rounded-3xl border border-blue-200/20 bg-gradient-to-br from-[#0c1e36] via-[#0b213d] to-[#0f2e51] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Listo para tomar control</p>
            <h3 className="text-3xl font-extrabold tracking-tight">Libertad financiera con un plan que sí puedes seguir.</h3>
            <p className="text-lg text-slate-200">
              KredIA te guía con datos, no con promesas. Menos intereses, menos ansiedad y la fecha exacta en que vuelves a $0.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(37,99,235,0.35)] transition hover:-translate-y-[1px] hover:bg-blue-500"
              >
                Comenzar ahora
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-blue-200/60"
              >
                Hablar con soporte
              </Link>
            </div>
            <p className="text-sm text-blue-100">Sin datos sensibles. Primero te mostramos valor. Soporte humano en cada paso.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
