import { Rnd } from 'react-rnd';
import AppIcon from './AppIcon';
import { useCoarsePointer } from '../useMediaQuery';
import { useLocale } from '../i18n/useLocale';

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

  if (win.minimized) return null;

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
      enable={!win.maximized}
      handleStyles={coarse ? TOUCH_HANDLE_STYLES : HANDLE_STYLES}
      style={{ zIndex: win.z }}
      onDragStart={onFocus}
      onDragStop={(e, d) => onChangeRect({ x: Math.round(d.x), y: Math.round(d.y) })}
      onResizeStart={onFocus}
      onResizeStop={(e, dir, ref, delta, pos) =>
        onChangeRect({
          w: Math.round(ref.offsetWidth),
          h: Math.round(ref.offsetHeight),
          x: Math.round(pos.x),
          y: Math.round(pos.y),
        })
      }
      className={`window ${active ? 'active' : ''} ${win.maximized ? 'maximized' : ''}`}
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
              onClick={onMinimize}
              aria-label={`${t('window.minimize')} ${title}`}
              title={t('window.minimize')}
            >
              <Glyph d={MIN_GLYPH} />
            </button>
            <button
              type="button"
              className="win-btn win-max"
              onClick={onMaximize}
              aria-label={`${t(win.maximized ? 'window.restore' : 'window.maximize')} ${title}`}
              title={t(win.maximized ? 'window.restore' : 'window.maximize')}
            >
              <Glyph d={MAX_GLYPH} />
            </button>
            <button
              type="button"
              className="win-btn win-close"
              onClick={onClose}
              aria-label={`${t('window.close')} ${title}`}
              title={t('window.close')}
            >
              <Glyph d={CLOSE_GLYPH} />
            </button>
          </div>
        </div>
        <div className="win-body">{children}</div>
      </div>
    </Rnd>
  );
}
