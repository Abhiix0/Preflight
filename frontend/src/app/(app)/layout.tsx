"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";

/**
 * App shell layout.
 *
 * TODO (auth-integration phase): restore the useCurrentUser() guard here.
 * When auth is wired up, re-add:
 *   const { isPending, isError } = useCurrentUser();
 *   useEffect(() => { if (isError) router.replace("/login"); }, [isError]);
 *   if (isPending || isError) return <LoadingScreen />;
 *
 * For now the layout renders unconditionally — middleware is also disabled,
 * so all (app) routes are directly reachable without a session. This is
 * intentional for the current UI-only development phase.
 *
 * Layout structure:
 *   cyber-grid bg → Sidebar (md+) | Header + <main>
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground cyber-grid">
      {/* Sidebar — hidden below md breakpoint */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
