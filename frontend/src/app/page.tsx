"use client";

import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";

/**
 * Landing page — cyberpunk marketing site.
 *
 * "use client" is required here because every direct child (Navbar, Hero,
 * Features, CTASection) uses Radix primitives (Button, Card, Slot) which
 * call createContext at module-evaluation time. Turbopack dev traces the
 * full import graph eagerly and throws if any createContext call reaches
 * the RSC bundle. Marking this page as a client component collapses the
 * entire marketing tree under a single boundary, eliminating the error
 * without affecting runtime behaviour — the page has no server-only data
 * needs and is fully statically renderable either way.
 *
 * Sections (top → bottom): Navbar, Hero (contains Terminal), Features,
 * CTASection, Footer.
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
