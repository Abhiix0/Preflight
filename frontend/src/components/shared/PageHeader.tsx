import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Cyberpunk PageHeader.
 *
 * - font-label uppercase title in accent color
 * - font-body monospace description in muted
 * - 1px border-border bottom separator
 * - Right-aligned action slot preserved
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="space-y-0.5">
        {/* ">" prompt prefix + uppercase label */}
        <h1 className="flex items-baseline gap-2">
          <span
            aria-hidden="true"
            className="font-label text-xs text-accent select-none"
          >
            &gt;
          </span>
          <span className="font-label text-sm uppercase tracking-wider text-accent">
            {title}
          </span>
        </h1>

        {description && (
          <p className="font-body text-xs text-muted-foreground pl-4">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
