import { useEffect, useRef, useState } from 'react';

/* Each line: text shown first, then a dot leader fills in, then the green
   status lands. STEP is the stagger between lines, DOTS is how long the leader
   takes, and OK is the pause before "ok" appears. */
const STEP = 165;
const DOTS = 260;
const OK = 140;

const LINES = [
  'H.SouaiedOS bootloader v1.0',
  'initializing kernel',
  'mounting /home/hsouaied',
  'loading /projects',
  'loading /assets',
  'starting window manager',
  'calibrating wallpaper',
];

const LAST_AT = (LINES.length - 1) * STEP;
export const BOOT_DURATION = LAST_AT + DOTS + OK + 620;

export default function BootScreen({ onComplete }) {
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
  }, []);

  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
    }, BOOT_DURATION - 500);
    const t2 = setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete?.();
    }, BOOT_DURATION);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [onComplete]);

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
                {s === 3 && <span className="boot-ok">ok</span>}
                {s === 2 && <span className="boot-block" aria-hidden="true" />}
              </span>
            );
          })}
        </pre>
        <span className="boot-ready" aria-hidden="true">
          ready<span className="boot-block" />
        </span>
      </div>
    </div>
  );
}
