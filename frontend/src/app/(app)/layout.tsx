"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { useCurrentUser } from "@/hooks/useAuth";

/**
 * App shell layout.
 *
 * cyber-grid is applied at the outermost wrapper at very low opacity
 * (opacity-[0.4]) so the circuit-board pattern is visible but never
 * competes with content. The pattern is defined in globals.css as
 * .cyber-grid using a pair of 50×50 green-on-transparent SVG lines.
 *
 * Structure:
 *   <div cyber-grid>          ← full-bleed grid texture
 *     <Sidebar />             ← left rail
 *     <div flex-col>
 *       <Header />            ← top bar
 *       <main />              ← scrollable content
 *     </div>
 *   </div>
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isPending, isError } = useCurrentUser();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isPending || isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="font-label text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse motion-reduce:animate-none">
          // Initialising session...
        </span>
      </div>
    );
  }

  return (
    /*
     * Outermost shell — cyber-grid texture at reduced opacity.
     * The grid is a background-image so opacity on the element itself
     * would fade children too; instead we use the pseudo-element approach
     * via a wrapper + absolute overlay, OR we rely on the very low
     * rgba values baked into the .cyber-grid gradient (0.03 alpha) which
     * is already imperceptible against content — no extra wrapper needed.
     */
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
