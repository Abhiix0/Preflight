import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Cyberpunk badge — sharp/chamfered corners, monospace uppercase labels,
 * border color from --border, focus ring using --ring + neon-sm glow.
 *
 * Variants:
 *   default     — accent border + accent text, transparent bg
 *   secondary   — magenta border + magenta text
 *   destructive — red border + red text
 *   outline     — border-border, foreground text
 *   success     — accent (green) solid fill — convenience alias
 */
const badgeVariants = cva(
  [
    // Layout
    "inline-flex items-center gap-1 px-2 py-0.5",
    // Typography — monospace, uppercase, wider
    "font-label text-[10px] uppercase tracking-wider",
    // Shape — sharp cut, no radius
    "cyber-chamfer-sm",
    // Border
    "border",
    // Transitions
    "transition-colors duration-150 motion-reduce:transition-none",
    // Focus ring
    "focus:outline-none",
    "focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
    "focus:[box-shadow:var(--box-shadow-neon-sm)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-accent bg-transparent text-accent",
        secondary:
          "border-secondary bg-transparent text-secondary",
        destructive:
          "border-destructive bg-transparent text-destructive",
        outline:
          "border-border bg-transparent text-foreground",
        success:
          "border-accent bg-accent/10 text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
