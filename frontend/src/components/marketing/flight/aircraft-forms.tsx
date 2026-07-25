/**
 * Aircraft silhouettes — scaled for the environment scene.
 *
 * ViewBox: 500×600. Aircraft are centred at cx/cy (registration point).
 * Bounding box: ~180×100px each — large enough to read as a visual
 * centrepiece at ~160px rendered width, not a floating speck.
 *
 * Stroke: currentColor (set by parent <g>), strokeWidth 2px.
 * Fill: none. strokeLinecap/Join: round.
 */

interface AircraftProps {
  cx: number;
  cy: number;
}

/* ── 1. Paper airplane ──────────────────────────────────────────────────── */
export function PaperAirplane({ cx, cy }: AircraftProps) {
  const w = 90; // half-length
  const h = 48; // half-height
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth={2}>
      {/* Main body triangle */}
      <path
        d={`M ${cx - w} ${cy + h * 0.6} L ${cx + w} ${cy} L ${cx - w} ${cy - h * 0.6} Z`}
      />
      {/* Lower fold crease — from nose tip back to rear-lower corner */}
      <line x1={cx + w} y1={cy} x2={cx - w * 0.25} y2={cy + h * 0.6} />
      {/* Upper wing fold — diagonal highlighting top wing plane */}
      <line x1={cx - w} y1={cy - h * 0.6} x2={cx - w * 0.25} y2={cy} />
      {/* Centre spine crease */}
      <line
        x1={cx - w * 0.25}
        y1={cy}
        x2={cx - w}
        y2={cy + h * 0.6}
        strokeOpacity={0.4}
      />
    </g>
  );
}

/* ── 2. Wireframe aircraft ──────────────────────────────────────────────── */
export function WireframeAircraft({ cx, cy }: AircraftProps) {
  const w = 92;
  const ws = 52; // wing semi-span
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth={2}>
      {/* Fuselage */}
      <line x1={cx - w} y1={cy} x2={cx + w} y2={cy} />
      {/* Nose fairing */}
      <path
        d={`M ${cx + w - 14} ${cy - 8} L ${cx + w} ${cy} L ${cx + w - 14} ${cy + 8}`}
      />
      {/* Main wings */}
      <path
        d={`M ${cx + 10} ${cy} L ${cx - 12} ${cy - ws} L ${cx - 36} ${cy} L ${cx - 12} ${cy + ws} Z`}
      />
      {/* Wing ribs */}
      <line x1={cx - 12} y1={cy - ws * 0.55} x2={cx - 32} y2={cy} />
      <line x1={cx - 12} y1={cy + ws * 0.55} x2={cx - 32} y2={cy} />
      <line x1={cx - 12} y1={cy - ws * 0.25} x2={cx - 22} y2={cy} />
      <line x1={cx - 12} y1={cy + ws * 0.25} x2={cx - 22} y2={cy} />
      {/* Vertical tail */}
      <path
        d={`M ${cx - w + 14} ${cy} L ${cx - w + 6} ${cy - 22} L ${cx - w + 32} ${cy}`}
      />
      {/* Horizontal stabiliser */}
      <path
        d={`M ${cx - w + 18} ${cy} L ${cx - w + 10} ${cy - 13} L ${cx - w + 42} ${cy}`}
      />
    </g>
  );
}

/* ── 3. Jet silhouette ──────────────────────────────────────────────────── */
export function JetSilhouette({ cx, cy }: AircraftProps) {
  const w = 96;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth={2}>
      {/* Fuselage — subtle upward curve */}
      <path d={`M ${cx - w} ${cy + 2} Q ${cx} ${cy - 10} ${cx + w} ${cy}`} />
      {/* Swept delta wing */}
      <path
        d={`M ${cx + w * 0.15} ${cy}
            L ${cx - w * 0.42} ${cy - 54}
            L ${cx - w} ${cy}
            L ${cx - w * 0.42} ${cy + 54}
            Z`}
      />
      {/* Canard fins */}
      <path
        d={`M ${cx + w * 0.55} ${cy}
            L ${cx + w * 0.3} ${cy - 18}
            L ${cx + w * 0.1} ${cy}`}
      />
      {/* Engine nacelles */}
      <ellipse
        cx={cx - w * 0.28}
        cy={cy - 28}
        rx={14}
        ry={5}
        stroke="currentColor"
      />
      <ellipse
        cx={cx - w * 0.28}
        cy={cy + 28}
        rx={14}
        ry={5}
        stroke="currentColor"
      />
      {/* Exhaust nozzle */}
      <path
        d={`M ${cx - w} ${cy - 5} L ${cx - w - 12} ${cy} L ${cx - w} ${cy + 5}`}
      />
    </g>
  );
}

/* ── 4. Rocket ──────────────────────────────────────────────────────────── */
export function RocketSilhouette({ cx, cy }: AircraftProps) {
  // Rocket is portrait-oriented, rotated by parent transform for heading
  const bh = 100; // body half-height
  const bw = 22; // body half-width
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth={2}>
      {/* Body */}
      <rect x={cx - bw / 2} y={cy - bh / 2} width={bw} height={bh} rx={3} />
      {/* Nose cone */}
      <path
        d={`M ${cx - bw / 2} ${cy - bh / 2}
            Q ${cx} ${cy - bh / 2 - 42}
            ${cx + bw / 2} ${cy - bh / 2}`}
      />
      {/* Left fin */}
      <path
        d={`M ${cx - bw / 2} ${cy + bh / 2 - 14}
            L ${cx - bw / 2 - 22} ${cy + bh / 2 + 14}
            L ${cx - bw / 2} ${cy + bh / 2}`}
      />
      {/* Right fin */}
      <path
        d={`M ${cx + bw / 2} ${cy + bh / 2 - 14}
            L ${cx + bw / 2 + 22} ${cy + bh / 2 + 14}
            L ${cx + bw / 2} ${cy + bh / 2}`}
      />
      {/* Porthole */}
      <circle cx={cx} cy={cy - bh / 2 + 30} r={7} />
      {/* Panel lines */}
      <line
        x1={cx - bw / 2}
        y1={cy - 8}
        x2={cx + bw / 2}
        y2={cy - 8}
        strokeOpacity={0.4}
      />
      <line
        x1={cx - bw / 2}
        y1={cy + 18}
        x2={cx + bw / 2}
        y2={cy + 18}
        strokeOpacity={0.4}
      />
      {/* Exhaust bell */}
      <path
        d={`M ${cx - bw / 2} ${cy + bh / 2}
            Q ${cx} ${cy + bh / 2 + 28}
            ${cx + bw / 2} ${cy + bh / 2}`}
        strokeOpacity={0.6}
      />
    </g>
  );
}
