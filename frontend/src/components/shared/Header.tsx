"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * Cyberpunk Header — terminal-style top bar.
 *
 * AUTH PLACEHOLDER: user data is static mock values.
 * TODO (auth-integration phase): replace MOCK_USER with real store data:
 *   const { user, isAuthenticated, logout } = useAuthStore(...)
 *   and restore the conditional render + real logout() call.
 *
 * Visual spec:
 *   - font-label monospace label, uppercase tracking
 *   - chamfered avatar frame (Avatar primitive from Phase 2)
 *   - neon-accent hover on logout icon (filter drop-shadow)
 */

const MOCK_USER = {
  username: "dev_user",
  email: "dev@preflight.local",
  initials: "D",
};

export function Header() {
  // TODO (auth-integration phase): replace with useAuthStore
  const handleLogout = () => {
    // Placeholder — no-op until real auth is wired up
    console.info("[placeholder] logout triggered — auth not yet wired");
  };

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Terminal label */}
      <div className="flex items-center gap-2">
        <span className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
          {"//"}
        </span>
        <span className="font-label text-[10px] uppercase tracking-widest text-accent">
          Engineering Readiness Platform
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* User info + chamfered avatar */}
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback>{MOCK_USER.initials}</AvatarFallback>
          </Avatar>

          <div className="hidden sm:block">
            <div className="font-label text-[10px] uppercase tracking-wider text-foreground">
              {MOCK_USER.username}
            </div>
            <div className="font-body text-[10px] text-muted-foreground">
              {MOCK_USER.email}
            </div>
          </div>
        </div>

        {/* Logout — neon accent hover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
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
