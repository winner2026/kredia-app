import { DemoPreview } from "@/components/landing/DemoPreview";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Steps } from "@/components/landing/Steps";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-emerald-400/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[160px]" />
      </div>
      <div className="relative">
        <Header />
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <DemoPreview />
        <TestimonialsSection />
        <Steps />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
