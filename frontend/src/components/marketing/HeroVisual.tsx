// Placeholder for future Anime.js engineering visualization. Swap contents only — keep the
// outer container/props stable so Hero.tsx never needs to change.

import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";

interface HeroVisualProps {
  className?: string;
}

export default function HeroVisual({ className }: HeroVisualProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--landing-surface)]/20",
        className
      )}
    >
      {/* Outer glass panel */}
      <div className="absolute inset-0 bg-[var(--landing-surface)]/5 backdrop-blur-xl" />

      {/* Inner offset panel — layered depth effect */}
      <div className="absolute inset-4 rounded-2xl border border-[var(--landing-surface)]/10 bg-[var(--landing-surface)]/[0.03] backdrop-blur-md" />

      {/* Innermost panel */}
      <div className="absolute inset-8 rounded-xl border border-[var(--landing-surface)]/[0.08] bg-[var(--landing-surface)]/[0.02]" />

      {/* Subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--landing-surface)]/10 via-transparent to-[var(--landing-surface)]/5" />

      {/* Centered placeholder icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--landing-surface)]/15 bg-[var(--landing-surface)]/10 backdrop-blur-sm">
          <Cpu
            className="h-8 w-8 text-[var(--landing-surface)]/40"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
