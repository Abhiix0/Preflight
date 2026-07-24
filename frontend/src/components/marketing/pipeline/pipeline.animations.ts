import { utils, type Timeline } from "animejs";
import { createDrawable } from "animejs";
import {
  EASE_ENTRANCE,
  DURATION_BASE,
  DURATION_FAST,
} from "@/lib/animation";

/**
 * Pipeline animation timeline — all scroll-scrubbed.
 *
 * Timeline layout (total = 4 segments × SEGMENT_DURATION):
 *
 *   Segment 0  (0    → S)   : Repo node activates → line[0] draws → Scanning node activates → Repo card reveals
 *   Segment 1  (S    → 2S)  : Scanning card reveals → line[1] draws → Analysis node activates
 *   Segment 2  (2S   → 3S)  : Analysis card reveals → line[2] draws → Report node activates
 *   Segment 3  (3S   → 4S)  : Report card reveals → line[3] draws → Deploy node activates → Deploy card reveals
 *
 * Deploy only reachable at offset 3*SEGMENT = 3000 — explicitly gated.
 *
 * Initial state contract (belt-and-suspenders):
 *   Tailwind classes on PipelineNode/PipelineCard already set the resting
 *   state in HTML. utils.set() calls below re-enforce those values
 *   synchronously at timeline-build time (before any scroll).
 *
 * Scroll behaviour: sync:true (set in useScrollTimeline) means the
 * timeline position directly mirrors scroll progress — scrubbing
 * backwards correctly reverses all states.
 */

const SEGMENT = 1000; // duration units per segment (maps to scroll distance via onScroll sync)
const OVERLAP = 200;  // how early the next node activates relative to segment end

export function buildPipelineTimeline(timeline: Timeline) {
  // ─── Belt-and-suspenders: force resting state before any scroll ──────────
  // (Tailwind classes already do this in HTML; utils.set() ensures JS
  // overrides from a previous timeline.revert() can't leave stale values.)
  utils.set(".pipeline-node-marker", {
    opacity: 0.4,
    scale: 0.9,
    borderColor: "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
    backgroundColor: "var(--landing-bg)",
    color: "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
  });
  utils.set(".pipeline-card", {
    opacity: 0,
    translateY: 8,
    scale: 0.97,
  });
  utils.set(".pipeline-segment", {
    opacity: 0,
  });
  utils.set(".pipeline-particle", {
    opacity: 0,
  });

  // ─── Set up drawables for each connecting segment ─────────────────────────
  // The SVG lines are rendered with class "pipeline-segment" and data-seg="N".
  // We grab them here and set draw to '0 0' (fully hidden).
  const segmentEls = document.querySelectorAll<SVGLineElement>(".pipeline-segment");
  const drawables = Array.from(segmentEls).map((el) => {
    utils.set(el, { opacity: 1 }); // make visible now that drawable controls it
    const [drawable] = createDrawable(el);
    drawable.draw = "0 0";
    return drawable;
  });

  // ─── Segment 0: Repository activates → line draws → Scanning activates ───
  const s0 = 0;

  // Repository node: activate
  timeline.add("[data-node='0']", {
    opacity: [0.4, 1],
    scale: [0.9, 1],
    borderColor: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    backgroundColor: [
      "var(--landing-bg)",
      "color-mix(in srgb, var(--landing-surface) 20%, transparent)",
    ],
    color: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    duration: DURATION_FAST,
    ease: EASE_ENTRANCE,
  }, s0);

  // Repository card: reveal
  timeline.add("[data-card='0']", {
    opacity: [0, 1],
    translateY: [8, 0],
    scale: [0.97, 1],
    duration: DURATION_BASE,
    ease: EASE_ENTRANCE,
  }, s0 + DURATION_FAST);

  // Segment 0 line draw
  if (drawables[0]) {
    timeline.add(drawables[0], {
      draw: ["0 0", "0 1"],
      duration: SEGMENT - OVERLAP,
      ease: "linear",
    }, s0 + DURATION_BASE);
  }

  // Segment 0 particle
  timeline.add("[data-particle='0']", {
    opacity: [0, 1, 1, 0],
    duration: SEGMENT - OVERLAP,
    ease: "linear",
  }, s0 + DURATION_BASE);

  // ─── Segment 1: Scanning activates → line draws → Analysis activates ─────
  const s1 = SEGMENT;

  // Scanning node: activate
  timeline.add("[data-node='1']", {
    opacity: [0.4, 1],
    scale: [0.9, 1],
    borderColor: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    backgroundColor: [
      "var(--landing-bg)",
      "color-mix(in srgb, var(--landing-surface) 20%, transparent)",
    ],
    color: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    duration: DURATION_FAST,
    ease: EASE_ENTRANCE,
  }, s1 - OVERLAP);

  // Scanning card: reveal
  timeline.add("[data-card='1']", {
    opacity: [0, 1],
    translateY: [8, 0],
    scale: [0.97, 1],
    duration: DURATION_BASE,
    ease: EASE_ENTRANCE,
  }, s1);

  // Segment 1 line draw
  if (drawables[1]) {
    timeline.add(drawables[1], {
      draw: ["0 0", "0 1"],
      duration: SEGMENT - OVERLAP,
      ease: "linear",
    }, s1 + DURATION_BASE);
  }

  // Segment 1 particle
  timeline.add("[data-particle='1']", {
    opacity: [0, 1, 1, 0],
    duration: SEGMENT - OVERLAP,
    ease: "linear",
  }, s1 + DURATION_BASE);

  // ─── Segment 2: Analysis activates → line draws → Report activates ────────
  const s2 = SEGMENT * 2;

  // Analysis node: activate
  timeline.add("[data-node='2']", {
    opacity: [0.4, 1],
    scale: [0.9, 1],
    borderColor: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    backgroundColor: [
      "var(--landing-bg)",
      "color-mix(in srgb, var(--landing-surface) 20%, transparent)",
    ],
    color: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    duration: DURATION_FAST,
    ease: EASE_ENTRANCE,
  }, s2 - OVERLAP);

  // Analysis card: reveal
  timeline.add("[data-card='2']", {
    opacity: [0, 1],
    translateY: [8, 0],
    scale: [0.97, 1],
    duration: DURATION_BASE,
    ease: EASE_ENTRANCE,
  }, s2);

  // Segment 2 line draw
  if (drawables[2]) {
    timeline.add(drawables[2], {
      draw: ["0 0", "0 1"],
      duration: SEGMENT - OVERLAP,
      ease: "linear",
    }, s2 + DURATION_BASE);
  }

  // Segment 2 particle
  timeline.add("[data-particle='2']", {
    opacity: [0, 1, 1, 0],
    duration: SEGMENT - OVERLAP,
    ease: "linear",
  }, s2 + DURATION_BASE);

  // ─── Segment 3: Report activates → line draws → Deploy activates ──────────
  // Deploy is at offset 3*SEGMENT + extras — ONLY reachable once segments 0-2 complete.
  const s3 = SEGMENT * 3;

  // Report node: activate
  timeline.add("[data-node='3']", {
    opacity: [0.4, 1],
    scale: [0.9, 1],
    borderColor: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    backgroundColor: [
      "var(--landing-bg)",
      "color-mix(in srgb, var(--landing-surface) 20%, transparent)",
    ],
    color: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    duration: DURATION_FAST,
    ease: EASE_ENTRANCE,
  }, s3 - OVERLAP);

  // Report card: reveal
  timeline.add("[data-card='3']", {
    opacity: [0, 1],
    translateY: [8, 0],
    scale: [0.97, 1],
    duration: DURATION_BASE,
    ease: EASE_ENTRANCE,
  }, s3);

  // Segment 3 line draw — leads to Deploy
  if (drawables[3]) {
    timeline.add(drawables[3], {
      draw: ["0 0", "0 1"],
      duration: SEGMENT - OVERLAP,
      ease: "linear",
    }, s3 + DURATION_BASE);
  }

  // Segment 3 particle
  timeline.add("[data-particle='3']", {
    opacity: [0, 1, 1, 0],
    duration: SEGMENT - OVERLAP,
    ease: "linear",
  }, s3 + DURATION_BASE);

  // Deploy node: activate — gated at s3 + DURATION_BASE + (SEGMENT - OVERLAP)
  // i.e. timeline position = 3*SEGMENT + DURATION_BASE + SEGMENT - OVERLAP
  //                        = 4*SEGMENT + DURATION_BASE - OVERLAP
  // This is strictly after all 4 preceding segments complete.
  const deployAt = s3 + DURATION_BASE + (SEGMENT - OVERLAP) - OVERLAP;

  timeline.add("[data-node='4']", {
    opacity: [0.4, 1],
    scale: [0.9, 1],
    borderColor: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    backgroundColor: [
      "var(--landing-bg)",
      "color-mix(in srgb, var(--landing-surface) 20%, transparent)",
    ],
    color: [
      "color-mix(in srgb, var(--landing-surface) 40%, transparent)",
      "var(--landing-surface)",
    ],
    duration: DURATION_FAST,
    ease: EASE_ENTRANCE,
  }, deployAt);

  // Deploy card: reveal
  timeline.add("[data-card='4']", {
    opacity: [0, 1],
    translateY: [8, 0],
    scale: [0.97, 1],
    duration: DURATION_BASE,
    ease: EASE_ENTRANCE,
  }, deployAt + DURATION_FAST);
}
