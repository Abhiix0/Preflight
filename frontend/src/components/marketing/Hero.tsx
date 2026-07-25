"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlightVisual from "@/components/marketing/flight/FlightVisual";

const trustPoints = [
  "Security Audit",
  "Architecture Review",
  "DevOps Checks",
  "Production Readiness",
];

/**
 * Hero section — exactly one viewport (h-screen), overflow-hidden.
 *
 * Left column vertical spacing is intentionally compact so content fits
 * comfortably at 800px viewport height without internal scroll:
 *   pt-20 (clears fixed Navbar at 800px)
 *   gap-10 between grid columns
 *   mt-5 on CTA button (was mt-6)
 *   mt-6 on trust points (was mt-8)
 *
 * Diagonal seam: "/" orientation — pale zone wider at bottom.
 * clip-path unchanged from prior pass.
 */
export function Hero() {
  return (
    <section className="relative flex h-screen overflow-hidden bg-(--landing-bg)">
      {/* Right zone — pale-sky solid fill, "/" diagonal */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(--landing-surface) [clip-path:polygon(60%_0%,100%_0%,100%_100%,45%_100%)] lg:[clip-path:polygon(58%_0%,100%_0%,100%_100%,43%_100%)]"
      />

      {/* Content grid — z-10 sits above zone fills */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl px-6 pt-20 pb-8 sm:px-8 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-10 lg:pt-24">
        {/* ── Left column: copy ── */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-(--landing-fg) sm:text-5xl lg:text-6xl">
            Know what&apos;s broken
            <br />
            <span className="text-(--landing-surface)">
              before production does.
            </span>
          </h1>

          <Button
            size="lg"
            className="mt-5 bg-(--landing-surface) px-8 text-(--landing-bg) shadow-lg shadow-(--landing-surface)/10 hover:bg-(--landing-surface)/90"
            asChild
          >
            <Link href="/signup">Run Preflight</Link>
          </Button>

          <ul
            className="mt-6 flex flex-wrap gap-x-6 gap-y-2"
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

        {/* ── Right column: flight animation ── */}
        <div className="hidden h-full w-full lg:flex lg:items-center lg:justify-center">
          <FlightVisual />
        </div>
      </div>
    </section>
  );
}
