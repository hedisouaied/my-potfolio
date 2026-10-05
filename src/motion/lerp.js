/** True when the user has asked the OS to minimise animation. Every decorative
 *  effect in the system checks this, because CSS alone cannot stop a rAF loop or
 *  prevent an IntersectionObserver from hiding content forever. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True when a real hovering cursor is available.
 *
 * `pointermove` fires for touch drags too, so the cursor-reactive components
 * (tilt, magnetic) would otherwise latch to full deflection as a finger slides
 * off and stay there — with no hover state on touch to explain it. The CSS
 * mirrors this under `@media (hover: none), (pointer: coarse)`; this is the JS
 * half, which avoids attaching a listener and a rAF loop per card for nothing.
 */
export function hasFinePointer() {
  return (
    typeof window !== 'undefined' && !window.matchMedia('(hover: none), (pointer: coarse)').matches
  );
}

/**
 * Eases a set of numeric CSS custom properties toward a target, driven by pointer
 * events, and parks its rAF loop the moment everything settles.
 *
 * Two reasons this exists instead of a per-component rAF loop:
 *  - magnetic pull, 3D tilt and sheen all want the same "ease toward target,
 *    write one batch of custom properties, then stop" behaviour;
 *  - writing custom properties directly keeps React out of the hot path, so
 *    pointer movement never triggers a re-render.
 *
 * @param {HTMLElement} el target element
 * @param {string[]} props custom property names to drive
 * @param {{ease?: number, settle?: number, format?: (key: string, n: number) => string}} [opts]
 */
export function createVarLerp(el, props, opts = {}) {
  const { ease = 0.14, settle = 0.0015, format = (_key, n) => n.toFixed(3) } = opts;

  const current = {};
  const target = {};
  for (const key of props) {
    current[key] = 0;
    target[key] = 0;
  }

  let raf = 0;
  let running = false;

  const apply = () => {
    for (const key of props) el.style.setProperty(key, format(key, current[key]));
  };

  const tick = () => {
    let moving = false;
    for (const key of props) {
      const delta = target[key] - current[key];
      if (Math.abs(delta) > settle) {
        current[key] += delta * ease;
        moving = true;
      } else {
        current[key] = target[key];
      }
    }
    apply();
    if (moving) {
      raf = requestAnimationFrame(tick);
    } else {
      running = false;
    }
  };

  return {
    /** Queue a new target; the loop wakes itself if it was parked. */
    to(next) {
      Object.assign(target, next);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    },
    /** Jump straight to a target with no easing (used for teardown/reset). */
    reset() {
      for (const key of props) {
        target[key] = 0;
        current[key] = 0;
      }
      apply();
    },
    destroy() {
      cancelAnimationFrame(raf);
      running = false;
    },
  };
}