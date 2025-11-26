const steps = [
  {
    title: "Agregas tu tarjeta o compras.",
    description: "Conecta de forma segura o carga tus movimientos. Sin fricción, sin riesgos.",
  },
  {
    title: (
      <>
        <span className="text-[#F8B738]">K</span><span className="text-[#27C1D0]">red</span><span className="text-[#E13787]">IA</span> hace el cálculo.
      </>
    ),
    description: "Consolidamos cuotas, intereses y fechas para mostrarte el camino más corto.",
  },
  {
    title: "Ves tu plan de libertad.",
    description: "Pago recomendado, fecha exacta a $0 y alertas para mantenerte en verde.",
  },
];

export function Steps() {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="mb-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.26em] text-indigo-200/80">Cómo funciona</p>
            <h3 className="text-3xl font-semibold text-slate-50">Tres pasos y listo.</h3>
            <p className="text-base text-slate-300">
              Entra, conecta y ve tu plan. Nada más. El control vuelve a ser tuyo desde el primer minuto.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-400/5 opacity-80" />
                <div className="relative z-10 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-slate-50">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-slate-50">{step.title}</h4>
                  <p className="text-sm leading-6 text-slate-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




