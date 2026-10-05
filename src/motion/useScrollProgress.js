import { useEffect, useRef } from 'react';

/**
 * Publishes a 0..1 scroll-progress value for a scroll container as the
 * `--scroll-p` custom property.
 *
 * The window body scrolls, not the document, so a document-level scrollbar
 * progress bar would always read zero. This keeps the feedback local to the
 * window the user is actually reading.
 *
 * @returns {React.RefObject<HTMLElement>} attach to the scrolling element
 */
export function useScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let raf = 0;

    const update = () => {
      raf = 0;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 4 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      el.style.setProperty('--scroll-p', p.toFixed(4));
      el.style.setProperty('--scroll-pct', `${(p * 100).toFixed(1)}%`);
      el.style.setProperty('--scrollable', max > 4 ? '1' : '0');
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    el.addEventListener('scroll', schedule, { passive: true });

    /* Content that grows after mount (fonts swapping, images decoding, locale
       switching to a longer bundle) changes scrollHeight without firing scroll. */
    let observer = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(schedule);
      observer.observe(el);
      if (el.firstElementChild) observer.observe(el.firstElementChild);
    }

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', schedule);
      observer?.disconnect();
    };
  }, []);

  return ref;
}

export default useScrollProgress;