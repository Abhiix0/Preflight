"use client";

import { cn } from "@/lib/utils";
import { useAnimeScope } from "@/lib/animation";
import { buildGaugeEntrance } from "./hero.animations";

/**
 * Readiness Score Gauge — enriched visual
 *
 * Geometry (SVG viewBox 0 0 220 220, centre 110,110):
 *   r = 80  →  circumference = 2π × 80 = 502.655
 *   270° arc = 75% of circumference → arcLength = 376.99
 *   Score 94/100 → filledArc = 376.99 × 0.94 = 354.37
 *   finalDashOffset = 376.99 − 354.37 = 22.62
 *
 * New elements added in this version:
 *   • Radar sweep: conic-gradient div, continuous rotation loop
 *   • Tick marks: 36 radial lines around full circumference
 *   • Two-tone arc: muted remainder arc for unfilled 6%
 *   • Three floating badge pills positioned around the gauge
 *
 * Resting-state discipline:
 *   • gauge-arc: strokeDashoffset=376.99 (empty) by default;
 *     @media(prefers-reduced-motion) in globals.css overrides to 22.62
 *   • radar-sweep: rotate(0deg) default — neutral, loop starts from here
 *   • badges: translateY(0) default — float is a loop, not a reveal
 */

// ── Gauge constants (exported for hero.animations.ts) ─────────────────────
export const GAUGE_R = 80;
export const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_R; // 502.655
export const GAUGE_ARC_LENGTH = GAUGE_CIRCUMFERENCE * 0.75; // 376.99
export const GAUGE_SCORE = 94;
export const GAUGE_FINAL_OFFSET =
  GAUGE_ARC_LENGTH - GAUGE_ARC_LENGTH * (GAUGE_SCORE / 100); // 22.62

const CX = 110;
const CY = 110;

// ── Tick mark generator ──────────────────────────────────────────────────
function buildTicks() {
  const ticks = [];
  const TOTAL = 36; // one tick every 10°
  const R_INNER_MAJOR = 92;
  const R_INNER_MINOR = 95;
  const R_OUTER = 100;

  for (let i = 0; i < TOTAL; i++) {
    // Start at -225° (matching the 270° arc start at bottom-left)
    const angleDeg = -225 + i * (360 / TOTAL);
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const rInner = isMajor ? R_INNER_MAJOR : R_INNER_MINOR;

    const x1 = CX + rInner * Math.cos(angleRad);
    const y1 = CY + rInner * Math.sin(angleRad);
    const x2 = CX + R_OUTER * Math.cos(angleRad);
    const y2 = CY + R_OUTER * Math.sin(angleRad);

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={isMajor ? 1.5 : 0.75}
        strokeLinecap="round"
        className={
          isMajor ? "stroke-(--landing-bg)/40" : "stroke-(--landing-bg)/20"
        }
      />
    );
  }
  return ticks;
}

// ── Badge data ────────────────────────────────────────────────────────────
const BADGES = [
  { id: "security", label: "Security ✓", top: "8%", left: "62%", delay: 0 },
  { id: "issues", label: "No Issues", top: "44%", left: "72%", delay: 400 },
  { id: "uptime", label: "98% Uptime", top: "80%", left: "58%", delay: 200 },
];

// ── Component ─────────────────────────────────────────────────────────────
interface HeroVisualProps {
  className?: string;
}

export default function HeroVisual({ className }: HeroVisualProps) {
  const root = useAnimeScope<HTMLDivElement>(buildGaugeEntrance);

  return (
    <div
      ref={root}
      className={cn(
        "gauge-root relative flex items-center justify-center",
        className
      )}
    >
      {/*
       * Radar sweep — conic-gradient rotating div.
       * Sized to wrap tightly around the gauge arc radius.
       * Default rotate(0deg) → loop starts from neutral, no jump.
       * aria-hidden: purely decorative.
       */}
      <div
        className="radar-sweep pointer-events-none absolute rounded-full"
        aria-hidden="true"
        style={{
          width: 220,
          height: 220,
          background:
            "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--landing-bg) 12%, transparent) 60deg, transparent 90deg)",
          transform: "rotate(0deg)",
        }}
      />

      {/* Gauge ring wrapper — relative anchor for badges */}
      <div className="gauge-ring relative flex items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          width="100%"
          height="100%"
          className="max-h-72 max-w-72 overflow-visible sm:max-h-80 sm:max-w-80"
          aria-hidden="true"
        >
          {/* ── Tick marks ── */}
          <g>{buildTicks()}</g>

          {/* ── Track ring (dim full-arc rail) ── */}
          <circle
            cx={CX}
            cy={CY}
            r={GAUGE_R}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH} ${GAUGE_CIRCUMFERENCE}`}
            strokeDashoffset={0}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: `${CX}px ${CY}px`,
            }}
            className="stroke-(--landing-bg)/15"
          />

          {/*
           * ── Muted remainder arc (two-tone: unfilled 6%) ──
           * Sits behind the active arc. Shows the "empty" portion
           * in a slightly brighter muted tone vs the track.
           * dashoffset starts at GAUGE_FINAL_OFFSET so it covers the
           * gap between the filled arc end and the track end.
           * Pre-JS state: fully visible (static, not animated).
           */}
          <circle
            cx={CX}
            cy={CY}
            r={GAUGE_R}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH} ${GAUGE_CIRCUMFERENCE}`}
            strokeDashoffset={0}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: `${CX}px ${CY}px`,
            }}
            className="stroke-(--landing-bg)/30"
          />

          {/*
           * ── Active arc (94% filled, primary stroke) ──
           * Default strokeDashoffset = GAUGE_ARC_LENGTH (fully empty).
           * Animation sweeps to GAUGE_FINAL_OFFSET = 22.62.
           * prefers-reduced-motion CSS overrides to final state.
           */}
          <circle
            className="gauge-arc stroke-(--landing-bg)"
            cx={CX}
            cy={CY}
            r={GAUGE_R}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH} ${GAUGE_CIRCUMFERENCE}`}
            strokeDashoffset={GAUGE_ARC_LENGTH}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: `${CX}px ${CY}px`,
            }}
          />

          {/*
           * ── Glow ring (outer ambient pulse) ──
           * Slightly larger, very low opacity. Driven by ambient loop.
           */}
          <circle
            className="gauge-glow stroke-(--landing-bg)/10"
            cx={CX}
            cy={CY}
            r={GAUGE_R + 8}
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH * 1.1} ${GAUGE_CIRCUMFERENCE * 1.1}`}
            strokeDashoffset={0}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: `${CX}px ${CY}px`,
            }}
          />

          {/* ── Score text ── */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={40}
            fontWeight={700}
            fontFamily="var(--font-geist-sans, sans-serif)"
            className="fill-(--landing-bg)"
          >
            {GAUGE_SCORE}
          </text>
          <text
            x={CX}
            y={CY + 22}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fontWeight={600}
            letterSpacing={2.5}
            fontFamily="var(--font-geist-sans, sans-serif)"
            className="fill-(--landing-bg)/50"
          >
            READINESS
          </text>
        </svg>

        {/*
         * ── Floating badge pills ──
         * Positioned absolutely relative to .gauge-ring.
         * translateY(0) is the resting/neutral position — no FOUC.
         * Float animation is a loop (up/down), not a reveal.
         * data-badge-index drives staggered delay in hero.animations.ts.
         */}
        {BADGES.map((badge, i) => (
          <div
            key={badge.id}
            className="badge-pill pointer-events-none absolute whitespace-nowrap rounded-full border border-(--landing-bg)/15 bg-(--landing-bg)/80 px-3 py-1 text-xs font-semibold text-(--landing-bg) backdrop-blur-sm"
            data-badge-index={i}
            style={{
              top: badge.top,
              left: badge.left,
              transform: "translateY(0px)",
            }}
            aria-hidden="true"
          >
            {badge.label}
          </div>
        ))}
      </div>

      {/* Screen reader label */}
      <span className="sr-only">Readiness score: {GAUGE_SCORE} out of 100</span>
    </div>
  );
}
