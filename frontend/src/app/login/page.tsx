"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/**
 * Login page — visual placeholder only.
 *
 * AUTH IS NOT WIRED UP. The CTA navigates directly to /dashboard via a
 * plain <Link>. No authService, no GitHub OAuth redirect, no token/cookie
 * logic — that all lands in the dedicated auth-integration phase.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background cyber-grid px-6">
      {/* Accent bloom behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-accent/5 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center cyber-chamfer-sm bg-accent">
            <Rocket
              className="h-5 w-5 stroke-[1.5] text-background"
              aria-hidden="true"
            />
          </div>
          <span className="font-heading text-xs font-black uppercase tracking-widest text-foreground">
            Preflight
          </span>
        </div>

        {/* Terminal card */}
        <Card variant="terminal" className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">Authenticate</CardTitle>
            <CardDescription className="text-center font-body text-xs leading-relaxed">
              Connect a GitHub account to scan repositories and receive
              engineering readiness reports.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pb-6">
            {/* Separator line */}
            <div className="h-px w-full bg-border" />

            {/* CTA — solid accent link styled as a button, no auth calls */}
            <Link
              href="/dashboard"
              className={[
                "cyber-chamfer-sm",
                "flex w-full items-center justify-center gap-3",
                "min-h-11 px-4 py-2",
                "font-label text-xs uppercase tracking-wider",
                "border-2 border-accent bg-accent text-background",
                "hover:brightness-110 hover:[box-shadow:var(--box-shadow-neon)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-all duration-150 motion-reduce:transition-none",
              ].join(" ")}
            >
              {/* GitHub icon */}
              <svg
                className="h-4 w-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </Link>

            {/* Status line */}
            <p className="text-center font-label text-[10px] uppercase tracking-widest text-muted-foreground">
              {"//"} OAuth · GitHub · Secure
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
