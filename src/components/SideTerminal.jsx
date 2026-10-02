import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/useLocale';

const STEP = 880;
const HOLD = 1900;
const CLEAR = 620;

/* Remounting the rows on every cycle is what replays the CSS reveal — React
   keeps the same nodes otherwise, so the animation would not restart. */
export default function SideTerminal({ hidden = false }) {
  const { t } = useLocale();
  const lines = t('sideTerm.lines');
  const shownAt = lines.length * STEP;

  const [cycle, setCycle] = useState(0);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const clearAt = setTimeout(() => setClearing(true), shownAt + HOLD);
    const restart = setTimeout(() => {
      setClearing(false);
      setCycle((c) => c + 1);
    }, shownAt + HOLD + CLEAR);
    return () => {
      clearTimeout(clearAt);
      clearTimeout(restart);
    };
  }, [cycle, shownAt]);

  return (
    <aside
      className={`side-term${clearing ? ' clearing' : ''}${hidden ? ' behind' : ''}`}
      aria-hidden="true"
    >
      <pre className="side-term-body">
        {lines.map((line, i) => (
          <span key={`${cycle}-${i}`} className="side-term-line" style={{ animationDelay: `${i * STEP}ms` }}>
            <span className="side-term-caret">›</span>
            {line}
          </span>
        ))}
      </pre>
    </aside>
  );
}
