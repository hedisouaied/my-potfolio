import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

/* far -> near: nearer stars are bigger, brighter, drift faster and react more to the pointer */
const LAYERS = [
  { share: 0.44, depth: 0.16, r: [0.7, 1.25], a: [0.38, 0.62], drift: 0.0016 },
  { share: 0.34, depth: 0.42, r: [1.0, 1.9], a: [0.55, 0.85], drift: 0.0032 },
  { share: 0.22, depth: 0.8, r: [1.6, 2.9], a: [0.75, 1], drift: 0.006 },
];

const TINTS = [
  [255, 255, 255],
  [214, 244, 255],
  [198, 186, 255],
];

const INFLUENCE = 185; /* px radius of pointer push */
const PUSH = 44; /* px of max displacement */
const PARALLAX = 96; /* px of layer shift at full deflection */
const SPRITE = 48;
const CORE = 8; /* sprite is drawn at radius * CORE, its solid core is a fraction of that */

function makeSprite([r, g, b]) {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE;
  const ctx = c.getContext('2d');
  const half = SPRITE / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  grad.addColorStop(0.18, `rgba(${r}, ${g}, ${b}, 0.62)`);
  grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.14)`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sprites = TINTS.map(makeSprite);

    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf = 0;
    let time = 0;
    let last = 0;

    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;

    const stars = [];
    const area = w * h;
    const total = Math.round(Math.min(140, Math.max(42, area / 9000)));

    LAYERS.forEach((layer, li) => {
      const count = li === LAYERS.length - 1 ? total - stars.length : Math.round(total * layer.share);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * TAU;
        const speed = layer.drift * (0.4 + Math.random());
        stars.push({
          x: Math.random(),
          y: Math.random(),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: layer.r[0] + Math.random() * (layer.r[1] - layer.r[0]),
          a: layer.a[0] + Math.random() * (layer.a[1] - layer.a[0]),
          depth: layer.depth,
          phase: Math.random() * TAU,
          rate: 0.5 + Math.random() * 1.4,
          tint: (Math.random() * 100 < 76 ? 0 : 1) + (Math.random() < 0.22 ? 1 : 0),
          ox: 0,
          oy: 0,
        });
      }
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (dt) => {
      ctx.clearRect(0, 0, w, h);

      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;

      const parX = -(mx - 0.5) * PARALLAX;
      const parY = -(my - 0.5) * PARALLAX;
      const curX = mx * w;
      const curY = my * h;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!reduced) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (s.x < -0.06) s.x = 1.06;
          else if (s.x > 1.06) s.x = -0.06;
          if (s.y < -0.06) s.y = 1.06;
          else if (s.y > 1.06) s.y = -0.06;
        }

        const px = s.x * w + parX * s.depth;
        const py = s.y * h + parY * s.depth;

        let tox = 0;
        let toy = 0;
        if (!reduced) {
          const dx = px - curX;
          const dy = py - curY;
          const dist = Math.hypot(dx, dy);
          if (dist < INFLUENCE) {
            const f = 1 - dist / INFLUENCE;
            const k = f * f * PUSH * (0.35 + s.depth);
            const inv = 1 / (dist || 1);
            tox = dx * inv * k;
            toy = dy * inv * k;
          }
          s.ox += (tox - s.ox) * 0.12;
          s.oy += (toy - s.oy) * 0.12;
        }

        const twinkle = reduced ? 1 : 0.62 + 0.38 * Math.sin(time * s.rate + s.phase);
        const d = s.r * CORE;

        ctx.globalAlpha = Math.min(1, s.a * twinkle);
        ctx.drawImage(sprites[s.tint % sprites.length], px + s.ox - d / 2, py + s.oy - d / 2, d, d);
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;
      time += dt;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      tx = e.clientX / w;
      ty = e.clientY / h;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      draw(0);
    } else {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas className="starfield" ref={ref} aria-hidden="true" />;
}
