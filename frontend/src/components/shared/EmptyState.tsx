import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Cyberpunk EmptyState — terminal-card treatment.
 *
 * - Card variant="terminal" aesthetic (bg-background, border-border, cyber-chamfer)
 * - ">" prompt prefix on title
 * - font-label uppercase title in accent color
 * - font-body monospace description in muted
 * - Optional icon rendered in accent tint above the prompt line
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        // Terminal-card shell
        "relative flex flex-col items-center justify-center gap-5 py-14 px-8 text-center",
        "bg-background border border-border cyber-chamfer",
        className
      )}
    >
      {/* Traffic-light dot bar — terminal variant header */}
      <div className="pointer-events-none absolute left-0 top-0 flex items-center gap-1.5 px-4 py-2 w-full border-b border-border">
        <span className="h-2 w-2 rounded-full bg-destructive opacity-70" />
        <span className="h-2 w-2 rounded-full bg-[#ffaa00] opacity-70" />
        <span className="h-2 w-2 rounded-full bg-accent opacity-70" />
      </div>

      {/* Icon */}
      {icon && (
        <div className="mt-6 text-accent opacity-60 [&_svg]:stroke-[1.5] [&_svg]:h-10 [&_svg]:w-10">
          {icon}
        </div>
      )}

      {/* Title with ">" prompt */}
      <div className="space-y-2">
        <h3 className="flex items-baseline justify-center gap-2">
          <span
            aria-hidden="true"
            className="font-label text-xs text-accent select-none"
          >
            &gt;
          </span>
          <span className="font-label text-sm uppercase tracking-wider text-accent">
            {title}
          </span>
        </h3>

        {description && (
          <p className="font-body text-xs text-muted-foreground max-w-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
