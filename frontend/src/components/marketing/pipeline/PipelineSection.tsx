"use client";

import { GitBranch, Search, BarChart2, FileText, Rocket } from "lucide-react";
import { useScrollTimeline, prefersReducedMotion } from "@/lib/animation";
import { buildPipelineTimeline } from "./pipeline.animations";
import { PipelineNode } from "./PipelineNode";
import { PipelineCard } from "./PipelineCard";

/* ─── Stage data ──────────────────────────────────────────────────────────── */
const STAGES = [
  {
    id: "repository",
    label: "Repository",
    title: "Connect Repository",
    description:
      "Link your GitHub repo in one click. Preflight pulls your code, config, and CI setup automatically.",
    icon: GitBranch,
  },
  {
    id: "scanning",
    label: "Scanning",
    title: "Deep Scanning",
    description:
      "Automated scanners comb every file for security gaps, dependency risks, and architecture drift.",
    icon: Search,
  },
  {
    id: "analysis",
    label: "Analysis",
    title: "Analysis",
    description:
      "Cross-layer analysis correlates findings — a single root cause often explains a cluster of symptoms.",
    icon: BarChart2,
  },
  {
    id: "report",
    label: "Report",
    title: "Review Report",
    description:
      "A clear, prioritized report with actionable findings and a production-readiness score you can act on.",
    icon: FileText,
  },
  {
    id: "deploy",
    label: "Deploy",
    title: "Deploy with Confidence",
    description:
      "Fix what matters, re-run checks, and ship knowing your project meets professional engineering standards.",
    icon: Rocket,
  },
] as const;

/* ─── SVG track ───────────────────────────────────────────────────────────── */

/**
 * The SVG is stretched to fill the full width of the marker row via
 * `absolute inset-0`. Node circles are h-10 w-10 (40px), centered in
 * each of the 5 equal columns. In viewBox coordinates (width=1000):
 *   - Column centres: 100, 300, 500, 700, 900  (every 200 units)
 *   - Node radius in viewBox: ~20 units (40px / 2, scaled)
 *   - Line Y sits at viewBox centre = 50 (the SVG height is exactly 40px = h-10)
 *
 * We start each segment line just outside the node circle edge (cx ± ~20)
 * so the line meets the border cleanly without overlapping the circle fill.
 */
function HorizontalTrack() {
  // Node centres in viewBox units (viewBox = "0 0 1000 100", height represents 40px node)
  const nodeXs = [100, 300, 500, 700, 900];
  const cy = 50;
  const nodeR = 22; // half the node width in viewBox units — line starts just outside circle

  return (
    <svg
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      {nodeXs.slice(0, 4).map((x1, i) => {
        const x2 = nodeXs[i + 1];
        const lx1 = x1 + nodeR; // start after the right edge of node i
        const lx2 = x2 - nodeR; // end before the left edge of node i+1
        const vmid = (lx1 + lx2) / 2;

        return (
          <g key={i}>
            {/* Dim baseline track — always visible */}
            <line
              x1={lx1} y1={cy} x2={lx2} y2={cy}
              strokeWidth="2"
              className="stroke-(--landing-surface)/20"
            />
            {/* Animated draw segment */}
            <line
              className="pipeline-segment stroke-(--landing-surface)"
              data-seg={i}
              x1={lx1} y1={cy} x2={lx2} y2={cy}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Particle */}
            <circle
              className="pipeline-particle fill-(--landing-surface)"
              data-particle={i}
              cx={vmid} cy={cy} r="5"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

export function PipelineSection() {
  const isStatic = prefersReducedMotion();
  const stickyRoot = useScrollTimeline<HTMLDivElement>(buildPipelineTimeline);

  return (
    <section className="bg-(--landing-bg)" aria-labelledby="pipeline-heading">

      {/* ── Header — always visible, outside scroll container ── */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24 text-center sm:px-8 sm:pt-32">
        <h2
          id="pipeline-heading"
          className="text-3xl font-bold tracking-tight text-(--landing-fg) sm:text-4xl"
        >
          How It Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-(--landing-fg-muted)">
          Five stages from repository to production-ready.
        </p>
      </div>

      {/* ── Desktop: sticky scroll-scrub ── */}
      <div className="hidden lg:block">
        {/*
         * min-h-[300vh] — scroll travel for the 4-segment animation.
         * The sticky child stays pinned until the outer container scrolls out.
         */}
        <div className="min-h-[300vh]">
          <div
            ref={stickyRoot}
            className="sticky top-0 flex h-screen items-center"
          >
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
              {/*
               * Two-row layout:
               *   Row 1: labels (above nodes)
               *   Row 2: node circles + SVG track (same height, track overlaid)
               *   Row 3: cards (below nodes)
               *
               * All three rows share the same 5-column grid so columns align.
               */}

              {/* Row 1 — labels */}
              <div className="grid grid-cols-5">
                {STAGES.map((stage) => (
                  <div key={stage.id} className="flex justify-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-(--landing-surface)/60">
                      {stage.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Row 2 — node circles + SVG track overlay */}
              <div className="relative mt-3 grid grid-cols-5">
                {/* SVG absolutely fills this row, drawing lines between node centres */}
                {!isStatic && <HorizontalTrack />}

                {/* Node circles — each centred in its column via justify-center */}
                {STAGES.map((stage, i) => (
                  <div key={stage.id} className="flex justify-center">
                    <PipelineNode
                      index={i}
                      icon={stage.icon}
                      static={isStatic}
                    />
                  </div>
                ))}
              </div>

              {/* Row 3 — cards */}
              <div className="mt-6 grid grid-cols-5 gap-3">
                {STAGES.map((stage, i) => (
                  <PipelineCard
                    key={stage.id}
                    index={i}
                    title={stage.title}
                    description={stage.description}
                    icon={stage.icon}
                    static={isStatic}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: static stacked list, no scroll-scrub ── */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-md px-6 pb-24 sm:px-8">
          <div className="flex flex-col gap-6">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex items-start gap-4">
                {/* Left: node marker + vertical connector */}
                <div className="flex flex-col items-center">
                  <PipelineNode index={i} icon={stage.icon} static />
                  {/* Connector line between nodes */}
                  {i < STAGES.length - 1 && (
                    <div className="mt-1 w-0.5 flex-1 self-stretch bg-(--landing-surface)/20" style={{ minHeight: "2.5rem" }} />
                  )}
                </div>

                {/* Right: label + card */}
                <div className="flex-1 pb-2">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-(--landing-surface)/60">
                    {stage.label}
                  </p>
                  <PipelineCard
                    index={i}
                    title={stage.title}
                    description={stage.description}
                    icon={stage.icon}
                    static
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
