import { useEffect, useRef } from 'react';
import { createVarLerp, hasFinePointer, prefersReducedMotion } from './lerp';

/**
 * Pulls its child toward the cursor while the pointer is inside it.
 *
 * Uses the standalone `translate` property rather than `transform` so a child's
 * own hover `transform` (scale, lift) keeps composing instead of being
 * overwritten. Nothing here touches React state — pointer movement only writes
 * two custom properties.
 */
export default function Magnetic({
  as: Tag = 'div',
  strength = 0.3,
  radius = 1.15,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return undefined;

    const lerp = createVarLerp(el, ['--mag-x', '--mag-y'], {
      ease: 0.18,
      format: (_key, n) => `${n.toFixed(2)}px`,
    });

    /* Measured once and reused, for the same reason as TiltCard: a rect read per
       pointermove flushes pending layout on every single event. */
    let box = el.getBoundingClientRect();
    const measure = () => {
      box = el.getBoundingClientRect();
    };

    const onMove = (e) => {
      if (!box.width || !box.height) return;
      /* Work in normalised space (-1..1 from the centre) so the pull feels
         identical on a 40px taskbar button and a 400px card. */
      const nx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const ny = (e.clientY - (box.top + box.height / 2)) / (box.height / 2);
      const inside = Math.hypot(nx, ny) < radius * 1.42;
      if (!inside) {
        lerp.to({ '--mag-x': 0, '--mag-y': 0 });
        return;
      }
      /* Clamp the diagonal so corner-hover does not fling the element further
         than edge-hover. */
      const cx = Math.max(-1, Math.min(1, nx));
      const cy = Math.max(-1, Math.min(1, ny));
      lerp.to({
        '--mag-x': cx * box.width * strength * 0.5,
        '--mag-y': cy * box.height * strength * 0.5,
      });
    };

    const onLeave = () => lerp.to({ '--mag-x': 0, '--mag-y': 0 });

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      lerp.destroy();
    };
  }, [strength, radius]);

  return (
    <Tag ref={ref} className={`magnetic ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}