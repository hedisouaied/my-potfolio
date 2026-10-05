import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import AppIcon from './AppIcon';
import { useCoarsePointer } from '../useMediaQuery';
import { useLocale } from '../i18n/useLocale';
import { useScrollProgress } from '../motion/useScrollProgress';

/* re-resizable renders zero-size grab zones unless handle styles are supplied.
   `touchAction: none` stops the browser from stealing the gesture for
   scrolling/pinch-zoom before re-resizable sees the touchmove. */
const HANDLE_STYLES = {
  top: { top: 0, left: 12, right: 12, height: 5, touchAction: 'none' },
  bottom: { bottom: 0, left: 12, right: 12, height: 5, touchAction: 'none' },
  left: { top: 12, bottom: 12, left: 0, width: 5, touchAction: 'none' },
  right: { top: 12, bottom: 12, right: 0, width: 5, touchAction: 'none' },
  topLeft: { top: 0, left: 0, width: 12, height: 12, touchAction: 'none' },
  topRight: { top: 0, right: 0, width: 12, height: 12, touchAction: 'none' },
  bottomLeft: { bottom: 0, left: 0, width: 12, height: 12, touchAction: 'none' },
  bottomRight: { bottom: 0, right: 0, width: 12, height: 12, touchAction: 'none' },
};

/* Fingers need ~24px grab zones; 5px edges are unhittable on a phone. */
const TOUCH_HANDLE_STYLES = {
  top: { top: 0, left: 32, right: 32, height: 16, touchAction: 'none' },
  bottom: { bottom: 0, left: 32, right: 32, height: 16, touchAction: 'none' },
  left: { top: 32, bottom: 32, left: 0, width: 16, touchAction: 'none' },
  right: { top: 32, bottom: 32, right: 0, width: 16, touchAction: 'none' },
  topLeft: { top: 0, left: 0, width: 30, height: 30, touchAction: 'none' },
  topRight: { top: 0, right: 0, width: 30, height: 30, touchAction: 'none' },
  bottomLeft: { bottom: 0, left: 0, width: 30, height: 30, touchAction: 'none' },
  bottomRight: { bottom: 0, right: 0, width: 30, height: 30, touchAction: 'none' },
};

/* Without this, react-draggable calls preventDefault() on touchstart inside the
   titlebar, which cancels the synthesized click: on touch, none of the window
   buttons would ever receive onClick. */
const CONTROL_CANCEL_SELECTOR = '.win-controls';

/* Must match --dur-fast in index.css so JS and CSS agree on when to unmount. */
/** Must stay in sync with `--dur-fast` in index.css — see the note by the token. */
const EXIT_MS = 240;
const MORPH_MS = 340;
const FOCUS_BLOOM_MS = 620;

/* Phases a window moves through. React-rnd writes `transform`, `width` and
   `height` inline, so every window animation below uses the independent
   `translate` / `scale` / `rotate` properties — they compose with the inline
   transform instead of fighting it. */
const PHASE_OPEN = 'open';
const PHASE_CLOSING = 'closing';
const PHASE_MINIMIZING = 'minimizing';

function Glyph({ d }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d={d} />
    </svg>
  );
}

const CLOSE_GLYPH = 'M3.2 3.2 8.8 8.8M8.8 3.2 3.2 8.8';
const MIN_GLYPH = 'M2.8 6h6.4';
const MAX_GLYPH = 'M2.4 5.2V2.4h2.8M9.6 5.2V2.4H6.8M2.4 6.8v2.8h2.8M9.6 6.8v2.8H6.8';

export default function WindowFrame({
  win,
  title,
  icon,
  active,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onChangeRect,
  children,
}) {
  const coarse = useCoarsePointer();
  const { t } = useLocale();

  const [phase, setPhase] = useState(PHASE_OPEN);
  const [morphing, setMorphing] = useState(false);
  const [blooming, setBlooming] = useState(false);
  const bodyRef = useScrollProgress();

  const timers = useRef([]);
  const wasActive = useRef(active);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  /* Close and minimize are animated *before* the store is told, otherwise the
     window unmounts on the same frame the click lands and there is nothing left to
     animate. The real unmount happens once the exit finishes. */
  const handleClose = () => {
    if (phase !== PHASE_OPEN) return;
    setPhase(PHASE_CLOSING);
    later(onClose, EXIT_MS);
  };

  const handleMinimize = () => {
    if (phase !== PHASE_OPEN) return;
    setPhase(PHASE_MINIMIZING);
    later(onMinimize, EXIT_MS);
  };

  /* Width/height/position are only transitioned while `morphing` is set, so a
     maximize reads as a fluid zoom instead of a snap — and dragging stays 1:1. */
  const handleMaximize = () => {
    if (morphing) return;
    setMorphing(true);
    onMaximize();
    later(() => setMorphing(false), MORPH_MS);
  };

  const handleDragStart = () => {
    setMorphing(false);
    onFocus();
  };

  /* A short accent bloom + titlebar sheen the moment a window takes focus. */
  useEffect(() => {
    if (active && !wasActive.current) {
      setBlooming(true);
      later(() => setBlooming(false), FOCUS_BLOOM_MS);
    }
    wasActive.current = active;
  }, [active]);

  if (win.minimized) return null;

  const closing = phase !== PHASE_OPEN;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      minWidth={280}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="win-titlebar"
      cancel={CONTROL_CANCEL_SELECTOR}
      disableDragging={!!win.maximized}
      enable={!win.maximized && !closing}
      handleStyles={coarse ? TOUCH_HANDLE_STYLES : HANDLE_STYLES}
      style={{ zIndex: win.z }}
      onDragStart={handleDragStart}
      onDragStop={(e, d) => onChangeRect({ x: Math.round(d.x), y: Math.round(d.y) })}
      onResizeStart={handleDragStart}
      onResizeStop={(e, dir, ref, delta, pos) =>
        onChangeRect({
          w: Math.round(ref.offsetWidth),
          h: Math.round(ref.offsetHeight),
          x: Math.round(pos.x),
          y: Math.round(pos.y),
        })
      }
      className={[
        'window',
        active ? 'active' : '',
        win.maximized ? 'maximized' : '',
        morphing ? 'morphing' : '',
        blooming ? 'blooming' : '',
        `phase-${phase}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="window-inner" onPointerDownCapture={() => { if (!active) onFocus(); }}>
        <div className="win-titlebar">
          <span className="win-icon" aria-hidden="true">
            <AppIcon name={icon} size={15} />
          </span>
          <span className="win-title">{title}</span>
          <div className="win-controls">
            <button
              type="button"
              className="win-btn win-min"
              onClick={handleMinimize}
              aria-label={`${t('window.minimize')} ${title}`}
              title={t('window.minimize')}
            >
              <Glyph d={MIN_GLYPH} />
            </button>
            <button
              type="button"
              className="win-btn win-max"
              onClick={handleMaximize}
              aria-label={`${t(win.maximized ? 'window.restore' : 'window.maximize')} ${title}`}
              title={t(win.maximized ? 'window.restore' : 'window.maximize')}
            >
              <Glyph d={MAX_GLYPH} />
            </button>
            <button
              type="button"
              className="win-btn win-close"
              onClick={handleClose}
              aria-label={`${t('window.close')} ${title}`}
              title={t('window.close')}
            >
              <Glyph d={CLOSE_GLYPH} />
            </button>
          </div>
          {/* Sheen sweep, fired by .blooming when the window gains focus. */}
          <span className="win-sheen" aria-hidden="true" />
        </div>
        <div className="win-body" ref={bodyRef}>
          <span className="win-scroll-rail" aria-hidden="true">
            <span className="win-scroll-fill" />
          </span>
          {children}
        </div>
      </div>
    </Rnd>
  );
}