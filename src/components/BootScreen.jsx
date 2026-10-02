import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/useLocale';

/* Each line: text shown first, then a dot leader fills in, then the green
   status lands. STEP is the stagger between lines, DOTS is how long the leader
   takes, and OK is the pause before "ok" appears. */
const STEP = 165;
const DOTS = 260;
const OK = 140;
const OUTRO = 620;

export default function BootScreen({ onComplete }) {
  const { t } = useLocale();
  const LINES = t('boot.lines');
  /* Derived from the live line count so the sequence stays in step with whatever
     locale is active — both bundles ship the same number of lines. */
  const duration = (LINES.length - 1) * STEP + DOTS + OK + OUTRO;

  const [stage, setStage] = useState(() => LINES.map(() => 0));
  const doneRef = useRef(false);

  useEffect(() => {
    const timers = LINES.flatMap((_, i) => {
      const at = i * STEP;
      return [
        setTimeout(() => setStage((s) => s.map((v, j) => (j === i ? 1 : v))), at),
        setTimeout(() => setStage((s) => s.map((v, j) => (j === i ? 2 : v))), at + DOTS),
        setTimeout(() => setStage((s) => s.map((v, j) => (j === i ? 3 : v))), at + DOTS + OK),
      ];
    });
    return () => timers.forEach(clearTimeout);
  }, [LINES]);

  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => {
      setLeaving(true);
    }, duration - 500);
    const doneTimer = setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete?.();
    }, duration);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, duration]);

  return (
    <div className={`boot-screen${leaving ? ' leaving' : ''}`} role="status" aria-live="polite">
      <div className="boot-scanlines" aria-hidden="true" />
      <div className="boot-inner">
        <pre className="boot-term">
          {LINES.map((line, i) => {
            const s = stage[i];
            return (
              <span key={line} className={`boot-line${s > 0 ? ' in' : ''}`}>
                <span className="boot-caret">›</span>
                <span className="boot-text">{line}</span>
                {s > 0 && (
                  <span className="boot-dots" aria-hidden="true">
                    <i>.</i>
                    <i>.</i>
                    <i>.</i>
                    <i>.</i>
                  </span>
                )}
                {s === 3 && <span className="boot-ok">{t('boot.ok')}</span>}
                {s === 2 && <span className="boot-block" aria-hidden="true" />}
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
  );
}
