import { useEffect, useRef } from 'react';
import { createTimeline, onScroll, type Timeline } from 'animejs';
import { prefersReducedMotion } from './reduced-motion';

export function useScrollTimeline<T extends HTMLElement>(
  build: (timeline: Timeline) => void,
  options?: { container?: React.RefObject<HTMLElement | null> }
) {
  const root = useRef<T>(null);
  const timeline = useRef<Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;

    const tl = createTimeline({
      autoplay: onScroll({
        target: root.current,
        container: options?.container?.current ?? undefined,
        sync: true,
      }),
    });

    build(tl);
    timeline.current = tl;

    return () => {
      timeline.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return root;
}
