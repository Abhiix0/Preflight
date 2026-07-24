import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { AboutSection } from "@/components/marketing/AboutSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="landing bg-[var(--landing-bg)] text-[var(--landing-fg)]">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
