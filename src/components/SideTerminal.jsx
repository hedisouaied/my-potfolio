import { useEffect, useState } from 'react';

const STEP = 880;
const HOLD = 1900;
const CLEAR = 620;

const LINES = [
  'welcome to my world...',
  'user: Hedi Souaied',
  'role: PHP / Laravel Developer',
  'passion: turning coffee into code',
  'building web applications...',
  'debugging reality... please wait',
  '99 bugs found... fixing the coffee first',
  'works on my machine... probably',
  'converting ideas into working code',
  "system ready. Let's build something great!",
];

const SHOWN_AT = LINES.length * STEP;

/* Remounting the rows on every cycle is what replays the CSS reveal — React
   keeps the same nodes otherwise, so the animation would not restart. */
export default function SideTerminal({ hidden = false }) {
  const [cycle, setCycle] = useState(0);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const clearAt = setTimeout(() => setClearing(true), SHOWN_AT + HOLD);
    const restart = setTimeout(() => {
      setClearing(false);
      setCycle((c) => c + 1);
    }, SHOWN_AT + HOLD + CLEAR);
    return () => {
      clearTimeout(clearAt);
      clearTimeout(restart);
    };
  }, [cycle]);

  return (
    <aside
      className={`side-term${clearing ? ' clearing' : ''}${hidden ? ' behind' : ''}`}
      aria-hidden="true"
    >
      <pre className="side-term-body">
        {LINES.map((line, i) => (
          <span key={`${cycle}-${i}`} className="side-term-line" style={{ animationDelay: `${i * STEP}ms` }}>
            <span className="side-term-caret">›</span>
            {line}
          </span>
        ))}
      </pre>
    </aside>
  );
}
