"use client";

import Link from "next/link";
import { Terminal } from "@/components/marketing/Terminal";

/**
 * Hero — full-viewport section.
 *
 * Layout: asymmetric 60/40 split (lg+). Left column: headline + sub + CTA.
 * Right column: Terminal panel (lg:block only per Responsive Strategy).
 *
 * Vertical centering: section is min-h-screen with items-center. The navbar
 * is 56px (h-14) in normal flow above this section. py-16 gives symmetric
 * breathing room; the flex container centers the grid within the remaining
 * viewport height. No hard pt-* offset — centering is done by flexbox, not
 * padding.
 *
 * H1: Orbitron (font-heading), fluid clamp sizing:
 *     mobile/md: clamp(1rem, 4.5vw, 2.25rem)  — 16px → 36px
 *     lg+:       clamp(1.75rem, 3.0vw, 2.4rem) — 28px → 38.4px
 *     tracking-tight on mobile (reclaims ~0.125em×23chars of letter-spacing),
 *     tracking-widest at lg+ per design spec.
 *     leading-[1.05]. Line 2 carries chromatic-aberration text-shadow.
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

      {/*
       * Two-column grid at lg+: 60/40 asymmetric split.
       * No hard pt-* offset — the outer section's items-center flexbox
       * handles vertical centering within min-h-screen. py-16 gives
       * symmetric breathing room top and bottom.
       * items-center on the grid so both columns align to each other's
       * midpoint rather than their tops, matching the centered layout.
       */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:grid lg:grid-cols-[60fr_40fr] lg:items-center lg:gap-12">

        {/* ── LEFT: copy ─────────────────────────────────────────── */}
        {/*
         * max-w-2xl caps the left column at ~672px so the headline can
         * never span wider than the 60% slot.  The overall column still
         * takes 60fr of the grid — max-w-2xl just constrains the inner
         * content stack so Orbitron + tracking-widest can't overflow.
         */}
        <div className="flex max-w-2xl flex-col items-start space-y-4">

          {/* Eyebrow badge */}
          <span
            className={[
              "cyber-chamfer-sm border border-accent/40 bg-accent/10",
              "px-3 py-1 font-label text-[10px] uppercase tracking-widest text-accent",
            ].join(" ")}
          >
            Engineering Readiness Platform
          </span>

          {/*
           * H1 — one headline split across three block lines.
           * ALL typographic sizing/weight/tracking/leading is set ONCE on
           * the <h1> and inherited — never repeated per child.
           * Children only carry color (and one chromatic-aberration shadow).
           *
           * SIZING STRATEGY — one-line-per-sentence at every breakpoint.
           * Binding constraint: "BEFORE PRODUCTION DOES." = 23 chars.
           * Orbitron 900 uppercase advance ≈ 0.65em/char (verified against
           * actual font metrics; narrower than naive 0.75em estimates).
           * tracking-widest adds 0.1em/char → 0.75em effective at lg+.
           * tracking-tight on mobile: 0.65-0.025=0.625em effective.
           *
           * Column widths:
           *   320px mobile:  272px  (px-6, full-width stack)
           *   1024px lg:     ~547px (60fr of inner 960px after 48px gap)
           *   1280px lg:     ~700px (60fr of inner 1152px after gap)
           *   1440px lg:     ~672px (capped by max-w-2xl)
           *
           * Fluid sizing — scales continuously, no breakpoint jumps:
           *   Mobile → below lg:  clamp(1rem, 4.5vw, 2.25rem)
           *     320px → min 16px: 16 × 0.625 × 23 = 230px < 272px ✓
           *     768px → 34.6px → capped 36px: 36 × 0.625 × 23 = 518px < 672px ✓
           *   lg+: clamp(1.75rem, 3.0vw, 2.4rem)
           *     1024px → 30.7px: 30.7 × 0.75 × 23 = 530px < 547px ✓
           *     1280px → 38.4px → capped 38.4px: 38.4 × 0.75 × 23 = 662px < 700px ✓
           *     1440px → capped 38.4px: 662px < 672px ✓
           *
           * Mobile uses tracking-tight (-0.025em) to save letter-spacing
           * on 23 chars. lg+ restores tracking-widest per design spec.
           */}
          <h1
            className={[
              "font-heading font-black uppercase",
              "tracking-tight lg:tracking-widest",
              "leading-[1.05]",
              // Stepped-up fluid scale — one notch larger than previous pass
              // while still fitting within column bounds at every viewport.
              "text-[clamp(1rem,4.5vw,2.25rem)] lg:text-[clamp(1.75rem,3.0vw,2.4rem)]",
              "flex flex-col",
            ].join(" ")}
          >
            {/* Line 1 — foreground (#e0e0e0), no effect */}
            <span className="text-foreground">
              Scan your repo.
            </span>

            {/* Line 2 — accent (#00ff88) + chromatic-aberration text-shadow.
                This is the ONLY emphasis line. No pseudo-element duplication
                (text-shadow only, not .cyber-glitch which requires data-text). */}
            <span
              className={[
                "text-accent",
                "[text-shadow:-2px_0_#ff00ff,2px_0_#00d4ff]",
              ].join(" ")}
            >
              Find what&apos;s broken.
            </span>

            {/* Line 3 — foreground at opacity-70 so it reads as secondary
                to line 2 without dropping to muted-foreground which is too
                dim for a headline against #0a0a0f. */}
            <span className="text-foreground opacity-70">
              Before production does.
            </span>
          </h1>

          {/* Subheadline
           * One clear step down from headline. text-lg (18px) at all
           * breakpoints — JetBrains Mono, muted-foreground, relaxed
           * leading. max-w-md keeps the measure readable (65–75 chars).
           */}
          <p className="max-w-md font-body text-lg leading-relaxed text-muted-foreground">
            Connect a GitHub repository. Preflight runs a full engineering
            audit — security, dependencies, Docker, CI/CD, tests — and
            delivers a scored readiness report in minutes.
          </p>

          {/* CTA — glitch variant applied directly on the anchor so the
              cyber-glitch pseudo-elements and the visible text are on the
              same element, preventing the double-text stacking. */}
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

          {/* Inline stat strip
           * Descending hierarchy: headline > paragraph (text-lg) > stat numbers (text-2xl
           * Orbitron accent, visually subordinate by color/weight contrast)
           * > stat labels (text-[10px]).
           * Stat numbers use Orbitron font-black in accent color so they
           * read as distinct data points above their labels.
           */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
            {[
              { value: "8", label: "Check Categories" },
              { value: "< 5 min", label: "Avg Scan Time" },
              { value: "100", label: "Max Score" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="font-heading text-2xl font-black text-accent">
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
        {/*
         * lg:items-start on the grid means this column aligns to the TOP
         * of the left column naturally — no extra margin-top needed.
         * lg:justify-end pushes the terminal card to the right edge.
         */}
        <div className="hidden lg:flex lg:justify-end">
          <Terminal />
        </div>

      </div>
    </section>
  );
}
