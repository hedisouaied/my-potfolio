import { useCallback, useEffect, useRef, useState } from 'react';
import Desktop from './components/Desktop';
import Starfield from './components/Starfield';
import Taskbar from './components/Taskbar';
import WindowFrame from './components/WindowFrame';
import { APPS } from './apps/registry';
import { useWindows } from './useWindows';
import { usePointerParallax } from './usePointerParallax';
import { useIsMobileViewport } from './useMediaQuery';

const WALLPAPERS = [
  { id: 'portrait', name: 'Portrait' },
  { id: 'nebula', name: 'Nebula' },
  { id: 'grid', name: 'Blueprint' },
  { id: 'violet', name: 'Violet Haze' },
  { id: 'matrix', name: 'Matrix' },
  { id: 'ember', name: 'Ember' },
];

/* Cascade order, LEAST important first. Every `open` bumps the z-index, so the
   last one listed ends up on top — that leaves About Me (the introduction)
   front and centre once the chaos settles, with the real content stacked under
   it and the two gimmick apps buried at the back. */
const CASCADE_ORDER = ['tictactoe', 'music', 'terminal', 'contact', 'skills', 'resume', 'projects', 'about'];

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
  const [layerSize, setLayerSize] = useState({ w: 0, h: 0 });
  const isMobile = useIsMobileViewport();

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

  const introRef = useRef({ openApp, isMobile });
  useEffect(() => {
    introRef.current = { openApp, isMobile };
  });

  /* Opening cascade: on desktop every app slams open one after another with
     jittered timing and scattered positions so the screen floods. On mobile that
     is far too much, so it keeps the original behaviour of opening just About.

     Both read the latest values through refs so this effect stays mounted-once —
     depending on `openApp` would re-fire the cascade every time `windows` changed. */
  useEffect(() => {
    const timers = [];
    let elapsed = 0;

    const kickoff = setTimeout(() => {
      if (introRef.current.isMobile) {
        introRef.current.openApp('about');
        return;
      }

      const area = layerRef.current?.getBoundingClientRect();
      const aw = area?.width ?? window.innerWidth;
      const ah = area?.height ?? window.innerHeight;

      for (const id of CASCADE_ORDER) {
        const app = APPS[id];
        const w = Math.min(app.w, Math.max(240, aw - 24));
        const h = Math.min(app.h, Math.max(160, ah - 24));
        elapsed += 80 + Math.random() * 140;
        timers.push(
          setTimeout(() => {
            open(id, {
              x: Math.round(Math.random() * Math.max(0, aw - w)),
              y: Math.round(Math.random() * Math.max(0, ah - h)),
              w,
              h,
            });
          }, elapsed)
        );
      }
    }, introRef.current.isMobile ? 0 : 1000);

    return () => {
      clearTimeout(kickoff);
      for (const t of timers) clearTimeout(t);
    };
  }, [open]);

  /* react-rnd's `bounds="parent"` only applies during drag/resize, so a viewport
     change (phone rotation, browser chrome collapsing) can strand a window
     off-screen with its controls unreachable. Re-clamp on every change. */
  useEffect(() => {
    const el = layerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setLayerSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const { w: aw, h: ah } = layerSize;
    if (!aw || !ah) return;

    for (const w of windows) {
      if (w.minimized) continue;
      const nw = w.maximized ? aw : Math.min(w.w, Math.max(220, aw - 8));
      const nh = w.maximized ? ah : Math.min(w.h, Math.max(160, ah - 8));
      const nx = w.maximized ? 0 : clamp(w.x, 0, Math.max(0, aw - nw));
      const ny = w.maximized ? 0 : clamp(w.y, 0, Math.max(0, ah - nh));
      if (nw !== w.w || nh !== w.h || nx !== w.x || ny !== w.y) {
        updateRect(w.id, { x: nx, y: ny, w: nw, h: nh });
      }
    }
  }, [windows, layerSize, updateRect]);

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
              <span className="boot-mark">▚</span> H.Souaied
            </div>
            <div className="boot-bar">
              <span />
            </div>
            <div className="boot-log">initializing desktop environment…</div>
          </div>
        </div>
      )}

      <Starfield />
      <div className="aurora aurora-a" aria-hidden="true" />
      <div className="aurora aurora-b" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="desktop-watermark" aria-hidden="true">H.Souaied</div>

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
