import { animate } from "animejs";
import {
  EASE_PRIMARY,
  EASE_ENTRANCE,
  DURATION_SLOW,
  STAGGER_BASE,
} from "@/lib/animation";
import { GAUGE_ARC_LENGTH, GAUGE_FINAL_OFFSET } from "./HeroVisual";

/**
 * Gauge entrance: arc sweeps from 0-progress to final score value,
 * then transitions into a continuous ambient pulse loop.
 *
 * Called by useAnimeScope inside HeroVisual — runs once on mount.
 * No-ops automatically when prefers-reduced-motion is active
 * (useAnimeScope bails early; globals.css sets the final CSS state instead).
 */
export function buildGaugeEntrance() {
  // ── 1. Arc sweep (one-shot, DURATION_SLOW, outExpo settle) ────────────────
  animate(".gauge-arc", {
    strokeDashoffset: [GAUGE_ARC_LENGTH, GAUGE_FINAL_OFFSET],
    duration: DURATION_SLOW,
    ease: EASE_PRIMARY,
    // On complete → start ambient loop
    onComplete: startAmbientLoop,
  });

  // ── 2. Glow ring fade in alongside the sweep ──────────────────────────────
  animate(".gauge-glow", {
    opacity: [0, 1],
    duration: DURATION_SLOW,
    ease: EASE_ENTRANCE,
    delay: STAGGER_BASE * 2,
  });
}

/**
 * Ambient loop: subtle opacity breathe on the glow ring.
 * Small amplitude (0.6→1.0), long period (2.4 s) — background presence,
 * not attention-grabbing. Runs indefinitely, does NOT re-run the sweep.
 */
function startAmbientLoop() {
  animate(".gauge-glow", {
    opacity: [1, 0.4, 1],
    duration: 2400,
    ease: "inOutSine",
    loop: true,
  });

  // Also a very subtle scale breathe on the whole gauge root
  animate(".gauge-ring", {
    scale: [1, 1.015, 1],
    duration: 3200,
    ease: "inOutSine",
    loop: true,
  });
}
