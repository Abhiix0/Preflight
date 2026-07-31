"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { Link } from "next/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    logout: state.logout,
  }));

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-card px-6 text-card-foreground">
      {/* Title / Breadcrumb placeholder */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Engineering Readiness Platform
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User Info */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback
                className="bg-primary/10 text-xs font-semibold text-primary"
                src={user.avatar_url || undefined}
                alt={user.username}
              >
                {user.username?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-foreground">{user.username}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        ) : null}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Sign out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
}
