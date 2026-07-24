import { animate, stagger } from 'animejs';
import { EASE_ENTRANCE, DURATION_SLOW, STAGGER_BASE } from '@/lib/animation';

export function buildHeroVisualEntrance() {
  animate('.hero-visual-panel', {
    opacity: [0, 1],
    scale: [0.96, 1],
    duration: DURATION_SLOW,
    ease: EASE_ENTRANCE,
    delay: stagger(STAGGER_BASE)
  });
}
