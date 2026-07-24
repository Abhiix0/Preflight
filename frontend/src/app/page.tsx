import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { WhyPreflightSection } from "@/components/marketing/story/WhyPreflightSection";
import { PipelineSection } from "@/components/marketing/pipeline/PipelineSection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="landing bg-(--landing-page-bg) text-(--landing-fg)">
      <main>
        {/* Inset hero card — rounded corners with page background visible around it */}
        <div className="mx-2 my-2 overflow-hidden rounded-[2rem] shadow-2xl sm:mx-3 sm:my-3">
          <div className="relative flex min-h-screen flex-col lg:h-screen">
            <Navbar />
            <Hero />
          </div>
        </div>
        <WhyPreflightSection />
        <PipelineSection />
      </main>
      <Footer />
    </div>
  );
}
