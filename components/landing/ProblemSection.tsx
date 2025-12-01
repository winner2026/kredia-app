const pains = [
  "Ansiedad por no saber si alcanzará el dinero a fin de mes.",
  "No hay claridad: cuánto entra, cuánto sale y qué se va a deudas.",
  "Pagar mínimo y sentir que la deuda nunca baja.",
  "Planear con Excel es lento, cansado y se queda desactualizado.",
];

export function ProblemSection() {
  return (
    <section className="relative isolate bg-[#0a1b2f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Problema</p>
          <h2 className="mt-3 text-3xl font-semibold">Cuando no hay plan, llega la deuda y la preocupación.</h2>
          <p className="mt-2 max-w-3xl text-lg text-slate-200">
            Adultos en México, Perú, Uruguay o USA comparten el mismo reto: la falta de control genera estrés y decisiones
            a ciegas. Kredia Planner nace para devolver la calma.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pains.map((item) => (
              <div key={item} className="rounded-2xl border border-white/5 bg-[#0f2a45] px-4 py-3 text-base text-slate-100 shadow-inner shadow-black/10">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
