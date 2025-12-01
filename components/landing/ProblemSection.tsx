const pains = [
  "No sabes si el dinero alcanza hasta fin de mes.",
  "Cuánto entra, cuánto sale y qué se va a deuda no está claro.",
  "Pagas el mínimo y la deuda no baja en meses.",
  "Excel consume tiempo y siempre termina desactualizado.",
];

export function ProblemSection() {
  return (
    <section className="relative isolate bg-[#0a1b2f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Problema</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Cuando no ves la película completa, decides a ciegas.</h2>
          <p className="mt-3 max-w-3xl text-lg text-slate-200">
            Personas en México, Perú, Uruguay o USA comparten el mismo reto: sin un plan preciso, las deudas crecen y el
            estrés sube. KredIA ordena los números y devuelve control con datos.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {pains.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/5 bg-[#0f2a45] px-4 py-3 text-base text-slate-100 shadow-inner shadow-black/10"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
