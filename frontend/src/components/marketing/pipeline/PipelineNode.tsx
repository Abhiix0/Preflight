import { type LucideIcon } from "lucide-react";

interface PipelineNodeProps {
  index: number;
  icon: LucideIcon;
  /** When true, skip animation classes and render fully visible (reduced-motion fallback) */
  static?: boolean;
}

/**
 * Just the node marker circle — sits on the track line.
 * The section owns the two-row layout (markers row + cards row) so that
 * the SVG track can be drawn precisely through the marker centres.
 *
 * Resting state (pre-scroll):
 *   - opacity-40, scale-90 via Tailwind classes (correct before any JS)
 *   - pipeline.animations.ts uses utils.set() as belt-and-suspenders
 */
export function PipelineNode({
  index,
  icon: Icon,
  static: isStatic = false,
}: PipelineNodeProps) {
  return (
    <div
      data-node={index}
      className={
        isStatic
          ? "pipeline-node-marker relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-(--landing-surface) bg-(--landing-surface)/20 text-(--landing-surface)"
          : "pipeline-node-marker relative z-10 flex h-10 w-10 scale-90 items-center justify-center rounded-full border-2 border-(--landing-surface)/40 bg-(--landing-bg) text-(--landing-surface)/40 opacity-40"
      }
      aria-hidden="true"
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
