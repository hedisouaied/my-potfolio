import { useEffect, useState } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import WindowFrame from './components/WindowFrame';
import { APPS } from './apps/registry';
import { useWindows } from './useWindows';

const WALLPAPERS = [
  'linear-gradient(135deg, #0B486B, #04B4E0)',
  'linear-gradient(135deg, #16222A, #3A6073)',
  'linear-gradient(135deg, #654EA3, #EAAFC8)',
  'linear-gradient(135deg, #1F1C2C, #928DAB)',
  'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
];

export default function App() {
  const { windows, open, close, minimize, focus, updateRect } = useWindows();
  const [wallpaperIndex, setWallpaperIndex] = useState(() => {
    const saved = parseInt(localStorage.getItem('hedios:wallpaper') ?? '0', 10);
    return Number.isFinite(saved) ? saved % WALLPAPERS.length : 0;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('hedios:wallpaper', String(wallpaperIndex));
  }, [wallpaperIndex]);

  useEffect(() => {
    open('about', { x: 100, y: 80, w: APPS.about.w, h: APPS.about.h });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycleWallpaper = () => setWallpaperIndex((i) => (i + 1) % WALLPAPERS.length);

  const activeWindow = windows.reduce((top, w) => (!w.minimized && (!top || w.z > top.z) ? w : top), null);

  const toggleFromTaskbar = (id) => {
    const w = windows.find((x) => x.id === id);
    if (!w) return;
    if (w.minimized) return focus(id);
    if (activeWindow && activeWindow.id === id) return minimize(id);
    focus(id);
  };

  return (
    <div className="desktop" style={{ background: WALLPAPERS[wallpaperIndex] }}>
      {booting && (
        <div className="boot-screen">
          <div className="boot-logo">HediOS</div>
        </div>
      )}

      <Desktop onOpen={(id) => open(id, { w: APPS[id].w, h: APPS[id].h })} />

      {windows.map((w) => {
        const app = APPS[w.appId];
        const Component = app.component;
        return (
          <WindowFrame
            key={w.id}
            win={w}
            title={app.title}
            icon={app.icon}
            active={activeWindow?.id === w.id}
            onFocus={() => focus(w.id)}
            onClose={() => close(w.id)}
            onMinimize={() => minimize(w.id)}
            onChangeRect={(rect) => updateRect(w.id, rect)}
          >
            <Component />
          </WindowFrame>
        );
      })}

      <Taskbar
        windows={windows}
        activeId={activeWindow?.id}
        onToggle={toggleFromTaskbar}
        onCycleWallpaper={cycleWallpaper}
      />
    </div>
  );
}
