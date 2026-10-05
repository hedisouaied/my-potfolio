import { useCallback, useEffect, useRef, useState } from 'react';
import SplitText from '../motion/SplitText';
import { useLocale } from '../i18n/useLocale';
import { prefersReducedMotion } from '../motion/lerp';

/* The boot timeline. Each phase is named for what it does rather than how long it
   lasts, and every phase is derived from the live line count so the sequence stays
   in step with whatever locale bundle is active (en/fr ship the same count). */
const INTRO = 520; /* wordmark + tagline settle */
const STEP = 110; /* stagger between log lines */
const DOT = 90; /* dot leader */
const OK = 110; /* pause before "ok" lands */
const OUTRO = 720; /* exit wipe */

/* Line clock -> stage. 0 hidden, 1 text in, 2 leader running, 3 ok. */
const AT_TEXT = 0;
const AT_DOTS = DOT;
const AT_OK = DOT + OK;

const WORDMARK = 'H.SOUAIED';

function stageFor(lineIndex, elapsed) {
  const t = elapsed - lineIndex * STEP;
  if (t < AT_TEXT) return 0;
  if (t < AT_DOTS) return 1;
  if (t < AT_OK) return 2;
  return 3;
}

export default function BootScreen({ onComplete }) {
  const { t } = useLocale();
  const LINES = t('boot.lines');

  const reduced = prefersReducedMotion();
  const intro = reduced ? 0 : INTRO;
  const outro = reduced ? 1 : OUTRO;
  const step = reduced ? 1 : STEP;

  const logSpan = Math.max(1, LINES.length - 1) * step;
  const total = intro + logSpan + DOT + OK + outro;

  const rootRef = useRef(null);
  const numRef = useRef(null);
  const [stage, setStage] = useState(() => LINES.map(() => 0));
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  /* One rAF clock drives the whole sequence.
     - progress, the percent readout and the rail are written straight to the DOM
       as custom properties/text so 60fps motion costs zero React renders;
     - line stages are React state, but only bumped when a line actually changes
       stage, which is at most 3 transitions x N lines for the whole preloader. */
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let raf = 0;
    let start = 0;
    let elapsed = 0;
    let lastPct = -1;
    let lastStage = '';

    /* Give the first frame a beat to paint the hidden state before the entrance
       animations are allowed to run, otherwise the wordmark never animates. */
    const kick = requestAnimationFrame(() => setStarted(true));

    const loop = (now) => {
      if (!start) start = now;
      elapsed = now - start;

      /* Progress covers loading + log, then holds at 100% through the wipe so the
         bar never appears to stall while the screen is dissolving. */
      const work = intro + logSpan + DOT + OK;
      const p = Math.min(1, elapsed / Math.max(1, work));
      root.style.setProperty('--boot-p', p.toFixed(4));

      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (numRef.current) numRef.current.textContent = String(pct);
      }

      const next = LINES.map((_, i) => stageFor(i, elapsed - intro));
      const key = next.join('');
      if (key !== lastStage) {
        lastStage = key;
        setStage(next);
      }

      if (elapsed >= total - outro) setLeaving(true);
      if (elapsed >= total) {
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(kick);
      cancelAnimationFrame(raf);
    };
  }, [LINES, intro, logSpan, total, outro, finish]);

  return (
    <div
      ref={rootRef}
      className={`boot-screen${started ? ' started' : ''}${leaving ? ' leaving' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="boot-ambience" aria-hidden="true">
        <div className="boot-amb-glow" />
        <div className="boot-amb-grid" />
        <div className="boot-amb-sweep" />
        <div className="boot-scanlines" />
      </div>

      <div className="boot-inner">
        <div className="boot-mark">
          <SplitText className="boot-mark-name" text={WORDMARK} />
          <span className="boot-mark-os">
            <span className="boot-mark-os-line" />
            OS
          </span>
        </div>

        <div className="boot-rail" aria-hidden="true">
          <span className="boot-rail-track">
            <span className="boot-rail-fill" />
            <span className="boot-rail-dot" />
          </span>
          <span className="boot-rail-pct">
            <b ref={numRef}>0</b>
            <i>%</i>
          </span>
        </div>

        <div className="boot-log">
          <pre className="boot-term">
            {LINES.map((line, i) => {
              const s = stage[i];
              return (
                <span key={line} className={`boot-line${s > 0 ? ' in' : ''}`}>
                  <span className="boot-caret">›</span>
                  <span className="boot-text">{line}</span>
                  {s > 0 && s < 3 && (
                    <span className="boot-dots" aria-hidden="true">
                      <i>.</i>
                      <i>.</i>
                      <i>.</i>
                    </span>
                  )}
                  {s === 3 && <span className="boot-ok">{t('boot.ok')}</span>}
                </span>
              );
            })}
          </pre>
          <span className="boot-ready" aria-hidden="true">
            {t('boot.ready')}
            <span className="boot-block" />
          </span>
        </div>
      </div>

      {/* The wipe itself: four blades that open outward over the desktop. */}
      <div className="boot-wipe" aria-hidden="true">
        <span className="boot-wipe-blade boot-wipe-t" />
        <span className="boot-wipe-blade boot-wipe-b" />
        <span className="boot-wipe-blade boot-wipe-l" />
        <span className="boot-wipe-blade boot-wipe-r" />
        <span className="boot-wipe-flash" />
      </div>
    </div>
  );
}