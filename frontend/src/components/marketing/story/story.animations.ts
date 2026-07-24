import { type Timeline } from 'animejs';

export function buildStoryTimeline(timeline: Timeline) {
  const duration = 1000;
  const ease = 'linear'; // Scrubbed timelines map scroll linearly
  
  // Transition 0 -> 1
  timeline.add('.stage-art[data-stage="0"]', { opacity: [1, 0], scale: [1, 1.05], duration, ease }, 0);
  timeline.add('.stage-text[data-stage="0"]', { opacity: [1, 0], translateY: [0, -20], duration, ease }, 0);
  timeline.add('.stage-art[data-stage="1"]', { opacity: [0, 1], scale: [0.95, 1], duration, ease }, 0);
  timeline.add('.stage-text[data-stage="1"]', { opacity: [0, 1], translateY: [20, 0], duration, ease }, 0);

  // Transition 1 -> 2
  timeline.add('.stage-art[data-stage="1"]', { opacity: [1, 0], scale: [1, 1.05], duration, ease }, duration);
  timeline.add('.stage-text[data-stage="1"]', { opacity: [1, 0], translateY: [0, -20], duration, ease }, duration);
  timeline.add('.stage-art[data-stage="2"]', { opacity: [0, 1], scale: [0.95, 1], duration, ease }, duration);
  timeline.add('.stage-text[data-stage="2"]', { opacity: [0, 1], translateY: [20, 0], duration, ease }, duration);

  // Transition 2 -> 3
  timeline.add('.stage-art[data-stage="2"]', { opacity: [1, 0], scale: [1, 1.05], duration, ease }, duration * 2);
  timeline.add('.stage-text[data-stage="2"]', { opacity: [1, 0], translateY: [0, -20], duration, ease }, duration * 2);
  timeline.add('.stage-art[data-stage="3"]', { opacity: [0, 1], scale: [0.95, 1], duration, ease }, duration * 2);
  timeline.add('.stage-text[data-stage="3"]', { opacity: [0, 1], translateY: [20, 0], duration, ease }, duration * 2);
}
