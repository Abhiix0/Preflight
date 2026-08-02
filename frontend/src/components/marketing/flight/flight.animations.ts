import { createTimeline, createDrawable, animate, utils } from "animejs";
import { EASE_PRIMARY } from "@/lib/animation";
import {
  PATH_POINTS,
  PATH_ANGLES,
} from "@/components/marketing/flight/FlightVisual";

/**
 * buildFlightEnvironment — entry point called by useAnimeScope.
 *
 * Architecture: multiple coordinated timelines per the brief.
 *   bgLoop      — always-on background: nav dot breathe, ring slow drift
 *   mainLoop    — the cinematic 6-stage flight sequence
 *
 * Total main loop: 18 000ms (slow, cinematic pace).
 *
 * Stage timing:
 *   S1   0      – 2500    Paper airplane fades in, ambient float
 *   S2   2200   – 8000    Flight along path, trail draws, halo follows
 *   S3   7500   – 11000   Trail evolves: construction lines emerge, decay fans
 *   S4   10500  – 13000   Landing zone reveals, aircraft morph sequence
 *   S5   12500  – 15500   Hold at destination, rocket visible, LZ pulsing
 *   S6   15000  – 18000   Everything dissolves, scene returns to empty
 *
 * Loop seam: S6 ends with all elements at opacity=0, aircraft at
 * start position. S1 fades paper airplane in from opacity=0.
 * Both boundaries are fully transparent → no flash possible.
 */

// ── Timing ────────────────────────────────────────────────────────────────
const S1 = 0;
const S2 = 2200;
const S3 = 7500;
const S4 = 10500;
const S5 = 12500;
const S6 = 15000;
const TOTAL = 18000;

const FLIGHT_DUR = S3 - S2; // 5300ms — leisurely flight
const MORPH_DUR = 600;
const MORPH_OVERLAP = 180;

// ── Background ambient loop (always-on, independent) ─────────────────────
function startBgLoop() {
  // Nav dots breathe in staggered waves — very subtle
  const dots = document.querySelectorAll<SVGCircleElement>(".nav-dot");
  dots.forEach((dot, i) => {
    animate(dot, {
      opacity: [0.07, 0.18, 0.07],
      r: [1.5, 2.2, 1.5],
      duration: 3200 + i * 340,
      ease: "inOutSine",
      loop: true,
      delay: i * 280,
    });
  });
}

// ── Main flight loop ──────────────────────────────────────────────────────
export function buildFlightEnvironment() {
  // Belt-and-suspenders: force all animated elements to resting state
  utils.set("#flight-paper, #flight-wire, #flight-jet, #flight-rocket", {
    opacity: 0,
  });
  utils.set("#flight-trail, #flight-trail-halo", { opacity: 0 });
  utils.set(
    "#fl-con-1, #fl-con-2, #fl-con-3, #fl-con-4, #fl-con-5, #fl-con-6, #fl-con-7, #fl-con-8",
    { opacity: 0 }
  );
  utils.set("#fl-decay-1, #fl-decay-2, #fl-decay-3, #fl-decay-4", {
    opacity: 0,
  });
  utils.set("#fl-lz-outer, #fl-lz-inner, #fl-lz-dot", { opacity: 0 });
  utils.set(".fl-lz-tick", { opacity: 0 });
  utils.set("#flight-aircraft", {
    translateX: PATH_POINTS[0].x,
    translateY: PATH_POINTS[0].y,
    rotate: PATH_ANGLES[0],
  });

  // Set up trail drawables
  const trailEl = document.querySelector<SVGPathElement>("#flight-trail");
  const haloEl = document.querySelector<SVGPathElement>("#flight-trail-halo");
  let trail: ReturnType<typeof createDrawable>[0] | null = null;
  let halo: ReturnType<typeof createDrawable>[0] | null = null;

  if (trailEl) {
    [trail] = createDrawable(trailEl);
    trail.draw = "0 0";
    utils.set(trailEl, { opacity: 0 });
  }
  if (haloEl) {
    [halo] = createDrawable(haloEl);
    halo.draw = "0 0";
    utils.set(haloEl, { opacity: 0 });
  }

  // Start the ambient background loop immediately
  startBgLoop();

  // ── Build main timeline ─────────────────────────────────────────────────
  const tl = createTimeline({
    loop: true,
    duration: TOTAL,
    autoplay: true,
  });

  // ──────────────────────────────────────────────────────────────────────
  // STAGE 1: Paper airplane appears, floats gently (0–2500ms)
  // ──────────────────────────────────────────────────────────────────────

  // Lock aircraft to start position at t=0
  tl.add(
    "#flight-aircraft",
    {
      translateX: PATH_POINTS[0].x,
      translateY: PATH_POINTS[0].y,
      rotate: PATH_ANGLES[0],
      duration: 1,
    },
    S1
  );

  // Paper airplane fades in
  tl.add(
    "#flight-paper",
    { opacity: [0, 1], duration: 800, ease: EASE_PRIMARY },
    S1 + 300
  );

  // Subtle float: very small translateY oscillation while at rest
  // Implemented as a 2-keyframe translate on the aircraft during the hold
  tl.add(
    "#flight-aircraft",
    {
      translateY: [PATH_POINTS[0].y, PATH_POINTS[0].y - 6, PATH_POINTS[0].y],
      duration: S2 - S1 - 400,
      ease: "inOutSine",
    },
    S1 + 700
  );

  // ──────────────────────────────────────────────────────────────────────
  // STAGE 2: Flight along full path + glow trail (2200–7500ms)
  // ──────────────────────────────────────────────────────────────────────

  // Aircraft glides along path — inOutSine for smooth deceleration
  tl.add(
    "#flight-aircraft",
    {
      translateX: PATH_POINTS.map((p) => p.x),
      translateY: PATH_POINTS.map((p) => p.y),
      rotate: PATH_ANGLES.map((a) => a),
      duration: FLIGHT_DUR,
      ease: "inOutSine",
    },
    S2
  );

  // Trail fades in shortly after takeoff
  tl.add(
    "#flight-trail",
    { opacity: [0, 0.75], duration: 600, ease: "linear" },
    S2 + 400
  );

  // Trail draws from 0→1 tracking the aircraft
  if (trail) {
    tl.add(
      trail as unknown as string,
      { draw: ["0 0", "0 1"], duration: FLIGHT_DUR - 600, ease: "linear" },
      S2 + 600
    );
  }

  // Halo appears at mid-flight for richness
  tl.add(
    "#flight-trail-halo",
    { opacity: [0, 0.3], duration: 800, ease: "linear" },
    S2 + FLIGHT_DUR * 0.3
  );
  if (halo) {
    tl.add(
      halo as unknown as string,
      {
        draw: ["0 0", "0 1"],
        duration: FLIGHT_DUR - 1200,
        ease: "linear",
      },
      S2 + 800
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // STAGE 3: Trail evolves — construction lines, decay branches (7500–10500ms)
  // ──────────────────────────────────────────────────────────────────────

  // Main trail softens
  tl.add(
    "#flight-trail",
    { opacity: [0.75, 0.2], duration: 1200, ease: "inOutSine" },
    S3
  );
  tl.add(
    "#flight-trail-halo",
    { opacity: [0.3, 0], duration: 900, ease: "linear" },
    S3 + 200
  );

  // Construction lines emerge across the scene — staggered, covering full space
  const conIds = [
    "#fl-con-5",
    "#fl-con-6", // lower — first
    "#fl-con-3",
    "#fl-con-4", // mid diagonal
    "#fl-con-1",
    "#fl-con-2", // upper
    "#fl-con-7",
    "#fl-con-8", // perpendicular marks
  ];
  conIds.forEach((id, i) => {
    tl.add(
      id,
      { opacity: [0, 0.22], duration: 500, ease: EASE_PRIMARY },
      S3 + 200 + i * 160
    );
  });

  // Decay branches fan out — very low opacity, 0.1 max
  const decayIds = ["#fl-decay-1", "#fl-decay-2", "#fl-decay-3", "#fl-decay-4"];
  decayIds.forEach((id, i) => {
    tl.add(
      id,
      { opacity: [0, 0.1], duration: 600, ease: EASE_PRIMARY },
      S3 + 800 + i * 200
    );
  });

  // ──────────────────────────────────────────────────────────────────────
  // STAGE 4: Landing zone reveals, aircraft morph begins (10500–12500ms)
  // ──────────────────────────────────────────────────────────────────────

  // Landing zone rings appear
  tl.add(
    "#fl-lz-outer",
    { opacity: [0, 0.4], duration: 600, ease: EASE_PRIMARY },
    S4
  );
  tl.add(
    "#fl-lz-inner",
    { opacity: [0, 0.35], duration: 500, ease: EASE_PRIMARY },
    S4 + 200
  );
  tl.add(
    "#fl-lz-dot",
    { opacity: [0, 0.5], duration: 400, ease: EASE_PRIMARY },
    S4 + 400
  );
  tl.add(
    ".fl-lz-tick",
    { opacity: [0, 0.25], duration: 400, ease: EASE_PRIMARY },
    S4 + 500
  );

  // Aircraft morph: paper → wire
  tl.add(
    "#flight-paper",
    { opacity: [1, 0], duration: MORPH_DUR, ease: "inOutSine" },
    S4 + 200
  );
  tl.add(
    "#flight-wire",
    { opacity: [0, 1], duration: MORPH_DUR, ease: EASE_PRIMARY },
    S4 + 200 + MORPH_DUR - MORPH_OVERLAP
  );

  // Wire → Jet
  const m2 = S4 + 200 + MORPH_DUR * 2 - MORPH_OVERLAP;
  tl.add(
    "#flight-wire",
    { opacity: [1, 0], duration: MORPH_DUR, ease: "inOutSine" },
    m2
  );
  tl.add(
    "#flight-jet",
    { opacity: [0, 1], duration: MORPH_DUR, ease: EASE_PRIMARY },
    m2 + MORPH_DUR - MORPH_OVERLAP
  );

  // ──────────────────────────────────────────────────────────────────────
  // STAGE 5: Rocket, LZ pulses, hold (12500–15000ms)
  // ──────────────────────────────────────────────────────────────────────

  // Jet → Rocket
  const m3 = S5 + 100;
  tl.add(
    "#flight-jet",
    { opacity: [1, 0], duration: MORPH_DUR, ease: "inOutSine" },
    m3
  );
  tl.add(
    "#flight-rocket",
    { opacity: [0, 1], duration: MORPH_DUR, ease: EASE_PRIMARY },
    m3 + MORPH_DUR - MORPH_OVERLAP
  );

  // Landing zone outer ring pulse — 2 gentle throbs
  tl.add(
    "#fl-lz-outer",
    { opacity: [0.4, 0.65, 0.4, 0.6, 0.4], duration: 1600, ease: "inOutSine" },
    S5 + 400
  );

  // Trail fully fades during this hold
  tl.add(
    "#flight-trail",
    { opacity: [0.2, 0], duration: 800, ease: "linear" },
    S5 + 200
  );

  // ──────────────────────────────────────────────────────────────────────
  // STAGE 6: Everything dissolves, scene returns to empty (15000–18000ms)
  // ──────────────────────────────────────────────────────────────────────
  const FADE = TOTAL - S6; // 3000ms — slow, cinematic dissolve

  tl.add(
    "#flight-rocket",
    { opacity: [1, 0], duration: FADE * 0.7, ease: "inOutSine" },
    S6
  );
  tl.add(
    "#fl-lz-outer, #fl-lz-inner, #fl-lz-dot",
    { opacity: [0.4, 0], duration: FADE * 0.6, ease: "inOutSine" },
    S6 + 200
  );
  tl.add(
    ".fl-lz-tick",
    { opacity: [0.25, 0], duration: FADE * 0.5, ease: "linear" },
    S6 + 300
  );
  tl.add(
    "#fl-con-1, #fl-con-2, #fl-con-3, #fl-con-4, #fl-con-5, #fl-con-6, #fl-con-7, #fl-con-8",
    { opacity: [0.22, 0], duration: FADE * 0.55, ease: "inOutSine" },
    S6 + 400
  );
  tl.add(
    "#fl-decay-1, #fl-decay-2, #fl-decay-3, #fl-decay-4",
    { opacity: [0.1, 0], duration: FADE * 0.4, ease: "linear" },
    S6 + 600
  );

  // Reset aircraft to start position — instantaneous at very end
  tl.add(
    "#flight-aircraft",
    {
      translateX: PATH_POINTS[0].x,
      translateY: PATH_POINTS[0].y,
      rotate: PATH_ANGLES[0],
      duration: 1,
    },
    TOTAL - 2
  );

  // Reset trail drawables
  if (trail) {
    tl.add(
      trail as unknown as string,
      { draw: ["0 1", "0 0"], duration: FADE * 0.5, ease: "linear" },
      S6
    );
  }
  if (halo) {
    tl.add(
      halo as unknown as string,
      { draw: ["0 1", "0 0"], duration: FADE * 0.4, ease: "linear" },
      S6
    );
  }
}
