"use client";

import { useScrollTimeline, useAnimeScope, EASE_ENTRANCE, DURATION_BASE } from "@/lib/animation";
import { STORY_STAGES } from "./stages";
import { StageVisual } from "./StageVisual";
import { buildStoryTimeline } from "./story.animations";
import { PaperAirplane } from "./stage-art/PaperAirplane";
import { WireframeAircraft } from "./stage-art/WireframeAircraft";
import { Jet } from "./stage-art/Jet";
import { Rocket } from "./stage-art/Rocket";
import { animate, onScroll, type Scope } from "animejs";

const StageArtMap = {
  idea: PaperAirplane,
  development: WireframeAircraft,
  production: Jet,
  deployment: Rocket,
};

function MobileStage({ stage }: { stage: typeof STORY_STAGES[0] }) {
  const ArtComponent = StageArtMap[stage.id as keyof typeof StageArtMap];
  
  const setupMobileEntrance = (self?: Scope) => {
    animate('.mobile-stage-content', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: DURATION_BASE,
      ease: EASE_ENTRANCE,
      autoplay: onScroll({
        target: self?.root,
        container: undefined,
        sync: false, // Plays once when it enters the viewport
      }),
    });
  };
  
  const root = useAnimeScope<HTMLDivElement>(setupMobileEntrance);

  return (
    <div ref={root} className="flex flex-col items-center text-center gap-6 py-12">
      <div className="mobile-stage-content w-48 h-48 bg-[var(--landing-surface)]/5 rounded-3xl border border-[var(--landing-surface)]/10 p-8">
        <ArtComponent className="w-full h-full text-[var(--landing-surface)]" aria-hidden="true" />
      </div>
      <div className="mobile-stage-content">
        <span className="text-lg font-bold text-[var(--landing-fg)]">
          {stage.label}
        </span>
        <h3 className="text-2xl font-bold text-[var(--landing-fg)] mt-1">
          {stage.title}
        </h3>
        <p className="mt-3 text-base text-[var(--landing-fg-muted)] leading-relaxed max-w-sm">
          {stage.description}
        </p>
      </div>
    </div>
  );
}

export function WhyPreflightSection() {
  const stickyRoot = useScrollTimeline<HTMLDivElement>(buildStoryTimeline, {});

  return (
    <section className="py-24 sm:py-32 bg-[var(--landing-bg)]" aria-labelledby="why-preflight-heading">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 id="why-preflight-heading" className="text-center text-3xl font-bold tracking-tight text-[var(--landing-fg)] sm:text-4xl lg:mb-32 mb-16">
          Why Preflight?
        </h2>

        {/* Mobile / Reduced Motion View: Stacked, Reveal on Scroll */}
        <div className="flex flex-col gap-8 lg:hidden motion-reduce:lg:flex motion-reduce:gap-16">
          {STORY_STAGES.map((stage) => (
            <MobileStage key={stage.id} stage={stage} />
          ))}
        </div>

        {/* Desktop View: Sticky Scroll Scrub (hidden on mobile and reduced-motion) */}
        <div className="hidden lg:block motion-reduce:lg:hidden h-[350vh] relative">
          <div ref={stickyRoot} className="sticky top-0 h-screen flex items-center">
            <div className="w-full grid grid-cols-[55fr_45fr] gap-16 items-center">
              {/* Left Column: Visuals */}
              <div className="w-full">
                <StageVisual />
              </div>

              {/* Right Column: Text */}
              <div className="relative w-full h-[300px]">
                {STORY_STAGES.map((stage, i) => (
                  <div
                    key={stage.id}
                    data-stage={i}
                    className="stage-text absolute inset-0 flex flex-col justify-center"
                  >
                    <span className="text-xl font-bold text-[var(--landing-fg)]">
                      {stage.label}
                    </span>
                    <h3 className="text-3xl font-bold text-[var(--landing-fg)] mt-2">
                      {stage.title}
                    </h3>
                    <p className="mt-4 text-lg text-[var(--landing-fg-muted)] leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
