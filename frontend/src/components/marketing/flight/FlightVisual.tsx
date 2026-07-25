"use client";

import { useAnimeScope } from "@/lib/animation";
import { prefersReducedMotion } from "@/lib/animation";
import { buildFlightEnvironment } from "./flight.animations";
import {
  PaperAirplane,
  WireframeAircraft,
  JetSilhouette,
  RocketSilhouette,
} from "./aircraft-forms";

/**
 * FlightVisual — the aviation environment scene.
 *
 * Scene design:
 *   ViewBox: 500 × 600 (portrait, fills the right column)
 *   Flight path: M 40 540 C 80 420 300 280 440 100
 *     — sweeps full diagonal of the scene from bottom-left to upper-right
 *
 * Layer order (back to front):
 *   1. Coordinate grid (static, 5% opacity)
 *   2. Altitude rings (static, 5% opacity)
 *   3. Navigation reference dots (static + subtle pulse animation)
 *   4. Construction / blueprint lines (animate in during flight)
 *   5. Trail decay branches (secondary paths that fan out from trail)
 *   6. Main glow trail (createDrawable, evolves with aircraft)
 *   7. Landing zone rings (pulse when aircraft arrives)
 *   8. Aircraft (paper → wire → jet → rocket crossfade)
 *
 * Resting-state: all animated elements are opacity=0 via inline attribute.
 * Static environment elements (grid, rings, dots) render at their
 * permanent low opacity immediately — no animation risk there.
 *
 * Reduced-motion: .flight-static class (added when prefers-reduced-motion)
 * shows the JetSilhouette at mid-path + construction lines statically.
 */

// ── Scene constants ────────────────────────────────────────────────────────
export const VW = 500;
export const VH = 600;

// Flight path — full diagonal sweep
export const FLIGHT_PATH = "M 40 540 C 80 420 300 280 440 100";

// Sampled points along the bezier (t = 0, 0.2, 0.4, 0.6, 0.8, 1.0)
// B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
// P0=(40,540) P1=(80,420) P2=(300,280) P3=(440,100)
export const PATH_POINTS = [
  { x: 40, y: 540 }, // t=0
  { x: 87, y: 473 }, // t=0.2
  { x: 163, y: 393 }, // t=0.4
  { x: 270, y: 298 }, // t=0.6
  { x: 374, y: 192 }, // t=0.8
  { x: 440, y: 100 }, // t=1.0
] as const;

// Aircraft heading (degrees, 0 = pointing right)
export const PATH_ANGLES = [-55, -48, -40, -32, -22, -15] as const;

// Landing zone centre
export const LZ_CX = 432;
export const LZ_CY = 108;

// ── Static environment geometry ───────────────────────────────────────────

// Coordinate grid lines (sparse — 6 vertical, 5 horizontal)
const GRID_COLS = [80, 160, 240, 320, 400, 480];
const GRID_ROWS = [100, 200, 300, 400, 500];

// Altitude rings (concentric ellipses, centred at scene mid)
const ALT_RINGS = [
  { rx: 180, ry: 120 },
  { rx: 280, ry: 185 },
  { rx: 370, ry: 240 },
];
const RING_CX = 260;
const RING_CY = 310;

// Navigation reference dots (scattered, intentional positions)
const NAV_DOTS = [
  { x: 80, y: 160 },
  { x: 180, y: 90 },
  { x: 380, y: 200 },
  { x: 430, y: 320 },
  { x: 120, y: 420 },
  { x: 320, y: 480 },
  { x: 460, y: 460 },
  { x: 60, y: 300 },
  { x: 250, y: 150 },
  { x: 400, y: 420 },
];

export default function FlightVisual() {
  const isReduced = prefersReducedMotion();
  const root = useAnimeScope<HTMLDivElement>(buildFlightEnvironment);

  return (
    <div
      ref={root}
      className="relative h-full w-full"
      style={{ minHeight: 400 }}
    >
      {/* Atmospheric soft glow — CSS layer behind SVG */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 72% 40%, " +
            "color-mix(in srgb, var(--landing-bg) 8%, transparent) 0%, transparent 70%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className={[
          "absolute inset-0 h-full w-full",
          isReduced ? "flight-static" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── Layer 1: Coordinate grid (static, always visible) ─────────── */}
        <g
          stroke="var(--landing-bg)"
          strokeWidth={0.5}
          fill="none"
          opacity={0.05}
        >
          {GRID_COLS.map((x) => (
            <line key={`gc-${x}`} x1={x} y1={0} x2={x} y2={VH} />
          ))}
          {GRID_ROWS.map((y) => (
            <line key={`gr-${y}`} x1={0} y1={y} x2={VW} y2={y} />
          ))}
        </g>

        {/* ── Layer 2: Altitude rings (static, always visible) ──────────── */}
        <g
          stroke="var(--landing-bg)"
          strokeWidth={0.5}
          fill="none"
          opacity={0.05}
        >
          {ALT_RINGS.map((r, i) => (
            <ellipse
              key={`ar-${i}`}
              cx={RING_CX}
              cy={RING_CY}
              rx={r.rx}
              ry={r.ry}
            />
          ))}
          {/* Cross-hair at ring centre */}
          <line
            x1={RING_CX - 12}
            y1={RING_CY}
            x2={RING_CX + 12}
            y2={RING_CY}
            strokeOpacity={0.6}
          />
          <line
            x1={RING_CX}
            y1={RING_CY - 12}
            x2={RING_CX}
            y2={RING_CY + 12}
            strokeOpacity={0.6}
          />
        </g>

        {/* ── Layer 3: Navigation reference dots ────────────────────────── */}
        <g fill="var(--landing-bg)" opacity={0.07}>
          {NAV_DOTS.map((d, i) => (
            <circle
              key={`nd-${i}`}
              className={`nav-dot nav-dot-${i}`}
              cx={d.x}
              cy={d.y}
              r={1.5}
            />
          ))}
        </g>

        {/* ── Layer 4: Construction / blueprint lines ────────────────────
         * Animate in during flight stage, fade out during exit.
         * Cover much of the scene — not clustered in one corner.
         */}
        <g
          stroke="var(--landing-bg)"
          strokeWidth={0.75}
          strokeLinecap="round"
          fill="none"
        >
          {/* Upper section lines */}
          <line id="fl-con-1" x1={160} y1={80} x2={460} y2={60} opacity={0} />
          <line id="fl-con-2" x1={200} y1={110} x2={470} y2={95} opacity={0} />
          {/* Mid-diagonal guides */}
          <line id="fl-con-3" x1={80} y1={300} x2={350} y2={160} opacity={0} />
          <line id="fl-con-4" x1={110} y1={340} x2={370} y2={200} opacity={0} />
          {/* Lower section */}
          <line id="fl-con-5" x1={40} y1={480} x2={200} y2={380} opacity={0} />
          <line id="fl-con-6" x1={60} y1={510} x2={220} y2={410} opacity={0} />
          {/* Perpendicular measurement marks */}
          <line id="fl-con-7" x1={290} y1={200} x2={310} y2={260} opacity={0} />
          <line id="fl-con-8" x1={380} y1={140} x2={400} y2={200} opacity={0} />
        </g>

        {/* ── Layer 5: Trail decay branches ─────────────────────────────
         * Fan out from the main trail as it evolves.
         * Very thin, low opacity.
         */}
        <g
          stroke="var(--landing-bg)"
          strokeWidth={0.5}
          strokeLinecap="round"
          fill="none"
        >
          <path
            id="fl-decay-1"
            d="M 163 393 C 190 370 230 340 280 300"
            opacity={0}
          />
          <path
            id="fl-decay-2"
            d="M 270 298 C 290 260 340 230 390 180"
            opacity={0}
          />
          <path
            id="fl-decay-3"
            d="M 163 393 C 140 430 100 460 60 490"
            opacity={0}
          />
          <path
            id="fl-decay-4"
            d="M 87 473 C 60 500 30 520 20 550"
            opacity={0}
          />
        </g>

        {/* ── Layer 6: Main glow trail ───────────────────────────────────
         * createDrawable animates stroke-dashoffset.
         * Thicker stroke + blur = soft glowing trail.
         */}
        <path
          id="flight-trail"
          d={FLIGHT_PATH}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0}
          style={{
            stroke: "color-mix(in srgb, var(--landing-bg) 70%, white)",
            filter: "blur(0.8px)",
          }}
        />
        {/* Trail soft halo — slightly wider, more blurred */}
        <path
          id="flight-trail-halo"
          d={FLIGHT_PATH}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0}
          style={{
            stroke: "color-mix(in srgb, var(--landing-bg) 20%, white)",
            filter: "blur(4px)",
          }}
        />

        {/* ── Layer 7: Landing zone rings ───────────────────────────────── */}
        <g stroke="var(--landing-bg)" strokeWidth={0.75} fill="none">
          <circle id="fl-lz-outer" cx={LZ_CX} cy={LZ_CY} r={38} opacity={0} />
          <circle id="fl-lz-inner" cx={LZ_CX} cy={LZ_CY} r={20} opacity={0} />
          <circle
            id="fl-lz-dot"
            cx={LZ_CX}
            cy={LZ_CY}
            r={3}
            opacity={0}
            fill="var(--landing-bg)"
          />
          {/* Cardinal tick marks around outer ring */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={`lzt-${deg}`}
                x1={LZ_CX + 34 * Math.cos(rad)}
                y1={LZ_CY + 34 * Math.sin(rad)}
                x2={LZ_CX + 42 * Math.cos(rad)}
                y2={LZ_CY + 42 * Math.sin(rad)}
                opacity={0}
                className="fl-lz-tick"
              />
            );
          })}
        </g>

        {/* ── Layer 8: Aircraft container ───────────────────────────────── */}
        <g
          id="flight-aircraft"
          style={{
            transform: `translate(${PATH_POINTS[0].x}px, ${PATH_POINTS[0].y}px) rotate(${PATH_ANGLES[0]}deg)`,
            transformOrigin: `${PATH_POINTS[0].x}px ${PATH_POINTS[0].y}px`,
          }}
        >
          <g id="flight-paper" stroke="var(--landing-bg)" opacity={0}>
            <PaperAirplane cx={0} cy={0} />
          </g>
          <g id="flight-wire" stroke="var(--landing-bg)" opacity={0}>
            <WireframeAircraft cx={0} cy={0} />
          </g>
          <g id="flight-jet" stroke="var(--landing-bg)" opacity={0}>
            <JetSilhouette cx={0} cy={0} />
          </g>
          <g id="flight-rocket" stroke="var(--landing-bg)" opacity={0}>
            <RocketSilhouette cx={0} cy={0} />
          </g>
        </g>
      </svg>

      <span className="sr-only">
        Animated aviation environment: a paper airplane evolves through a
        wireframe aircraft, jet, and rocket — representing an idea maturing into
        a production-ready deployment.
      </span>
    </div>
  );
}
