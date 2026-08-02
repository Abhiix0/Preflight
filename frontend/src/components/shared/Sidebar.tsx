"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Settings,
  Rocket,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Repositories", href: "/repositories", icon: FolderGit2 },
  { title: "Settings", href: "/settings", icon: Settings },
];

/**
 * Cyberpunk Sidebar.
 *
 * Active state  — accent left-border (2px solid) + subtle bg-accent/5 tint
 *               + neon-sm text glow. No filled pill.
 * Inactive hover — accent/5 bg, text-accent, icon drop-shadow glow.
 * Icons         — stroke-width 1.5 per Iconography spec.
 * Labels        — font-label, uppercase, tracking-wider.
 */
export function Sidebar() {
  const pathname = usePathname();
  // Two separate selectors returning primitives/stable refs — avoids the
  // "getSnapshot result should be cached" warning that fires when an inline
  // selector returns a new object reference on every render.
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card text-card-foreground",
        "transition-[width] duration-200 motion-reduce:transition-none",
        sidebarCollapsed ? "w-14" : "w-60"
      )}
    >
      {/* ── Brand bar ──────────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3">
        {/* Logo mark — chamfered square */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            "h-8 w-8 cyber-chamfer-sm",
            "bg-accent text-background"
          )}
        >
          <Rocket className="h-4 w-4 stroke-[1.5]" />
        </div>

        {!sidebarCollapsed && (
          <span className="font-label text-xs uppercase tracking-widest text-accent truncate">
            Preflight
          </span>
        )}
      </div>

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav
        className="flex-1 space-y-0.5 px-2 py-4"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.title : undefined}
              className={cn(
                // Base
                "group relative flex items-center gap-3 px-3 py-2.5",
                "font-label text-[10px] uppercase tracking-wider",
                "transition-all duration-150 motion-reduce:transition-none",
                // Focus ring
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                // Inactive
                "text-muted-foreground",
                "hover:bg-accent/5 hover:text-accent",
                // Active — left-border accent, no pill fill
                isActive &&
                  [
                    "border-l-2 border-accent pl-2.5", // compensate 2px border
                    "bg-accent/5 text-accent",
                    "[text-shadow:0_0_6px_color-mix(in_srgb,var(--accent)_50%,transparent)]",
                  ].join(" ")
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 stroke-[1.5]",
                  "transition-all duration-150 motion-reduce:transition-none",
                  // Hover / active icon glow
                  isActive
                    ? "filter-[drop-shadow(0_0_4px_var(--accent))]"
                    : "group-hover:filter-[drop-shadow(0_0_4px_var(--accent))]"
                )}
              />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Collapse toggle ────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border p-2">
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2",
            "font-label text-[10px] uppercase tracking-wider text-muted-foreground",
            "hover:bg-accent/5 hover:text-accent",
            "transition-all duration-150 motion-reduce:transition-none",
            "focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!sidebarCollapsed && <span>Collapse</span>}
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0 stroke-[1.5]" />
          ) : (
            <PanelLeftClose className="h-4 w-4 shrink-0 stroke-[1.5]" />
          )}
        </button>
      </div>
    </aside>
  );
}
