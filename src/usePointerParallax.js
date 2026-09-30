import { useEffect } from 'react';

/**
 * Writes pointer position as CSS variables on the target element so layers can
 * parallax off it.
 *
 * The position is written synchronously on every pointermove so the effect never
 * depends on requestAnimationFrame (which can be starved in background tabs), and
 * a rAF loop is used only to keep easing toward the last target once the pointer
 * settles. The loop parks itself when it arrives.
 */
export function usePointerParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const EASE = 0.12;
    const SETTLE = 0.0004;

    let tx = 0.5;
    let ty = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let raf = 0;
    let running = false;

    const apply = () => {
      el.style.setProperty('--px', (cx - 0.5).toFixed(4));
      el.style.setProperty('--py', (cy - 0.5).toFixed(4));
      el.style.setProperty('--mx', `${(cx * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(cy * 100).toFixed(2)}%`);
    };

    const tick = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      apply();
      if (Math.abs(tx - cx) > SETTLE || Math.abs(ty - cy) > SETTLE) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      apply();
      el.style.setProperty('--glow', '1');
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => el.style.setProperty('--glow', '0');

    apply();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
}
