import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { WhyPreflightSection } from "@/components/marketing/story/WhyPreflightSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="landing bg-(--landing-page-bg) text-(--landing-fg)">
      <main>
        {/* Inset hero card — rounded corners with page background visible around it */}
        <div className="mx-4 my-4 overflow-hidden rounded-2xl shadow-2xl sm:mx-6 sm:my-6 lg:rounded-3xl">
          <div className="relative flex min-h-screen flex-col lg:h-screen">
            <Navbar />
            <Hero />
          </div>
        </div>
        <WhyPreflightSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
