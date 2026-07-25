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
    <section className="relative flex min-h-screen overflow-hidden bg-(--landing-bg) lg:h-screen">
      {/*
       * Right zone — pale-sky solid block.
       *
       * Diagonal reads as "/" — pale zone is WIDER at the bottom:
       *   top-left x = 60%  (seam starts further right at the top)
       *   bottom-left x = 45% (seam sits further left at the bottom)
       *
       * This makes the pale zone narrow at the top-left and widen toward
       * the bottom-left — the "/" orientation.
       */}
      {/* Dot grid — dark zone (sits on top of bg, beneath content) */}
      <div
        aria-hidden="true"
        className="hero-grid-dark pointer-events-none absolute inset-0 z-1"
      />

      {/* Right zone — pale-sky + dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(--landing-surface) [clip-path:polygon(60%_0%,100%_0%,100%_100%,45%_100%)] lg:[clip-path:polygon(58%_0%,100%_0%,100%_100%,43%_100%)]"
      />
      <div
        aria-hidden="true"
        className="hero-grid-light pointer-events-none absolute inset-0 z-1 [clip-path:polygon(60%_0%,100%_0%,100%_100%,45%_100%)] lg:[clip-path:polygon(58%_0%,100%_0%,100%_100%,43%_100%)]"
      />

      {/* Content grid — sits above the zone layers, pt-18 clears fixed Navbar */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 pt-24 pb-12 sm:px-8 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-16 lg:pt-28">
        {/* Text column */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-(--landing-fg) sm:text-5xl lg:text-6xl">
            Know what&apos;s broken
            <br />
            <span className="text-(--landing-surface)">
              before production does.
            </span>
          </h1>

          {/* Subheading paragraph removed — tightened spacing below h1 */}

          <Button
            size="lg"
            className="mt-6 bg-(--landing-surface) px-8 text-(--landing-bg) shadow-lg shadow-(--landing-surface)/10 hover:bg-(--landing-surface)/90"
            asChild
          >
            <Link href="/signup">Run Preflight</Link>
          </Button>

          {/* Trust points */}
          <ul
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
            aria-label="Key capabilities"
          >
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-(--landing-fg-muted)"
              >
                <Check
                  className="h-4 w-4 text-(--landing-surface)"
                  aria-hidden="true"
                />
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
