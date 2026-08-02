"use client";

import { Card, CardContent } from "@/components/ui/card";

/**
 * Auth callback — visual placeholder only.
 *
 * TODO (auth-integration phase): wire real callback logic here —
 *   1. Read the `code` search param from the URL.
 *   2. Exchange it via POST /auth/github/callback on the backend.
 *   3. Backend sets the JWT cookie and returns the user object.
 *   4. Call setUser() on the auth store, then router.push("/dashboard").
 *   5. On error: call logout(), router.replace("/login").
 *
 * This page is NOT reachable in the current flow — login navigates
 * directly to /dashboard, bypassing OAuth entirely. The route is kept
 * in place so the file structure is ready for the auth phase.
 */
export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card variant="terminal" className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="font-body text-sm space-y-3">
            {/* Simulated auth lines */}
            <div className="flex gap-2">
              <span className="font-label text-accent shrink-0">$</span>
              <span className="text-foreground">
                preflight auth --provider github
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-label text-accent shrink-0">&gt;</span>
              <span className="text-foreground">Authenticating...</span>
            </div>
            <div className="flex gap-2">
              <span className="font-label text-accent shrink-0">&gt;</span>
              <span className="text-foreground">
                Waiting for session
                {/* Blinking cursor — animation suppressed by global reduced-motion rule */}
                <span
                  className="ml-1 inline-block h-[1em] w-2 bg-accent align-middle animate-blink motion-reduce:animate-none"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
