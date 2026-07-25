import { animate } from "animejs";
import {
  EASE_PRIMARY,
  EASE_ENTRANCE,
  DURATION_SLOW,
  STAGGER_BASE,
} from "@/lib/animation";
import { GAUGE_ARC_LENGTH, GAUGE_FINAL_OFFSET } from "./HeroVisual";

/**
 * buildGaugeEntrance — called by useAnimeScope inside HeroVisual.
 *
 * Sequence:
 *   1. Radar sweep starts immediately (continuous rotation loop)
 *   2. Badge float loops start immediately (staggered, continuous)
 *   3. Arc sweeps from 0 → final offset (one-shot, DURATION_SLOW)
 *   4. On arc complete → ambient glow pulse + scale breathe loops begin
 *
 * All animations are no-ops when prefers-reduced-motion is active
 * (useAnimeScope bails early). globals.css handles the static final
 * state for the gauge arc; radar/badges render at their default
 * positions which are already sensible (rotate(0), translateY(0)).
 */
export function buildGaugeEntrance() {
  // ── 1. Radar sweep: continuous clockwise rotation ─────────────────────────
  // Starts from rotate(0deg) — the element's CSS default — so no jump.
  animate(".radar-sweep", {
    rotate: [0, 360],
    duration: 6000,
    ease: "linear",
    loop: true,
  });

  // ── 2. Badge float loops (staggered, independent per badge) ───────────────
  // Small translateY amplitude (±6px), long-ish period per badge.
  // Each badge floats at its own cadence via individual animate calls
  // seeded by data-badge-index delay.
  const FLOAT_PERIODS = [2800, 3400, 3100]; // ms per badge — slightly different cadences
  const FLOAT_DELAYS = [0, 400, 200];

  document.querySelectorAll<HTMLElement>(".badge-pill").forEach((el, i) => {
    animate(el, {
      translateY: [0, -6, 0],
      duration: FLOAT_PERIODS[i] ?? 3000,
      ease: "inOutSine",
      loop: true,
      delay: FLOAT_DELAYS[i] ?? 0,
    });
  });

  // ── 3. Arc sweep: one-shot settle ─────────────────────────────────────────
  animate(".gauge-arc", {
    strokeDashoffset: [GAUGE_ARC_LENGTH, GAUGE_FINAL_OFFSET],
    duration: DURATION_SLOW,
    ease: EASE_PRIMARY,
    onComplete: startAmbientLoop,
  });

  // ── 4. Glow ring fade in alongside the sweep ─────────────────────────────
  animate(".gauge-glow", {
    opacity: [0, 1],
    duration: DURATION_SLOW,
    ease: EASE_ENTRANCE,
    delay: STAGGER_BASE * 2,
  });
}

/**
 * Ambient loop — fires once after the arc sweep completes.
 * Opacity breathe on glow ring + micro scale on the ring wrapper.
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
