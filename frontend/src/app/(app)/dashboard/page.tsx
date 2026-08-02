"use client";

import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-0">
      <PageHeader
        title="Dashboard"
        description="Overview of your repository readiness evaluations."
      />

      <div className="p-6">
        {/* Holographic Card — Phase 2 variant for the empty-state panel */}
        <Card variant="holographic" className="mx-auto max-w-lg">
          <CardHeader className="items-center pb-4 pt-8 text-center">
            {/* Bordered square icon container — Iconography spec */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center cyber-chamfer-sm border border-accent/30 bg-accent/5">
              <FolderGit2 className="h-6 w-6 stroke-[1.5] text-accent" />
            </div>
            <CardTitle className="text-center">
              No repositories connected
            </CardTitle>
            <CardDescription className="text-center font-body text-xs leading-relaxed">
              Connect a GitHub repository to run your first Preflight
              engineering audit and receive a scored readiness report.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center pb-8 pt-2">
            {/* Glitch-style CTA — solid accent link */}
            <Link
              href="/repositories"
              className={[
                "cyber-chamfer-sm",
                "inline-flex items-center justify-center gap-2",
                "min-h-11 h-11 px-6",
                "font-label text-xs uppercase tracking-wider",
                "border-2 border-accent bg-accent text-background",
                "hover:brightness-110 hover:[box-shadow:var(--box-shadow-neon)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-all duration-150 motion-reduce:transition-none",
              ].join(" ")}
            >
              Connect Repository
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
