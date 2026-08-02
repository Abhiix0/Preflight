"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Cyberpunk label — Share Tech Mono, uppercase, wider tracking, accent color.
 * Respects peer-disabled pattern for paired input states.
 */
const labelVariants = cva(
  [
    // Typography
    "font-label text-xs uppercase tracking-wider",
    // Color — accent by default
    "text-accent",
    // Peer-disabled propagation
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  ].join(" ")
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
