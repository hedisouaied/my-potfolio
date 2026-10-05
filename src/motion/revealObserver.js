import { prefersReducedMotion } from './lerp';

/**
 * One IntersectionObserver for every reveal on the page.
 *
 * App windows can hold 40+ individual reveal targets (chips, timeline rows,
 * project cards). Giving each its own observer means 40 callbacks firing on the
 * same scroll frame. A single shared observer batches them into one.
 *
 * `root` is intentionally left as the viewport: IntersectionObserver clips against
 * ancestor overflow anyway, so an element scrolled out of view inside `.win-body`
 * is still correctly reported as not intersecting.
 */

let observer = null;
const pending = new WeakMap();

const ROOT_MARGIN = '0px 0px -10% 0px';
const THRESHOLD = 0.01;

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const fire = pending.get(entry.target);
        if (fire) {
          // Reveals are one-shot: stop observing immediately so scrolling back up
          // never re-hides content the user has already read.
          pending.delete(entry.target);
          observer.unobserve(entry.target);
          fire();
        }
      }
    },
    { rootMargin: ROOT_MARGIN, threshold: THRESHOLD }
  );
  return observer;
}

/**
 * Calls `onEnter` the first time `el` scrolls into view.
 * @returns {() => void} cleanup
 */
export function observeReveal(el, onEnter) {
  if (!el) return undefined;

  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    onEnter();
    return undefined;
  }

  const obs = ensureObserver();
  if (!obs) {
    onEnter();
    return undefined;
  }

  pending.set(el, onEnter);
  obs.observe(el);

  return () => {
    pending.delete(el);
    obs.unobserve(el);
  };
}