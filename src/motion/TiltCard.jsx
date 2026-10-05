import { useEffect, useRef } from 'react';
import { createVarLerp, hasFinePointer, prefersReducedMotion } from './lerp';

/**
 * A surface that tilts in 3D toward the cursor and carries a specular sheen that
 * tracks the pointer.
 *
 * Everything is expressed as custom properties consumed by `.tilt` / `.project-sheen`:
 *   --tilt-x / --tilt-y   rotation in degrees (pointer offsets from centre)
 *   --sheen-x / --sheen-y pointer position in percent, for the radial highlight
 *   --tilt-glow           0..1 pointer proximity, drives border, shadow and sheen
 *   --tilt-scale          resting scale multiplier
 *
 * The rotation is applied by CSS as `perspective(...) rotateX() rotateY()` on this
 * same element, so there is no wrapper and no `preserve-3d` requirement.
 */
export default function TiltCard({
  as: Tag = 'div',
  max = 7,
  scale = 1.014,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return undefined;

    const lerp = createVarLerp(el, ['--tilt-x', '--tilt-y', '--sheen-x', '--sheen-y', '--tilt-glow'], {
      ease: 0.12,
      format: (key, n) => (key === '--sheen-x' || key === '--sheen-y' ? `${n.toFixed(1)}%` : n.toFixed(3)),
    });

    const REST = { '--tilt-x': 0, '--tilt-y': 0, '--sheen-x': 50, '--sheen-y': 50, '--tilt-glow': 0 };

    /* Measured once and reused.

       `getBoundingClientRect()` forces a synchronous layout, and calling it on
       every pointermove means each move flushes pending style work. The card is
       stationary, so one measurement per scroll/resize is enough — the rect is
       invalidated whenever the page could have shifted underneath it. */
    let box = el.getBoundingClientRect();
    const measure = () => {
      box = el.getBoundingClientRect();
    };

    const onMove = (e) => {
      if (!box.width || !box.height) return;
      const px = e.clientX - box.left;
      const py = e.clientY - box.top;
      const nx = px / box.width - 0.5;
      const ny = py / box.height - 0.5;

      lerp.to({
        /* Invert Y: pushing the top of the card away is what reads as "physical". */
        '--tilt-x': nx * max * -2,
        '--tilt-y': ny * max * -2,
        '--sheen-x': (px / box.width) * 100,
        '--sheen-y': (py / box.height) * 100,
        '--tilt-glow': 1,
      });
    };

    const onLeave = () => lerp.to(REST);

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
  }, [max]);

  /* `style` is merged last on purpose. Callers (notably `RevealGroup`) spread a
     `style` containing `--i`, and putting our own before `{...rest}` would let
     that object replace `--tilt-scale` outright instead of merging with it. */
  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`.trim()}
      {...rest}
      style={{ '--tilt-scale': scale, ...style }}
    >
      {children}
    </Tag>
  );
}