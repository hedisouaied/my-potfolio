import { useCallback, useRef, useState } from 'react';

let uid = 0;

export function useWindows() {
  const [windows, setWindows] = useState([]);
  const zRef = useRef(10);

  const focus = useCallback((id) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
  }, []);

  const open = useCallback((appId, defaults) => {
    setWindows((ws) => {
      const existing = ws.find((w) => w.appId === appId);
      if (existing) {
        zRef.current += 1;
        return ws.map((w) => (w.appId === appId ? { ...w, minimized: false, z: zRef.current } : w));
      }
      zRef.current += 1;
      const id = `w${uid++}`;
      const offset = (ws.length % 6) * 24;
      return [
        ...ws,
        {
          id,
          appId,
          z: zRef.current,
          minimized: false,
          x: (defaults?.x ?? 120) + offset,
          y: (defaults?.y ?? 90) + offset,
          w: defaults?.w ?? 560,
          h: defaults?.h ?? 420,
        },
      ];
    });
  }, []);

  const close = useCallback((id) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const minimize = useCallback((id) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const updateRect = useCallback((id, rect) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...rect } : w)));
  }, []);

  return { windows, open, close, minimize, focus, updateRect };
}
