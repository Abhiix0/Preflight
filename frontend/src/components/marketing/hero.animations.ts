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
import { prefersReducedMotion } from "@/lib/animation";

/**
 * buildGaugeEntrance — called once by useAnimeScope inside HeroVisual.
 *
 * Animation sequence:
 *   1. Radar sweep — continuous clockwise rotation loop
 *   2. Orbit container — continuous clockwise rotation loop (64s/rev)
 *   3. Per-dot counter-rotation — keeps labels upright throughout orbit
 *   4. Arc sweep — one-shot settle to final dashoffset
 *   5. Glow fade-in — alongside sweep
 *   6. Ambient loops — fire after arc sweep completes
 *   7. Parallax — pointermove listener on the hero right zone (desktop only)
 *
 * Counter-rotation fix:
 *   .orbit-dot-inner has translate(-50%,-50%) as a Tailwind CSS class and
 *   rotate(startDeg) as an inline style. Anime.js animates `rotate` which
 *   writes to the inline style's individual transform component — in modern
 *   browsers (Chrome 104+, Firefox 103+) individual transform properties
 *   (translate, rotate, scale) and the shorthand `transform` are independent.
 *   Since Tailwind uses `transform: translate...` shorthand and Anime.js uses
 *   the `rotate` property (CSS individual transform), they do not conflict.
 *
 * Parallax:
 *   Drives .parallax-layer transform: translate(x, y) on pointermove within
 *   the hero section's right zone. Max offset ±10px. rAF-throttled.
 *   Resets to (0,0) on pointerleave. No-op on touch / prefers-reduced-motion.
 */
export function buildGaugeEntrance() {
  // ── 1. Radar sweep ────────────────────────────────────────────────────────
  animate(".radar-sweep", {
    rotate: [0, 360],
    duration: 6000,
    ease: "linear",
    loop: true,
  });

  // ── 2. Orbit container ────────────────────────────────────────────────────
  animate(".orbit-container", {
    rotate: [0, 360],
    duration: ORBIT_DURATION,
    ease: "linear",
    loop: true,
  });

  // ── 3. Per-dot counter-rotation ───────────────────────────────────────────
  // Target each .orbit-dot-inner individually so we can seed the from-value
  // correctly per dot (each starts at a different counter-rotation angle).
  document.querySelectorAll<HTMLElement>("[data-orbit-dot]").forEach((el) => {
    const startDeg = Number(el.dataset.startDeg ?? 0);
    animate(el, {
      rotate: [-startDeg, -startDeg - 360],
      duration: ORBIT_DURATION,
      ease: "linear",
      loop: true,
    });
  });

  // ── 4. Arc sweep ──────────────────────────────────────────────────────────
  animate(".gauge-arc", {
    strokeDashoffset: [GAUGE_ARC_LENGTH, GAUGE_FINAL_OFFSET],
    duration: DURATION_SLOW,
    ease: EASE_PRIMARY,
    onComplete: startAmbientLoop,
  });

  // ── 5. Glow fade-in ───────────────────────────────────────────────────────
  animate(".gauge-glow", {
    opacity: [0, 1],
    duration: DURATION_SLOW,
    ease: EASE_ENTRANCE,
    delay: STAGGER_BASE * 2,
  });

  // ── 6. Parallax setup ─────────────────────────────────────────────────────
  setupParallax();
}

/**
 * Ambient loop — fires once after arc sweep completes.
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

/**
 * Mouse-parallax for the hero right zone (desktop / pointer:fine only).
 *
 * Finds the hero section, attaches a rAF-throttled pointermove listener.
 * Maps cursor position within the element to a ±10px translate on
 * .parallax-layer. Resets to (0,0) on pointerleave.
 *
 * Entirely skipped under prefers-reduced-motion or on touch devices.
 * Default translate(0px, 0px) on .parallax-layer ensures no jump
 * on first interaction.
 */
function setupParallax() {
  // Skip on touch or reduced-motion
  if (prefersReducedMotion()) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  // The hero section is the closest section ancestor of .gauge-root.
  // We attach the listener to the visual column's parent (the section)
  // but only respond when the pointer is in the right half.
  const section = document.querySelector<HTMLElement>("section.relative");
  const layer = document.querySelector<HTMLElement>(".parallax-layer");
  if (!section || !layer) return;

  const MAX_OFFSET = 10; // px
  let rafId = 0;
  let active = false;

  const onMove = (e: PointerEvent) => {
    if (rafId) return; // already scheduled
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      if (!active) return;
      const rect = section.getBoundingClientRect();
      // Normalise cursor to [-1, 1] within the section bounds
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const tx = nx * MAX_OFFSET;
      const ty = ny * MAX_OFFSET;
      // Write directly — no Anime.js per-frame to avoid fighting orbit loop
      layer.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  };

  const onEnter = () => {
    active = true;
  };

  const onLeave = () => {
    active = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
    // Smooth reset
    animate(layer, {
      translateX: 0,
      translateY: 0,
      duration: 600,
      ease: "outExpo",
    });
  };

  section.addEventListener("pointerenter", onEnter, { passive: true });
  section.addEventListener("pointermove", onMove, { passive: true });
  section.addEventListener("pointerleave", onLeave, { passive: true });
}
