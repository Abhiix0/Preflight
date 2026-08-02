import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Cyberpunk Card system.
 *
 * Variants:
 *   default      — card bg (#12121a), 1px border-border, cyber-chamfer.
 *                  Optional hoverEffect prop: translateY(-1px), border→accent, neon glow.
 *   terminal     — background bg (#0a0a0f), traffic-light-dot header bar, cyber-chamfer.
 *   holographic  — muted/30% bg, accent border/30%, neon glow always-on,
 *                  backdrop-blur-sm, 4 corner-accent marks.
 */

/* ─── Card root variants ──────────────────────────────────────── */
const cardVariants = cva(
  [
    "relative flex flex-col text-card-foreground",
    // Shape — chamfer (no border-radius)
    "cyber-chamfer",
    // Transition
    "transition-all duration-200 motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-card border border-border",
        ].join(" "),
        terminal: [
          "bg-background border border-border",
        ].join(" "),
        holographic: [
          "bg-muted/30 border border-accent/30",
          "backdrop-blur-sm",
          "[box-shadow:var(--box-shadow-neon-sm)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ─── Corner-accent marks for holographic variant ──────────────── */
const CornerMarks = () => (
  <>
    {/* Top-left */}
    <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-accent" />
    {/* Top-right */}
    <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-accent" />
    {/* Bottom-left */}
    <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-accent" />
    {/* Bottom-right */}
    <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-accent" />
  </>
);

/* ─── Traffic-light dots for terminal variant ───────────────────── */
const TerminalDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border">
    <span className="h-2.5 w-2.5 rounded-full bg-destructive opacity-80" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#ffaa00] opacity-80" />
    <span className="h-2.5 w-2.5 rounded-full bg-accent opacity-80" />
  </div>
);

/* ─── Card root ─────────────────────────────────────────────────── */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * When true on the "default" variant, hover applies:
   *   translateY(-1px), border→accent, neon-sm glow.
   * Has no effect on holographic (glow is always-on).
   */
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverEffect = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant }),
        hoverEffect &&
          variant !== "holographic" && [
            "cursor-pointer",
            "hover:-translate-y-px hover:border-accent",
            "hover:[box-shadow:var(--box-shadow-neon-sm)]",
            "motion-reduce:hover:translate-y-0",
          ].join(" "),
        className
      )}
      {...props}
    >
      {variant === "terminal" && <TerminalDots />}
      {variant === "holographic" && <CornerMarks />}
      {children}
    </div>
  )
);
Card.displayName = "Card";

/* ─── CardHeader ────────────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ─── CardTitle ─────────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-label text-sm uppercase tracking-wider text-accent leading-none",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ─── CardDescription ───────────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-body text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ─── CardContent ───────────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* ─── CardFooter ────────────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
