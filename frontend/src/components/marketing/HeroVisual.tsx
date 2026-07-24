"use client";

import { cn } from "@/lib/utils";
import { useAnimeScope } from "@/lib/animation";
import { buildGaugeEntrance } from "./hero.animations";

/**
 * Readiness Score Gauge
 *
 * Geometry:
 *   r = 80px  →  circumference = 2π × 80 = 502.655
 *   270° sweep = 75% of circumference → arcLength = 376.99
 *   Score 94/100 → filledArc = 376.99 × 0.94 = 354.37
 *   finalDashOffset = 376.99 − 354.37 = 22.62
 *
 *   strokeDasharray  = "376.99 502.655"  (arc portion, then gap to full circ)
 *   strokeDashoffset = 376.99            (default: fully empty — resting state)
 *   transform        = rotate(135deg)    (centres 270° arc, gap at bottom)
 *
 * Resting-state discipline:
 *   The inline strokeDashoffset="376.99" is the correct pre-JS/pre-animation
 *   state. The @media (prefers-reduced-motion) rule in globals.css overrides it
 *   to 22.62 (full) so reduced-motion users see the completed gauge immediately.
 *   The animation hook sweeps it to 22.62 on mount.
 */

// Gauge constants — shared with hero.animations.ts via export
export const GAUGE_R = 80;
export const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_R; // 502.655
export const GAUGE_ARC_LENGTH = GAUGE_CIRCUMFERENCE * 0.75; // 376.99  (270°)
export const GAUGE_SCORE = 94;
export const GAUGE_FINAL_OFFSET =
  GAUGE_ARC_LENGTH - GAUGE_ARC_LENGTH * (GAUGE_SCORE / 100); // 22.62

interface HeroVisualProps {
  className?: string;
}

export default function HeroVisual({ className }: HeroVisualProps) {
  const root = useAnimeScope<HTMLDivElement>(buildGaugeEntrance);

  return (
    <div
      ref={root}
      className={cn("gauge-root flex items-center justify-center", className)}
      // Aspect ratio matches the visual column's available space
    >
      {/* Outer decorative ring */}
      <div className="gauge-ring relative flex items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          width="100%"
          height="100%"
          className="max-h-72 max-w-72 overflow-visible sm:max-h-80 sm:max-w-80"
          aria-hidden="true"
        >
          {/*
           * Track ring — always-visible dim arc showing the full 270° extent.
           * Gives the gauge a "rail" to fill against.
           */}
          <circle
            cx={110}
            cy={110}
            r={GAUGE_R}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH} ${GAUGE_CIRCUMFERENCE}`}
            strokeDashoffset={0}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: "110px 110px",
            }}
            className="stroke-(--landing-bg)/20"
          />

          {/*
           * Active arc — animated from dashoffset=GAUGE_ARC_LENGTH (empty)
           * to dashoffset=GAUGE_FINAL_OFFSET (94% filled).
           *
           * Default strokeDashoffset = GAUGE_ARC_LENGTH = fully empty.
           * This is the correct pre-JS resting state.
           * The prefers-reduced-motion CSS rule in globals.css overrides this
           * to GAUGE_FINAL_OFFSET so reduced-motion users see the final state.
           */}
          <circle
            className="gauge-arc stroke-(--landing-bg)"
            cx={110}
            cy={110}
            r={GAUGE_R}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH} ${GAUGE_CIRCUMFERENCE}`}
            strokeDashoffset={GAUGE_ARC_LENGTH}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: "110px 110px",
            }}
          />

          {/*
           * Glow / secondary ring — slightly larger, very low opacity.
           * Creates a soft depth ring around the active arc.
           * Also animated in hero.animations (opacity pulse ambient loop).
           */}
          <circle
            className="gauge-glow stroke-(--landing-bg)/10"
            cx={110}
            cy={110}
            r={GAUGE_R + 8}
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC_LENGTH * 1.1} ${GAUGE_CIRCUMFERENCE * 1.1}`}
            strokeDashoffset={0}
            style={{
              transform: "rotate(135deg)",
              transformOrigin: "110px 110px",
            }}
          />

          {/* Score text — centered in SVG */}
          <text
            x={110}
            y={105}
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
            x={110}
            y={136}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            letterSpacing={2}
            fontFamily="var(--font-geist-sans, sans-serif)"
            className="fill-(--landing-bg)/60"
          >
            READINESS
          </text>
        </svg>
      </div>

      {/* Visible text fallback for screen readers — aria-hidden on SVG above */}
      <span className="sr-only">Readiness score: {GAUGE_SCORE} out of 100</span>
    </div>
  );
}
