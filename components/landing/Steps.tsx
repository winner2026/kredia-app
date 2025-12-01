const steps = [
  {
    title: "Conecta y ordena",
    description: "Registra ingresos y gastos en minutos. Identificamos fijos, variables y deudas automáticamente.",
  },
  {
    title: "Recibe el plan inteligente",
    description: "Montos seguros para vivir, pagar deuda y ahorrar. Con fecha exacta para volver a $0.",
  },
  {
    title: "Ejecuta con alertas",
    description: "Avisos y recomendaciones cuando cambian tus números para que nunca vuelvas al mínimo.",
  },
];

export function Steps() {
  return (
    <section id="como-funciona" className="relative isolate bg-[#0a1b2f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Cómo funciona</p>
          <h3 className="text-3xl font-extrabold tracking-tight">Tres pasos claros, sin fricción.</h3>
          <p className="max-w-2xl text-lg text-slate-200">Sin tecnicismos ni hojas de cálculo. Solo instrucciones accionables mes a mes.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-transparent to-white/5" />
              <div className="relative space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-200/20 text-base font-semibold text-blue-100">
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold">{step.title}</h4>
                <p className="text-sm leading-6 text-slate-200">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
