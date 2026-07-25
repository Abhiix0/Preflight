import { animate } from "animejs";
import {
  EASE_PRIMARY,
  EASE_ENTRANCE,
  DURATION_SLOW,
  STAGGER_BASE,
} from "@/lib/animation";
import {
  GAUGE_ARC_LENGTH,
  GAUGE_FINAL_OFFSET,
  ORBIT_DURATION,
} from "./HeroVisual";

/**
 * buildGaugeEntrance — called once by useAnimeScope inside HeroVisual.
 *
 * Sequence:
 *   1. Radar sweep: continuous clockwise rotation (cosmetic, always-on)
 *   2. Orbit container: continuous clockwise rotation, 64s per revolution
 *   3. Orbit dot-inner: counter-rotation on each dot to keep labels upright
 *   4. Arc sweep: one-shot settle, then fires startAmbientLoop
 *   5. Glow ring: fade-in alongside sweep
 *
 * No-ops under prefers-reduced-motion (useAnimeScope bails early).
 * globals.css stops orbit/dot-inner animations and shows labels statically.
 *
 * Counter-rotation math:
 *   Container rotates +360° over ORBIT_DURATION.
 *   Each dot-inner must rotate -360° over the same duration to cancel out.
 *   Initial value = -startDeg (already set in JSX inline style).
 *   Target = -startDeg - 360 (net: the label stays upright through a full orbit).
 */
export function buildGaugeEntrance() {
  // ── 1. Radar sweep ─────────────────────────────────────────────────────────
  animate(".radar-sweep", {
    rotate: [0, 360],
    duration: 6000,
    ease: "linear",
    loop: true,
  });

  // ── 2. Orbit container: one-way continuous rotation ────────────────────────
  animate(".orbit-container", {
    rotate: [0, 360],
    duration: ORBIT_DURATION,
    ease: "linear",
    loop: true,
  });

  // ── 3. Counter-rotate each dot-inner to keep labels upright ────────────────
  // Each dot has a different startDeg; we target them individually so the
  // from value is correct per dot.
  document.querySelectorAll<HTMLElement>("[data-orbit-dot]").forEach((el) => {
    const startDeg = Number(el.dataset.startDeg ?? 0);
    animate(el, {
      rotate: [-startDeg, -startDeg - 360],
      duration: ORBIT_DURATION,
      ease: "linear",
      loop: true,
    });
  });

  // ── 4. Arc sweep: one-shot ─────────────────────────────────────────────────
  animate(".gauge-arc", {
    strokeDashoffset: [GAUGE_ARC_LENGTH, GAUGE_FINAL_OFFSET],
    duration: DURATION_SLOW,
    ease: EASE_PRIMARY,
    onComplete: startAmbientLoop,
  });

  // ── 5. Glow fade-in ────────────────────────────────────────────────────────
  animate(".gauge-glow", {
    opacity: [0, 1],
    duration: DURATION_SLOW,
    ease: EASE_ENTRANCE,
    delay: STAGGER_BASE * 2,
  });
}

/**
 * Ambient loop — fires once after arc sweep completes.
 * Glow opacity breathe + micro scale on the ring wrapper.
 * Never re-runs the arc sweep.
 */
function startAmbientLoop() {
  animate(".gauge-glow", {
    opacity: [1, 0.35, 1],
    duration: 2400,
    ease: "inOutSine",
    loop: true,
  });

  animate(".gauge-ring", {
    scale: [1, 1.012, 1],
    duration: 3200,
    ease: "inOutSine",
    loop: true,
  });
}
