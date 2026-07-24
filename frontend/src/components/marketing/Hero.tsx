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
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16 lg:py-32">
        {/* Text column */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--landing-fg)] sm:text-5xl lg:text-6xl">
            Know what&apos;s broken
            <br />
            <span className="text-[var(--landing-surface)]">
              before production does.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--landing-fg-muted)]">
            Preflight gives student developers the automated analysis and
            engineering-grade feedback they need to ship software with
            confidence&nbsp;&mdash; no guesswork, no surprises.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-[var(--landing-surface)] px-8 text-[var(--landing-bg)] shadow-lg shadow-[var(--landing-surface)]/10 hover:bg-[var(--landing-surface)]/90"
            asChild
          >
            <Link href="/signup">Run Your First Preflight</Link>
          </Button>

          {/* Trust points */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3" aria-label="Key capabilities">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-[var(--landing-fg-muted)]"
              >
                <Check className="h-4 w-4 text-[var(--landing-surface)]" aria-hidden="true" />
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
