import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Cyberpunk LoadingSkeletons.
 *
 * TableSkeleton — header row gets accent/10 tint to signal column headers;
 *                 body rows use standard muted/40 skeleton.
 * CardSkeleton  — wrapped in a chamfered card border (bg-card, border-border,
 *                 cyber-chamfer-sm) so the skeleton has the same shape as the
 *                 card it replaces.
 * DashboardSkeleton — grid of CardSkeletons + one wide CardSkeleton below.
 */

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Header row — accent tint */}
      <div className="flex gap-4 border-b border-border pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 flex-1 bg-accent/10"
          />
        ))}
      </div>

      {/* Body rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-0.5">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Chamfered card shell — matches Card default variant shape
        "bg-card border border-border cyber-chamfer-sm",
        "space-y-3 p-6",
        className
      )}
    >
      {/* Title line — accent tint */}
      <Skeleton className="h-4 w-3/4 bg-accent/10" />
      {/* Subtitle */}
      <Skeleton className="h-3 w-1/2" />
      {/* Body lines */}
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <CardSkeleton />
    </div>
  );
}
