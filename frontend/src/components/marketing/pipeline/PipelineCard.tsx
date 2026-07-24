import { type LucideIcon } from "lucide-react";

interface PipelineCardProps {
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
  /** When true, skip animation classes and render fully visible (reduced-motion fallback) */
  static?: boolean;
}

/**
 * Reveal card for a pipeline stage.
 *
 * Resting state (pre-scroll / pre-JS): opacity-0, translateY(8px), scale(0.97)
 * These Tailwind classes are on the element at SSR time — correct even before
 * JS hydrates — satisfying the "initial state must be set before scroll" requirement.
 *
 * The animation in pipeline.animations.ts overwrites these values once the
 * scroll timeline reaches this card's segment.
 */
export function PipelineCard({
  index,
  title,
  description,
  icon: Icon,
  static: isStatic = false,
}: PipelineCardProps) {
  return (
    <div
      data-card={index}
      className={
        isStatic
          ? "pipeline-card rounded-2xl border border-(--landing-surface)/10 bg-(--landing-surface)/4 p-5 backdrop-blur-sm"
          : "pipeline-card translate-y-2 scale-[0.97] rounded-2xl border border-(--landing-surface)/10 bg-(--landing-surface)/4 p-5 opacity-0 backdrop-blur-sm"
      }
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-(--landing-surface)/10 text-(--landing-surface)">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-(--landing-surface)">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-1 text-sm font-bold text-(--landing-fg)">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-(--landing-fg-muted)">
        {description}
      </p>
    </div>
  );
}
