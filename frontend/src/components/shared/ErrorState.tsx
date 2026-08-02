import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Cyberpunk ErrorState — terminal-card treatment.
 *
 * - Same terminal-card shell as EmptyState (bg-background, border, cyber-chamfer)
 * - Chamfered destructive icon block instead of rounded-full
 * - ">" prompt prefix on title
 * - font-label uppercase title in destructive color
 * - font-body monospace description in muted
 * - Retry button uses outline variant (inherits cyberpunk styles)
 */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Retry",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        // Terminal-card shell
        "relative flex flex-col items-center justify-center gap-5 py-14 px-8 text-center",
        "bg-background border border-destructive/40 cyber-chamfer",
        className
      )}
    >
      {/* Traffic-light dot bar */}
      <div className="pointer-events-none absolute left-0 top-0 flex items-center gap-1.5 px-4 py-2 w-full border-b border-destructive/40">
        <span className="h-2 w-2 rounded-full bg-destructive opacity-90" />
        <span className="h-2 w-2 rounded-full bg-[#ffaa00] opacity-50" />
        <span className="h-2 w-2 rounded-full bg-accent opacity-30" />
      </div>

      {/* Chamfered icon block */}
      <div
        className={cn(
          "mt-6 flex items-center justify-center",
          "h-14 w-14 cyber-chamfer-sm",
          "bg-destructive/10 border border-destructive/40"
        )}
      >
        <AlertTriangle className="h-6 w-6 stroke-[1.5] text-destructive" />
      </div>

      {/* Title with ">" prompt */}
      <div className="space-y-2">
        <h3 className="flex items-baseline justify-center gap-2">
          <span
            aria-hidden="true"
            className="font-label text-xs text-destructive select-none"
          >
            &gt;
          </span>
          <span className="font-label text-sm uppercase tracking-wider text-destructive">
            {title}
          </span>
        </h3>

        <p className="font-body text-xs text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      </div>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
