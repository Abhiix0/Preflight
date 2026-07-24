"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroVisual from "@/components/marketing/HeroVisual";

const trustPoints = [
  "Security Audit",
  "Architecture Review",
  "DevOps Checks",
  "Production Readiness",
];

export function Hero() {
  return (
    <section className="relative flex flex-1 overflow-hidden bg-(--landing-bg)">
      {/*
       * Right zone — pale-sky solid block.
       * Desktop: diagonal clip-path creates the angled edge between zones (~55/45).
       * Mobile: clip-path becomes a straight horizontal split so the pale-sky zone
       *         sits below the text column with no diagonal cutting through copy.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(--landing-surface) [clip-path:polygon(60%_0%,100%_0%,100%_100%,52%_100%)] lg:[clip-path:polygon(58%_0%,100%_0%,100%_100%,50%_100%)]"
      />

      {/* Content grid — sits above the zone layers */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-12 pt-18 sm:px-8 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-16 lg:pt-18">
        {/* Text column */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-(--landing-fg) sm:text-5xl lg:text-6xl">
            Know what&apos;s broken
            <br />
            <span className="text-(--landing-surface)">
              before production does.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-(--landing-fg-muted)">
            Preflight gives student developers the automated analysis and
            engineering-grade feedback they need to ship software with
            confidence&nbsp;&mdash; no guesswork, no surprises.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-(--landing-surface) px-8 text-(--landing-bg) shadow-lg shadow-(--landing-surface)/10 hover:bg-(--landing-surface)/90"
            asChild
          >
            <Link href="/signup">Run Preflight</Link>
          </Button>

          {/* Trust points */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3" aria-label="Key capabilities">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-(--landing-fg-muted)"
              >
                <Check className="h-4 w-4 text-(--landing-surface)" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual column */}
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
