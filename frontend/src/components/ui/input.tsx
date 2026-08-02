import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Cyberpunk Input.
 *
 * Layout: relative wrapper div containing a ">" prefix in accent color
 * and the actual <input> element.
 *
 * Visual spec:
 *   - Input bg (--input / #12121a)
 *   - cyber-chamfer-sm shape
 *   - font-body monospace, text-accent
 *   - border border-border by default
 *   - Focus: accent border + neon-sm glow, outline removed via
 *     focus-visible:ring pattern (not outline-none alone)
 *   - prefers-reduced-motion: transition disabled
 *
 * Props: all standard <input> props forwarded unchanged — API unchanged.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {/* ">" prompt prefix */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 select-none font-label text-xs text-accent"
        >
          &gt;
        </span>

        <input
          type={type}
          className={cn(
            // Layout — leave room for the ">" prefix
            "flex h-11 w-full pl-7 pr-3 py-2",
            // Shape — chamfered, no radius
            "cyber-chamfer-sm",
            // Background & border
            "bg-input border border-border",
            // Typography — monospace, accent
            "font-body text-sm text-accent",
            // Placeholder
            "placeholder:text-muted-foreground placeholder:font-body",
            // File input styling
            "file:border-0 file:bg-transparent file:text-sm file:font-label file:text-accent",
            // Transitions
            "transition-all duration-150 motion-reduce:transition-none",
            // Focus — accessible ring, no browser default outline
            "focus-visible:outline-none",
            "focus-visible:border-accent",
            "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "focus-visible:[box-shadow:var(--box-shadow-neon-sm)]",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
