"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";

/**
 * Cyberpunk Header — terminal-style top bar.
 *
 * - font-label monospace label, uppercase tracking
 * - chamfered avatar frame (from restyled Avatar primitive)
 * - neon-accent hover on logout icon button
 * - ThemeProvider / Sun / Moon removed — dark mode is mandatory
 */
export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    logout: state.logout,
  }));

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Terminal label */}
      <div className="flex items-center gap-2">
        <span className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
          //
        </span>
        <span className="font-label text-[10px] uppercase tracking-widest text-accent">
          Engineering Readiness Platform
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            {/* Chamfered avatar */}
            <Avatar className="size-8">
              <AvatarImage
                src={user.avatar_url || undefined}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User info */}
            <div className="hidden sm:block">
              <div className="font-label text-[10px] uppercase tracking-wider text-foreground">
                {user.username}
              </div>
              <div className="font-body text-[10px] text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
        ) : null}

        {/* Logout — neon accent hover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Sign out"
          className={[
            "text-muted-foreground",
            "hover:text-accent hover:bg-accent/10",
            "hover:filter-[drop-shadow(0_0_4px_var(--accent))]",
            "transition-all duration-150 motion-reduce:transition-none",
          ].join(" ")}
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
        </Button>
      </div>
    </header>
  );
}
