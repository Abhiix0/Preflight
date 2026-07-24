"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="absolute inset-x-0 top-0 z-10 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--landing-surface)] shadow-sm">
            <Rocket className="h-4 w-4 text-[var(--landing-bg)]" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--landing-fg)]">
            Preflight
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--landing-fg-muted)] hover:text-[var(--landing-fg)] hover:bg-white/5"
            asChild
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
