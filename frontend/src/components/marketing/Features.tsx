"use client";

import {
  ShieldAlert,
  Package,
  KeyRound,
  Container,
  GitBranch,
  BookOpen,
  FlaskConical,
  Hammer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Features — 8 analysis categories exactly as defined in
 * docs/PRD.md (Analysis Engine / Security Engine / Scoring Engine)
 * and docs/Api-specification.md (findings category filter list).
 *
 * Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, -skew-y-1 per
 * doc's Layout Strategy for feature grids.
 *
 * Each card:
 *   - Card "default" variant (cyber-chamfer, 1px border,
 *     hover accent border + neon-sm glow via hoverEffect prop)
 *   - Icon inside a bordered square container (Iconography spec)
 *   - Icon stroke-width 1.5
 * No rounded-* anywhere.
 */

const FEATURES = [
  {
    icon: ShieldAlert,
    title: "Security",
    description:
      "Detects dangerous configurations, exposed credentials, and known CVEs in your dependency tree.",
  },
  {
    icon: Package,
    title: "Dependencies",
    description:
      "Audits package manifests for outdated, vulnerable, or unlicensed packages across all supported ecosystems.",
  },
  {
    icon: KeyRound,
    title: "Secrets",
    description:
      "Scans every file for hardcoded API keys, tokens, and passwords before they reach a public repository.",
  },
  {
    icon: Container,
    title: "Docker",
    description:
      "Validates Dockerfile hygiene, multi-stage build patterns, exposed ports, and image security best practices.",
  },
  {
    icon: GitBranch,
    title: "CI/CD",
    description:
      "Inspects pipeline configuration for missing steps, insecure actions, and deployment gate coverage.",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Checks for README completeness, API docs, environment variable documentation, and contribution guides.",
  },
  {
    icon: FlaskConical,
    title: "Tests",
    description:
      "Measures test suite presence, coverage thresholds, and CI integration to surface untested code paths.",
  },
  {
    icon: Hammer,
    title: "Build",
    description:
      "Verifies build scripts compile cleanly, environment variables are declared, and artefacts are reproducible.",
  },
] as const;

export function Features() {
  return (
    <section className="relative bg-background py-24">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-14 flex flex-col gap-3">
          <span className="font-label text-[10px] uppercase tracking-widest text-accent">
            // What gets checked
          </span>
          <h2 className="font-heading text-3xl font-black uppercase tracking-wide text-foreground md:text-4xl">
            Eight categories. Zero surprises.
          </h2>
          <p className="max-w-2xl font-body text-sm text-muted-foreground md:text-base">
            Every Preflight scan covers the same eight engineering areas.
            Each finding is categorised, severity-ranked, and paired with a
            concrete recommendation before it reaches your dashboard.
          </p>
        </div>

        {/*
          -skew-y-1 grid container per Layout Strategy for feature grids.
          Individual cards counter-skew with skew-y-1 so content stays level.
        */}
        <div className="-skew-y-1 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              variant="default"
              hoverEffect
              className="skew-y-1"
            >
              <CardHeader className="pb-3">
                {/* Bordered square icon container — Iconography spec */}
                <div
                  className={[
                    "mb-4 flex h-10 w-10 items-center justify-center",
                    "cyber-chamfer-sm border border-accent/30 bg-accent/5",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 stroke-[1.5] text-accent" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-body text-xs leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}

          {/* Eighth card uses last column on lg; add a decorative filler on lg grid */}
        </div>
      </div>
    </section>
  );
}
