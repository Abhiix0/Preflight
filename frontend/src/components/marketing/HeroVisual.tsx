"use client";

import { Shield, CheckCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimeScope } from "@/lib/animation";
import { buildGaugeEntrance } from "./hero.animations";

/**
 * Readiness Score Gauge — final polish
 *
 * ── Containment fix ──────────────────────────────────────────────────────
 * gauge-root is sized explicitly at 300×300px (w=h=300).
 * Half-width = 150px. ORBIT_R = 110px. Dot chip radius ≈ 16px.
 * Max dot extent = 110 + 16 = 126px < 150px → 24px clearance on all sides.
 * This guarantees no dot ever exits the gauge-root bounding box
 * regardless of rotation angle, container positioning, or breakpoint.
 *
 * ── Orbit element separation ─────────────────────────────────────────────
 * Each orbit slot uses two nested divs:
 *   .orbit-slot    — owns rotate(startDeg) + translateY(-ORBIT_R)
 *                    transform-origin centre of container; Anime.js
 *                    NEVER touches this element
 *   .orbit-dot-inner — owns only counter-rotation; translate(-50%,-50%)
 *                    is a CSS class (not inline style), so Anime.js
 *                    writing `rotate` via inline style doesn't clobber it
 *                    (Tailwind class transform ≠ inline style transform)
 *
 * ── Dot appearance ───────────────────────────────────────────────────────
 * Pale chip: bg-(--landing-surface) border border-(--landing-bg)/20
 * shadow-md — reads as a lifted chip against the pale zone background.
 * Icon in --landing-bg. Label hidden until hover (CSS group-hover).
 *
 * ── New elements ─────────────────────────────────────────────────────────
 * • Ambient glow: large blurred radial-gradient div behind everything
 * • Dashed guide-ring: SVG circle at ORBIT_R radius, stroke-dasharray
 * • Mouse-parallax: .parallax-layer wraps gauge+glow+orbit;
 *   hero.animations.ts drives transform via pointermove listener
 */

// ── Constants (exported for hero.animations.ts) ───────────────────────────
export const GAUGE_R = 80;
export const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_R; // 502.655
export const GAUGE_ARC_LENGTH = GAUGE_CIRCUMFERENCE * 0.75; // 376.99
export const GAUGE_SCORE = 94;
export const GAUGE_FINAL_OFFSET =
  GAUGE_ARC_LENGTH - GAUGE_ARC_LENGTH * (GAUGE_SCORE / 100); // 22.62

// DOM-space orbit constants
export const ORBIT_R = 110; // px — fits inside 150px half of 300px root
export const ORBIT_DURATION = 64000; // ms per revolution

// Guide-ring: SVG viewBox is 300×300, centre 150,150
// ORBIT_R in viewBox units = ORBIT_R (1:1 since SVG fills the root)
const GUIDE_R = ORBIT_R; // 110 in viewBox units
const GUIDE_CX = 150;
const GUIDE_CY = 150;
const GUIDE_CIRC = 2 * Math.PI * GUIDE_R; // 691.15

const CX = 110; // gauge SVG centre
const CY = 110;

// ── Orbit dot definitions ─────────────────────────────────────────────────
const ORBIT_DOTS = [
  { id: "security", label: "Security", Icon: Shield, startDeg: 0 },
  { id: "issues", label: "No Issues", Icon: CheckCircle, startDeg: 120 },
  { id: "uptime", label: "98% Uptime", Icon: Activity, startDeg: 240 },
] as const;

// ── Tick generator ────────────────────────────────────────────────────────
function buildTicks() {
  const ticks = [];
  const TOTAL = 36;
  const R_INNER_MAJOR = 92;
  const R_INNER_MINOR = 95;
  const R_OUTER = 100;

  for (let i = 0; i < TOTAL; i++) {
    const angleDeg = -225 + i * (360 / TOTAL);
    const rad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const rInner = isMajor ? R_INNER_MAJOR : R_INNER_MINOR;
    ticks.push(
      <line
        key={i}
        x1={CX + rInner * Math.cos(rad)}
        y1={CY + rInner * Math.sin(rad)}
        x2={CX + R_OUTER * Math.cos(rad)}
        y2={CY + R_OUTER * Math.sin(rad)}
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

// ── Component ─────────────────────────────────────────────────────────────
interface HeroVisualProps {
  className?: string;
}

export default function HeroVisual({ className }: HeroVisualProps) {
  const root = useAnimeScope<HTMLDivElement>(buildGaugeEntrance);

  return (
    /*
     * gauge-root: explicit 300×300 bounding box.
     * All child elements (orbit, glow, SVG) must fit within this box.
     * useAnimeScope ref attaches here → scopes all selector queries.
     */
    <div
      ref={root}
      className={cn(
        "gauge-root relative flex items-center justify-center",
        className
      )}
      style={{ width: 300, height: 300 }}
    >
      {/*
       * Ambient glow — large blurred radial behind everything.
       * z-index 0 (below orbit, gauge, dots).
       * aria-hidden: decorative only.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in srgb, var(--landing-bg) 18%, transparent) 0%, transparent 70%)",
          filter: "blur(24px)",
          opacity: 0.9,
        }}
      />

      {/*
       * Parallax layer — wraps the entire visual assembly.
       * hero.animations.ts drives transform: translate(x,y) on this element
       * in response to pointer movement on the hero right zone.
       * Orbit rotation and gauge sweep animate children independently;
       * this layer's translate doesn't interfere with them.
       * Default: translate(0,0) — no jump on first interaction.
       */}
      <div
        className="parallax-layer absolute inset-0 flex items-center justify-center"
        style={{ transform: "translate(0px, 0px)" }}
      >
        {/* Radar sweep */}
        <div
          className="radar-sweep pointer-events-none absolute rounded-full"
          aria-hidden="true"
          style={{
            width: 220,
            height: 220,
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--landing-bg) 10%, transparent) 55deg, transparent 85deg)",
            transform: "rotate(0deg)",
          }}
        />

        {/*
         * Dashed guide-ring SVG — same 300×300 as gauge-root.
         * ORBIT_R = 110px maps 1:1 to viewBox units (SVG fills root).
         * stroke-dasharray creates the dashed track appearance.
         * Static — no animation needed.
         */}
        <svg
          viewBox="0 0 300 300"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <circle
            cx={GUIDE_CX}
            cy={GUIDE_CY}
            r={GUIDE_R}
            fill="none"
            strokeWidth={1}
            strokeDasharray={`${GUIDE_CIRC / 48} ${GUIDE_CIRC / 48}`}
            className="stroke-(--landing-bg)/18"
          />
        </svg>

        {/* Gauge ring — SVG */}
        <div className="gauge-ring relative z-10 flex items-center justify-center">
          <svg
            viewBox="0 0 220 220"
            width="100%"
            height="100%"
            className="max-h-60 max-w-60 overflow-visible sm:max-h-64 sm:max-w-64"
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

            {/* Muted remainder arc */}
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

            {/* Active arc — default empty (GAUGE_ARC_LENGTH), sweeps to final */}
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

            {/* Score text */}
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
        </div>

        {/*
         * Orbit container — 300×300, centred over gauge-root.
         * Rotates continuously via hero.animations.ts.
         * Overflow visible so expanded hover pills aren't clipped
         * (they expand inward toward centre, not outward past root).
         */}
        <div
          className="orbit-container pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ transform: "rotate(0deg)" }}
        >
          {ORBIT_DOTS.map((dot) => (
            /*
             * .orbit-slot: positions each dot on the orbit ring.
             * transform-origin: centre of the 300×300 container (150px, 150px).
             * rotate(startDeg) spins the slot to its angular position.
             * translateY(-ORBIT_R) moves it outward to the orbit radius.
             * Anime.js NEVER touches .orbit-slot — it is static.
             */
            <div
              key={dot.id}
              className="orbit-slot absolute"
              style={{
                top: "50%",
                left: "50%",
                width: 0,
                height: 0,
                transformOrigin: "0 0",
                transform: `rotate(${dot.startDeg}deg) translateY(-${ORBIT_R}px)`,
              }}
            >
              {/*
               * .orbit-dot-inner: owns counter-rotation only.
               * translate(-50%, -50%) is a Tailwind class — Anime.js writes
               * `rotate` to inline style, which in modern browsers composes
               * with the class transform. We use `will-change: transform`
               * to hint the compositor. The translate centering is via the
               * Tailwind -translate-x-1/2 -translate-y-1/2 classes so it
               * is NOT in inline style and won't be overwritten by Anime.js.
               *
               * Pale chip design: bg-(--landing-surface), border, shadow-md,
               * icon in --landing-bg — reads as a lifted chip on the pale zone.
               */}
              <div
                className="orbit-dot-inner group pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-default"
                style={{ transform: `rotate(${-dot.startDeg}deg)` }}
                data-orbit-dot={dot.id}
                data-start-deg={dot.startDeg}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-(--landing-bg)/20 bg-(--landing-surface) px-2.5 py-1.5 shadow-md transition-all duration-300">
                  <dot.Icon className="h-3 w-3 shrink-0 text-(--landing-bg)" />
                  <span className="orbit-label max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold text-(--landing-bg) opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:pl-0.5 group-hover:opacity-100">
                    {dot.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Readiness score: {GAUGE_SCORE} out of 100</span>
    </div>
  );
}
