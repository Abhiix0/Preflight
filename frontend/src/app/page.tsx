import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { WhyPreflightSection } from "@/components/marketing/story/WhyPreflightSection";
import { PipelineSection } from "@/components/marketing/pipeline/PipelineSection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="landing bg-(--landing-page-bg) text-(--landing-fg)">
      {/* Navbar is fixed at document level — sits above the inset hero card */}
      <Navbar />

      <main>
        {/* Inset hero card — Navbar is no longer a child, so overflow-hidden
            doesn't clip the fixed navbar */}
        <div className="mx-2 my-2 overflow-hidden rounded-[2rem] shadow-2xl sm:mx-3 sm:my-3">
          <Hero />
        </div>
        <WhyPreflightSection />
        <PipelineSection />
      </main>
      <Footer />
    </div>
  );
}
