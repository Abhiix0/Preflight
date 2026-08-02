"use client";

import Link from "next/link";
import { Terminal } from "@/components/marketing/Terminal";

/**
 * Hero — full-viewport section.
 *
 * Layout: asymmetric 60/40 split (lg+). Left column: headline + sub + CTA.
 * Right column: Terminal panel (lg:block only per Responsive Strategy).
 *
 * H1: Orbitron (font-heading), text-5xl → text-7xl → text-8xl, font-black,
 *     uppercase, tracking-widest, cyber-glitch class for chromatic aberration
 *     + occasional skew/translate flicker (Phase 1 .cyber-glitch + @keyframes glitch).
 *     data-text attribute required for the ::before/::after pseudo-element text.
 *
 * Background: bg-background (#0a0a0f) + cyber-grid overlay at low opacity.
 *             Global scanline (html::after from globals.css) already covers this
 *             — not re-added here.
 *
 * No rounded-*, no border-radius > 4px anywhere.
 */

export function Hero() {
  return (
    <section
      className={[
        "relative flex min-h-screen w-full items-center overflow-hidden",
        "bg-background cyber-grid",
        // Left-edge accent line
        "border-l-0",
      ].join(" ")}
    >
      {/* Subtle radial accent bloom — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl"
      />
      {/* Cyan bloom — top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-tertiary/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-28 sm:px-8 lg:grid lg:grid-cols-[60fr_40fr] lg:items-center lg:gap-12 lg:pt-24">

        {/* ── LEFT: copy ─────────────────────────────────────────── */}
        <div className="flex flex-col items-start">

          {/* Eyebrow badge */}
          <div className="mb-6 flex items-center gap-2">
            <span
              className={[
                "cyber-chamfer-sm border border-accent/40 bg-accent/10",
                "px-3 py-1 font-label text-[10px] uppercase tracking-widest text-accent",
              ].join(" ")}
            >
              Engineering Readiness Platform
            </span>
          </div>

          {/* H1 — three stacked lines, chromatic aberration on key phrase */}
          <h1 className="flex flex-col gap-1">
            {/* Line 1 — plain foreground */}
            <span
              className={[
                "font-heading font-black uppercase tracking-widest leading-none",
                "text-2xl sm:text-3xl lg:text-4xl",
                "text-foreground",
              ].join(" ")}
            >
              Scan your repo.
            </span>

            {/* Line 2 — accent + chromatic-aberration text-shadow (no pseudo-elements
                to avoid double-text on interactive elements). Static shadow is
                always visible; reduced-motion removes the periodic glitch transform
                via the global @media rule. */}
            <span
              className={[
                "font-heading font-black uppercase tracking-widest leading-none",
                "text-2xl sm:text-3xl lg:text-4xl",
                "text-accent",
                // Chromatic fringe — purely CSS, no content duplication
                "[text-shadow:-2px_0_#ff00ff,2px_0_#00d4ff]",
                // Under reduced-motion the global * rule kills any residual animation;
                // the static text-shadow remains (spec-compliant: static fringe is OK)
              ].join(" ")}
            >
              Find what&apos;s broken.
            </span>

            {/* Line 3 — muted */}
            <span
              className={[
                "font-heading font-black uppercase tracking-widest leading-none",
                "text-2xl sm:text-3xl lg:text-4xl",
                "text-muted-foreground",
              ].join(" ")}
            >
              Before production does.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={[
              "mt-8 max-w-lg font-body leading-relaxed text-muted-foreground",
              "text-base md:text-lg lg:text-xl",
            ].join(" ")}
          >
            Connect a GitHub repository. Preflight runs a full engineering
            audit — security, dependencies, Docker, CI/CD, tests — and
            delivers a scored readiness report in minutes.
          </p>

          {/* CTA — glitch variant applied directly on the anchor so the
              cyber-glitch pseudo-elements and the visible text are on the
              same element, preventing the double-text stacking. */}
          <div className="mt-10">
            <Link
              href="/signup"
              className={[
                "cyber-chamfer-sm",
                "inline-flex items-center justify-center gap-2",
                "min-h-11 h-11 px-8",
                "font-label text-xs uppercase tracking-wider",
                "border-2 border-accent bg-accent text-background",
                "hover:brightness-110 hover:[box-shadow:var(--box-shadow-neon)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-all duration-150 motion-reduce:transition-none",
              ].join(" ")}
            >
              Run Preflight
            </Link>
          </div>

          {/* Inline stat strip */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { value: "8", label: "Check Categories" },
              { value: "< 5 min", label: "Avg Scan Time" },
              { value: "100", label: "Max Score" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="font-heading text-xl font-black text-accent">
                  {value}
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Terminal panel (lg+ only) ───────────────────── */}
        <div className="mt-12 hidden lg:mt-0 lg:flex lg:items-center lg:justify-end">
          <Terminal />
        </div>

      </div>
    </section>
  );
}
