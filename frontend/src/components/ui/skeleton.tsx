import { cn } from "@/lib/utils";

/**
 * Cyberpunk Skeleton.
 * - cyber-chamfer-sm (no rounded-md)
 * - bg-muted/40 shimmer instead of plain bg-muted
 * - Pulse animation disabled under prefers-reduced-motion
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Shape — sharp, chamfered
        "cyber-chamfer-sm",
        // Background — card/muted shimmer
        "bg-muted/40",
        // Shimmer animation — off under reduced-motion
        "animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
