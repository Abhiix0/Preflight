"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Settings,
  Rocket,
  BarChart3,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Repositories",
    href: "/repositories",
    icon: FolderGit2,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Findings",
    href: "/findings",
    icon: AlertCircle,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore((state) => ({
    sidebarCollapsed: state.sidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
  }));

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card text-card-foreground transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Rocket className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-bold tracking-tight">Preflight</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={item.title}
            >
              <Icon className="h-4 w-4" />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t p-2">
        <button
          onClick={toggleSidebar}
          className={cn(
            "w-full rounded-md p-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            sidebarCollapsed && "justify-center"
          )}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!sidebarCollapsed && "Collapse"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                sidebarCollapsed
                  ? "M4 6h16M4 18h16"
                  : "M6 5l12 14M6 5l12 14M6 5L18 19"
              }
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
