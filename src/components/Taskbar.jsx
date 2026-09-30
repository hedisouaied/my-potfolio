import { useEffect, useState } from 'react';
import AppIcon from './AppIcon';
import { APPS } from '../apps/registry';

export default function Taskbar({
  windows,
  activeId,
  wallpaperName,
  onToggle,
  onCycleWallpaper,
}) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const t = setInterval(tick, 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const time = now?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '--:--';
  const date = now?.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) ?? '';

  return (
    <div className="taskbar">
      <div className="taskbar-brand">
        HediOS <span>v1.0</span>
      </div>
      <div className="taskbar-windows">
        {windows.map((w) => (
          <button
            key={w.id}
            className={`taskbar-item ${
              w.id === activeId && !w.minimized ? 'active' : w.minimized ? 'minimized' : ''
            }`}
            onClick={() => onToggle(w.id)}
          >
            <AppIcon name={APPS[w.appId].icon} size={15} />
            {APPS[w.appId].title}
          </button>
        ))}
      </div>
      <button
        className="taskbar-wallpaper"
        onClick={onCycleWallpaper}
        aria-label={`Change wallpaper — current: ${wallpaperName}`}
        title={`Wallpaper: ${wallpaperName}`}
      >
        <AppIcon name="paint" size={17} />
      </button>
      <div className="taskbar-clock">
        <span>{time}</span>
        <span className="small">{date}</span>
      </div>
    </div>
  );
}
