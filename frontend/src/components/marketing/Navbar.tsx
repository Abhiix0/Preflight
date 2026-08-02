"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Cyberpunk Navbar.
 *
 * - Logo (chamfered accent square + Orbitron wordmark) on the left
 * - Single "Sign In" outline CTA on the right
 * - Transparent at top; gains border-b border-border + bg-background/90
 *   backdrop-blur once the user scrolls past 60px
 * - No rounded-* anywhere — chamfered corners only
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 w-full",
        "transition-all duration-300 motion-reduce:transition-none",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className={[
            "flex items-center gap-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          ].join(" ")}
        >
          {/* Chamfered square logo mark */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center cyber-chamfer-sm bg-accent">
            <Rocket className="h-4 w-4 stroke-[1.5] text-background" aria-hidden="true" />
          </div>
          <span className="font-heading text-sm font-black uppercase tracking-widest text-foreground">
            Preflight
          </span>
        </Link>

        {/* ── Sign In CTA ── */}
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </nav>
  );
}
