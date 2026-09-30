import { useCallback, useEffect, useRef, useState } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import WindowFrame from './components/WindowFrame';
import { APPS } from './apps/registry';
import { useWindows } from './useWindows';
import { usePointerParallax } from './usePointerParallax';

const WALLPAPERS = [
  { id: 'nebula', name: 'Nebula' },
  { id: 'grid', name: 'Blueprint' },
  { id: 'violet', name: 'Violet Haze' },
  { id: 'matrix', name: 'Matrix' },
  { id: 'ember', name: 'Ember' },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function App() {
  const { windows, open, close, minimize, focus, updateRect, toggleMax } = useWindows();
  const layerRef = useRef(null);
  const desktopRef = useRef(null);
  usePointerParallax(desktopRef);
  const [wallpaperIndex, setWallpaperIndex] = useState(() => {
    const saved = parseInt(localStorage.getItem('hedios:wallpaper') ?? '0', 10);
    return Number.isFinite(saved) ? saved % WALLPAPERS.length : 0;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 950);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('hedios:wallpaper', String(wallpaperIndex));
  }, [wallpaperIndex]);

  const openApp = useCallback(
    (id, overrides) => {
      const app = APPS[id];
      const area = layerRef.current?.getBoundingClientRect();
      const aw = area?.width ?? window.innerWidth;
      const ah = area?.height ?? window.innerHeight;
      const w = Math.min(overrides?.w ?? app.w, Math.max(260, aw - 24));
      const h = Math.min(overrides?.h ?? app.h, Math.max(180, ah - 24));
      const step = (windows.filter((x) => x.appId !== id).length % 5) * 20;
      const x = overrides?.x ?? clamp(Math.round((aw - w) / 2) + step - 40, 12, Math.max(12, aw - w - 12));
      const y =
        overrides?.y ?? clamp(Math.round(ah * 0.28) + step - 24, 12, Math.max(12, ah - h - 12));
      open(id, { x, y, w, h });
    },
    [open, windows]
  );

  useEffect(() => {
    openApp('about');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycleWallpaper = () => setWallpaperIndex((i) => (i + 1) % WALLPAPERS.length);

  const activeWindow = windows.reduce(
    (top, w) => (!w.minimized && (!top || w.z > top.z) ? w : top),
    null
  );

  const toggleFromTaskbar = (id) => {
    const w = windows.find((x) => x.id === id);
    if (!w) return;
    if (w.minimized) return focus(id);
    if (activeWindow && activeWindow.id === id) return minimize(id);
    focus(id);
  };

  const toggleMaximize = (id) => {
    const r = layerRef.current?.getBoundingClientRect();
    toggleMax(id, { x: 0, y: 0, w: r?.width ?? window.innerWidth, h: r?.height ?? window.innerHeight });
  };

  const wallpaper = WALLPAPERS[wallpaperIndex];

  return (
    <div className={`desktop wp-${wallpaper.id}`} ref={desktopRef}>
      {booting && (
        <div className="boot-screen">
          <div className="boot-inner">
            <div className="boot-logo">
              <span className="boot-mark">▚</span> HediOS
            </div>
            <div className="boot-bar">
              <span />
            </div>
            <div className="boot-log">initializing desktop environment…</div>
          </div>
        </div>
      )}

      <div className="aurora aurora-a" aria-hidden="true" />
      <div className="aurora aurora-b" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="desktop-watermark" aria-hidden="true">HediOS</div>

      <Desktop onOpen={openApp} />

      <div className="window-layer" ref={layerRef}>
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
              onMaximize={() => toggleMaximize(w.id)}
              onChangeRect={(rect) => updateRect(w.id, rect)}
            >
              <Component />
            </WindowFrame>
          );
        })}
      </div>

      <Taskbar
        windows={windows}
        activeId={activeWindow?.id}
        wallpaperName={wallpaper.name}
        onToggle={toggleFromTaskbar}
        onCycleWallpaper={cycleWallpaper}
      />
    </div>
  );
}
