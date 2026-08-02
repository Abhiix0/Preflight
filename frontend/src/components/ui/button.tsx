import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Cyberpunk button variants.
 *
 * All buttons share:
 *   - font-label (Share Tech Mono), uppercase, tracking-wider
 *   - min-h-[44px] touch target
 *   - sharp / chamfered corners (cyber-chamfer-sm)
 *   - accessible focus ring: ring-2 ring-accent ring-offset-2 ring-offset-background + neon-sm glow
 *   - prefers-reduced-motion: transitions disabled, glitch animation disabled
 *
 * Variants:
 *   default    — transparent bg, 2px accent border, accent text; hover fills accent + neon-sm glow
 *   secondary  — magenta (--secondary) border + text; hover fills secondary + neon-secondary glow
 *   outline    — 1px border-border text-foreground; hover accent border + neon-sm glow
 *   ghost      — no border, transparent; hover accent/10 bg
 *   glitch     — solid accent bg (CTA), cyber-glitch class, brightness(1.1) on hover
 *   destructive — red destructive variant (kept for downstream usage)
 *   link       — underline style (kept for downstream usage)
 */
const buttonVariants = cva(
  [
    // Base — layout, typography, interaction
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "min-h-[44px] px-4 py-2",
    // Font system
    "font-label text-xs uppercase tracking-wider",
    // Chamfer
    "cyber-chamfer-sm",
    // Transition (disabled under reduced-motion)
    "transition-all duration-150 motion-reduce:transition-none",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-40",
    // SVG children
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // Focus ring — accessible, consistent
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "focus-visible:[box-shadow:0_0_3px_var(--accent),0_0_6px_color-mix(in_srgb,var(--accent)_30%,transparent)]",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Transparent bg, 2px accent border, accent text. Hover: fills accent bg + neon-sm glow */
        default: [
          "border-2 border-accent bg-transparent text-accent",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:[box-shadow:var(--box-shadow-neon-sm)]",
        ].join(" "),

        /** Magenta border + text. Hover: fills secondary bg + neon-secondary glow */
        secondary: [
          "border-2 border-secondary bg-transparent text-secondary",
          "hover:bg-secondary hover:text-secondary-foreground",
          "hover:[box-shadow:var(--box-shadow-neon-secondary)]",
        ].join(" "),

        /** 1px thin border, foreground text. Hover: accent border + neon-sm glow */
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:border-accent hover:text-accent",
          "hover:[box-shadow:var(--box-shadow-neon-sm)]",
        ].join(" "),

        /** No border, transparent. Hover: accent/10 tint */
        ghost: [
          "border-0 bg-transparent text-accent",
          "hover:bg-accent/10 hover:text-accent",
        ].join(" "),

        /**
         * CTA glitch — solid accent bg, chromatic aberration via cyber-glitch class.
         * Hover: brightness(1.1) + neon glow.
         * Under reduced-motion the glitch pseudo-elements still show static
         * chromatic-aberration shadows (no animation).
         *
         * For the full split-text effect, pass data-text matching the button label:
         *   <Button variant="glitch" data-text="LAUNCH">LAUNCH</Button>
         * Without data-text the shadow fringe still renders (graceful degradation).
         */
        glitch: [
          "cyber-glitch border-2 border-accent bg-accent text-accent-foreground",
          "hover:brightness-110 hover:[box-shadow:var(--box-shadow-neon)]",
          "motion-reduce:animate-none",
        ].join(" "),

        /** Kept for downstream — destructive red */
        destructive: [
          "border-2 border-destructive bg-transparent text-destructive",
          "hover:bg-destructive hover:text-destructive-foreground",
          "hover:[box-shadow:0_0_5px_var(--destructive),0_0_10px_color-mix(in_srgb,var(--destructive)_40%,transparent)]",
        ].join(" "),

        /** Kept for downstream — link style */
        link: "border-0 bg-transparent text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2", // 44px
        sm: "h-9 px-3 text-[10px]",
        lg: "h-12 px-8 text-sm",
        icon: "h-11 w-11 p-0", // 44×44 touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
