"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

/**
 * Cyberpunk Separator.
 *
 * Default: bg-border (--border token), 1px solid.
 * Optional `glow` prop: accent color + neon-sm box-shadow along the axis.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    /** When true, renders the separator in accent color with a neon-sm glow. */
    glow?: boolean;
  }
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      glow = false,
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        // Orientation-based sizing
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        // Color
        glow ? "bg-accent" : "bg-border",
        // Optional neon glow — applied as a shadow on the correct axis
        glow && orientation === "horizontal" &&
          "[box-shadow:0_0_4px_var(--accent),0_0_8px_color-mix(in_srgb,var(--accent)_30%,transparent)]",
        glow && orientation === "vertical" &&
          "[box-shadow:0_0_4px_var(--accent),0_0_8px_color-mix(in_srgb,var(--accent)_30%,transparent)]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
