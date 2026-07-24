"use client";

import { STORY_STAGES } from "./stages";
import HeroVisual from "@/components/marketing/HeroVisual";

export function WhyPreflightSection() {
  return (
    <section
      className="bg-(--landing-bg) py-16 sm:py-20"
      aria-labelledby="why-preflight-heading"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2
          id="why-preflight-heading"
          className="mb-10 text-center text-3xl font-bold tracking-tight text-(--landing-fg) sm:text-4xl lg:mb-16"
        >
          Why Preflight?
        </h2>

        <div className="grid gap-12 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-16">
          {/* Visual column — shared glass panel placeholder */}
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroVisual />
          </div>

          {/* Content column — all 4 stages, fully visible on load */}
          <ol className="flex flex-col gap-10" aria-label="Preflight stages">
            {STORY_STAGES.map((stage) => (
              <li key={stage.id} className="flex flex-col gap-1">
                <span className="text-sm font-semibold uppercase tracking-widest text-(--landing-surface)">
                  {stage.label}
                </span>
                <h3 className="text-xl font-bold text-(--landing-fg)">
                  {stage.title}
                </h3>
                <p className="text-base leading-relaxed text-(--landing-fg-muted)">
                  {stage.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
