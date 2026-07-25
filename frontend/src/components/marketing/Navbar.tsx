"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

/**
 * Fixed navbar at document level (not inside the hero card).
 *
 * At scroll-y 0: fully transparent background, white text — sits cleanly
 * over the dark left zone of the hero card.
 *
 * Once scrolled past the hero (window.innerHeight), transitions to a
 * solid bg-(--landing-bg)/90 + backdrop-blur-md + border-b bar.
 *
 * z-50 ensures it sits above the hero card's stacking context
 * (the card has overflow-hidden which would clip any absolute child —
 * this was the root cause of the navbar being invisible/clipped).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    // Set initial state (e.g. if page loads mid-scroll)
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/90 backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--landing-surface) shadow-sm">
            <Rocket
              className="h-4 w-4 text-(--landing-bg)"
              aria-hidden="true"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-(--landing-fg)">
            Preflight
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/*
           * Solid pill — bg-(--landing-surface) / text-(--landing-bg).
           * High contrast against both scroll states:
           *   • transparent navbar (over black hero zone): pale-sky pill on black ✓
           *   • solid black/90 navbar (post-scroll): pale-sky pill on near-black ✓
           * No style switching on scroll needed.
           */}
          <Link
            href="/login"
            className="rounded-full bg-(--landing-surface) px-4 py-1.5 text-sm font-semibold text-(--landing-bg) transition-opacity hover:opacity-90"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
