import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
  {
    name: "Laura Méndez",
    role: "Fundadora e-commerce",
    quote: (
      <>
        "Por fin sé el día exacto en que vuelvo a $0. Pagué menos intereses porque KredIA me avisó antes de pasarme."
      </>
    ),
  },
  {
    name: "Diego Ramírez",
    role: "Consultor independiente",
    quote: (
      <>
        "El panel me mostró en segundos cuánto podía gastar sin tocar el pago de deuda. La ansiedad bajó al piso."
      </>
    ),
  },
  {
    name: "Camila Torres",
    role: "Product Manager",
    quote: (
      <>
        "Los recordatorios semanales y la fecha exacta de libertad cambiaron mi forma de usar la tarjeta. Todo claro, sin tecnicismos."
      </>
    ),
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.26em] text-indigo-200/80">Testimonios</p>
          <h3 className="text-3xl font-extrabold tracking-tight text-slate-50">Personas reales, decisiones con datos.</h3>
          <p className="text-base text-slate-300">
            Resultados concretos de gente que dejó de adivinar y empezó a decidir con un plan claro.
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
