"use client";

import { Shield, CheckCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimeScope } from "@/lib/animation";
import { buildGaugeEntrance } from "./hero.animations";

/**
 * Readiness Score Gauge — with orbiting badge elements
 *
 * Gauge geometry (SVG viewBox 0 0 220 220, centre 110,110):
 *   r = 80  →  circumference = 2π × 80 = 502.655
 *   270° arc = 75%  → arcLength = 376.99
 *   Score 94/100    → finalOffset = 22.62
 *
 * Orbit geometry (DOM layer, outside SVG):
 *   SVG renders at max-w-72 = 288px → viewBox scale = 288/220 = 1.309
 *   Tick ring outer edge ≈ 100 × 1.309 = 131px from centre
 *   Orbit radius = 150px → always clear of ticks
 *   Orbit container = 300×300px div, centred over gauge
 *   Each dot sits at translateY(-150px) = top of orbit ring
 *   Container rotated per-dot (0°, 120°, 240°) → 120° spacing
 *
 * Resting-state contract:
 *   • gauge-arc: strokeDashoffset = GAUGE_ARC_LENGTH (empty pre-JS)
 *   • orbit dots: baked into inline style (rotate 0/120/240°) — correct
 *     even before any JS runs
 *   • reduced-motion: orbit-container/orbit-dot-inner animations stopped
 *     via globals.css; orbit-label shown statically
 */

// ── Gauge constants ────────────────────────────────────────────────────────
export const GAUGE_R = 80;
export const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_R; // 502.655
export const GAUGE_ARC_LENGTH = GAUGE_CIRCUMFERENCE * 0.75; // 376.99
export const GAUGE_SCORE = 94;
export const GAUGE_FINAL_OFFSET =
  GAUGE_ARC_LENGTH - GAUGE_ARC_LENGTH * (GAUGE_SCORE / 100); // 22.62

// Orbit radius in px (DOM, not viewBox units)
export const ORBIT_R = 150;
// Duration for one full revolution in ms
export const ORBIT_DURATION = 64000;

const CX = 110;
const CY = 110;

// ── Orbit dot data ─────────────────────────────────────────────────────────
const ORBIT_DOTS = [
  {
    id: "security",
    label: "Security",
    Icon: Shield,
    startDeg: 0, // 12-o'clock position
  },
  {
    id: "issues",
    label: "No Issues",
    Icon: CheckCircle,
    startDeg: 120,
  },
  {
    id: "uptime",
    label: "98% Uptime",
    Icon: Activity,
    startDeg: 240,
  },
];

// ── Tick generator ─────────────────────────────────────────────────────────
function buildTicks() {
  const ticks = [];
  const TOTAL = 36;
  const R_INNER_MAJOR = 92;
  const R_INNER_MINOR = 95;
  const R_OUTER = 100;

  for (let i = 0; i < TOTAL; i++) {
    const angleDeg = -225 + i * (360 / TOTAL);
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const rInner = isMajor ? R_INNER_MAJOR : R_INNER_MINOR;

    ticks.push(
      <line
        key={i}
        x1={CX + rInner * Math.cos(angleRad)}
        y1={CY + rInner * Math.sin(angleRad)}
        x2={CX + R_OUTER * Math.cos(angleRad)}
        y2={CY + R_OUTER * Math.sin(angleRad)}
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

// ── Component ──────────────────────────────────────────────────────────────
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
      {/* Radar sweep */}
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

      {/* Gauge ring — SVG */}
      <div className="gauge-ring relative flex items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          width="100%"
          height="100%"
          className="max-h-72 max-w-72 overflow-visible sm:max-h-80 sm:max-w-80"
          aria-hidden="true"
        >
          <g>{buildTicks()}</g>

          {/* Track rail */}
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

          {/* Muted remainder (two-tone unfilled 6%) */}
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

          {/* Active arc — default empty, animated to final */}
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

          {/* Glow ring */}
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

          {/* Score */}
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
         * ── Orbit container ──────────────────────────────────────────────
         * 300×300px div centred over the gauge (margin: -150px from centre
         * via absolute inset-0 + auto margins, or negative translate).
         * Rotates 0→360° over ORBIT_DURATION ms in hero.animations.ts.
         *
         * Each orbit-dot is positioned at the top of the orbit ring
         * via translateY(-ORBIT_R px) = -150px. The dot's own startDeg
         * rotation is baked into its wrapper style — these are the correct
         * pre-JS resting positions (120° apart around the ring).
         *
         * Each orbit-dot-inner counter-rotates to keep labels upright.
         */}
        <div
          className="orbit-container pointer-events-none absolute"
          aria-hidden="true"
          style={{
            width: ORBIT_R * 2,
            height: ORBIT_R * 2,
            // Centre over the gauge-ring div
            top: "50%",
            left: "50%",
            marginTop: -ORBIT_R,
            marginLeft: -ORBIT_R,
            transform: "rotate(0deg)",
          }}
        >
          {ORBIT_DOTS.map((dot) => (
            /*
             * Dot wrapper: rotated to starting position around the ring.
             * transform-origin is the centre of the orbit container.
             */
            <div
              key={dot.id}
              className={`orbit-dot orbit-dot-${dot.id} absolute`}
              style={{
                // Place dot at top of ring, then rotate to starting angle
                top: "50%",
                left: "50%",
                width: 0,
                height: 0,
                transform: `rotate(${dot.startDeg}deg) translateY(-${ORBIT_R}px)`,
                transformOrigin: "0 0",
              }}
            >
              {/*
               * Inner content: counter-rotated to stay upright.
               * Default counter-rotation = -startDeg so labels read
               * correctly at their resting position.
               * hero.animations.ts animates this from -startDeg
               * continuously as the container rotates.
               */}
              <div
                className="orbit-dot-inner group pointer-events-auto flex -translate-x-1/2 -translate-y-1/2 cursor-default items-center gap-1.5 rounded-full border border-(--landing-bg)/15 bg-(--landing-bg)/80 px-2.5 py-1.5 backdrop-blur-sm transition-all duration-300"
                style={{
                  transform: `translate(-50%, -50%) rotate(${-dot.startDeg}deg)`,
                }}
                data-orbit-dot={dot.id}
                data-start-deg={dot.startDeg}
              >
                {/* Icon — always visible */}
                <dot.Icon className="h-3 w-3 shrink-0 text-(--landing-surface)" />

                {/*
                 * Label — hidden by default, shown on hover (CSS :hover on group)
                 * and made visible statically under prefers-reduced-motion
                 * via globals.css rule.
                 */}
                <span className="orbit-label max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold text-(--landing-surface) opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:pl-0.5 group-hover:opacity-100">
                  {dot.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Readiness score: {GAUGE_SCORE} out of 100</span>
    </div>
  );
}
