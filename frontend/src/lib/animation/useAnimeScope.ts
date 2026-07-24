import { useEffect, useRef } from 'react';
import { createScope, type Scope } from 'animejs';
import { prefersReducedMotion } from './reduced-motion';

export function useAnimeScope<T extends HTMLElement>(
  setup: (self?: Scope) => void,
  deps: React.DependencyList = []
) {
  const root = useRef<T>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;

    scope.current = createScope({ root: root.current }).add(setup);

    return () => scope.current?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}
