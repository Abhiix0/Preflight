import { PaperAirplane } from "./stage-art/PaperAirplane";
import { WireframeAircraft } from "./stage-art/WireframeAircraft";
import { Jet } from "./stage-art/Jet";
import { Rocket } from "./stage-art/Rocket";

export function StageVisual() {
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto flex items-center justify-center bg-[var(--landing-surface)]/5 rounded-3xl border border-[var(--landing-surface)]/10">
      <div className="relative w-2/3 h-2/3">
        <PaperAirplane
          className="stage-art absolute inset-0 w-full h-full text-[var(--landing-surface)]"
          data-stage="0"
          aria-hidden="true"
        />
        <WireframeAircraft
          className="stage-art absolute inset-0 w-full h-full text-[var(--landing-surface)]"
          data-stage="1"
          aria-hidden="true"
        />
        <Jet
          className="stage-art absolute inset-0 w-full h-full text-[var(--landing-surface)]"
          data-stage="2"
          aria-hidden="true"
        />
        <Rocket
          className="stage-art absolute inset-0 w-full h-full text-[var(--landing-surface)]"
          data-stage="3"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
