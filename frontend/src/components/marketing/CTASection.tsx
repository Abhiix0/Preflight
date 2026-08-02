"use client";

import Link from "next/link";

/**
 * CTASection — closing section mirroring the hero CTA.
 *
 * H2: font-heading, text-4xl → text-5xl (md), uppercase, tracking-wide.
 * CTA: Button "glitch" variant from Phase 2.
 * Background: card bg with accent border top + subtle neon glow.
 */
export function CTASection() {
  return (
    <section className="relative bg-card">
      {/* Accent top border with neon glow */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-accent [box-shadow:0_0_8px_var(--accent),0_0_16px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-28 text-center sm:px-8">
        {/* Eyebrow */}
        <span className="font-label text-[10px] uppercase tracking-widest text-accent">
          {"//"} Ready to scan?
        </span>

        {/* H2 */}
        <h2
          className={[
            "font-heading font-black uppercase tracking-wide text-foreground",
            "text-4xl md:text-5xl",
            "leading-tight",
          ].join(" ")}
        >
          Your next deployment
          <br />
          <span className="text-accent">deserves a passing score.</span>
        </h2>

        {/* Body */}
        <p className="max-w-md font-body text-sm text-muted-foreground md:text-base leading-relaxed">
          Connect your repository in seconds. Get a full engineering audit, a
          scored report, and a prioritised fix list — before you push to
          production.
        </p>

        {/* Glitch CTA — applied directly on the anchor, same pattern as Hero */}
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
          Run Preflight Free
        </Link>

        {/* Reassurance micro-copy */}
        <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
          No credit card · Public repos only in beta
        </p>
      </div>

      {/* Accent bottom border */}
      <div aria-hidden="true" className="h-px w-full bg-accent/20" />
    </section>
  );
}
