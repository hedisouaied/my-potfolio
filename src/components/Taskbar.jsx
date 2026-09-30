import { useEffect, useState } from 'react';
import { APPS } from '../apps/registry';

export default function Taskbar({ windows, activeId, onToggle, onCycleWallpaper }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="taskbar">
      <div className="taskbar-brand">HediOS</div>
      <div className="taskbar-windows">
        {windows.map((w) => (
          <button
            key={w.id}
            className={`taskbar-item ${w.id === activeId && !w.minimized ? 'active' : ''}`}
            onClick={() => onToggle(w.id)}
          >
            <span aria-hidden="true">{APPS[w.appId].icon}</span>
            {APPS[w.appId].title}
          </button>
        ))}
      </div>
      <button className="taskbar-wallpaper" onClick={onCycleWallpaper} aria-label="Change wallpaper">🎨</button>
      <div className="taskbar-clock">
        <span>{time}</span>
        <span className="muted small">{date}</span>
      </div>
    </div>
  );
}
