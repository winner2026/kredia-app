import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { PricingSection } from "@/components/landing/PricingSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Steps } from "@/components/landing/Steps";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#05152b] text-white">
      <Header />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <DemoPreview />
      <Steps />
      <PricingSection />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
