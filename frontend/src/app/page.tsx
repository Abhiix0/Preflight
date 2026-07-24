import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { WhyPreflightSection } from "@/components/marketing/story/WhyPreflightSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="landing bg-[var(--landing-bg)] text-[var(--landing-fg)]">
      <main>
        <div className="hero-diagonal-bg relative flex min-h-screen flex-col lg:h-screen">
          <Navbar />
          <Hero />
        </div>
        <WhyPreflightSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
