import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
  {
    name: "Laura Méndez",
    role: "Fundadora de e-commerce",
    quote: (
      <>
        Por primera vez entiendo mi deuda futura. Pagué menos intereses y sigo teniendo control del límite gracias a{" "}
        <span className="text-white font-semibold">KredIA</span>.
      </>
    ),
  },
  {
    name: "Diego Ramírez",
    role: "Consultor independiente",
    quote: (
      <>
        <span className="text-white font-semibold">KredIA</span> me dijo el día exacto en que volvía a $0. Cumplí el
        plan dos semanas antes.
      </>
    ),
  },
  {
    name: "Camila Torres",
    role: "Product Manager",
    quote: (
      <>
        La proyección a 12 meses es brutal. Sé cuánto podré invertir sin miedo a quedarme sin crédito con{" "}
        <span className="text-white font-semibold">KredIA</span>.
      </>
    ),
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.26em] text-indigo-200/80">Testimonios</p>
          <h3 className="text-3xl font-semibold text-slate-50">Personas reales, claridad real.</h3>
          <p className="text-base text-slate-300">
            Historias de gente que dejó de adivinar y empezó a tomar decisiones precisas con su tarjeta.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

