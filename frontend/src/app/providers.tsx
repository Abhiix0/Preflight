"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

/**
 * Providers — ThemeProvider / next-themes removed.
 * The design system is dark-mode only; the `dark` class is applied directly
 * on <html> in the root layout, so no runtime theme switching is needed.
 *
 * Toaster is configured to match the cyberpunk token palette:
 *   - dark card background, accent border, monospace font, chamfer-sm shape
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: false,
          classNames: {
            toast: [
              // Card shell
              "bg-card border border-border cyber-chamfer-sm",
              // Typography
              "font-body text-sm text-foreground",
              // Neon glow
              "[box-shadow:var(--box-shadow-neon-sm)]",
            ].join(" "),
            title:
              "font-label text-xs uppercase tracking-wider text-accent",
            description:
              "font-body text-xs text-muted-foreground",
            actionButton:
              "font-label text-xs uppercase tracking-wider bg-accent text-background cyber-chamfer-sm px-3 py-1",
            cancelButton:
              "font-label text-xs uppercase tracking-wider border border-border bg-transparent text-muted-foreground cyber-chamfer-sm px-3 py-1",
            closeButton:
              "border border-border bg-card text-muted-foreground hover:text-accent hover:border-accent cyber-chamfer-sm",
            success:
              "border-accent [box-shadow:var(--box-shadow-neon-sm)]",
            error:
              "border-destructive [box-shadow:0_0_3px_var(--destructive),0_0_6px_color-mix(in_srgb,var(--destructive)_30%,transparent)]",
            warning:
              "border-[#ffaa00]",
            info:
              "border-accent-tertiary",
          },
        }}
      />
    </QueryClientProvider>
  );
}
