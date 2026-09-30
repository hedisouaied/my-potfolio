import { Rnd } from 'react-rnd';
import AppIcon from './AppIcon';

/* re-resizable renders zero-size grab zones unless handle styles are supplied */
const HANDLE_STYLES = {
  top: { top: 0, left: 12, right: 12, height: 5 },
  bottom: { bottom: 0, left: 12, right: 12, height: 5 },
  left: { top: 12, bottom: 12, left: 0, width: 5 },
  right: { top: 12, bottom: 12, right: 0, width: 5 },
  topLeft: { top: 0, left: 0, width: 12, height: 12 },
  topRight: { top: 0, right: 0, width: 12, height: 12 },
  bottomLeft: { bottom: 0, left: 0, width: 12, height: 12 },
  bottomRight: { bottom: 0, right: 0, width: 12, height: 12 },
};

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
  if (win.minimized) return null;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      minWidth={280}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="win-titlebar"
      disableDragging={!!win.maximized}
      enable={!win.maximized}
      handleStyles={HANDLE_STYLES}
      style={{ zIndex: win.z }}
      onDragStart={onFocus}
      onDragStop={(e, d) => onChangeRect({ x: d.x, y: d.y })}
      onResizeStart={onFocus}
      onResizeStop={(e, dir, ref, delta, pos) =>
        onChangeRect({ w: parseInt(ref.style.width, 10), h: parseInt(ref.style.height, 10), x: pos.x, y: pos.y })
      }
      className={`window ${active ? 'active' : ''} ${win.maximized ? 'maximized' : ''}`}
    >
      <div className="window-inner" onMouseDownCapture={() => { if (!active) onFocus(); }}>
        <div className="win-titlebar">
          <span className="win-icon" aria-hidden="true">
            <AppIcon name={icon} size={15} />
          </span>
          <span className="win-title">{title}</span>
          <div className="win-controls">
            <button
              className="win-btn win-min"
              onClick={onMinimize}
              aria-label={`Minimize ${title}`}
              title="Minimize"
            >
              <Glyph d={MIN_GLYPH} />
            </button>
            <button
              className="win-btn win-max"
              onClick={onMaximize}
              aria-label={`${win.maximized ? 'Restore' : 'Maximize'} ${title}`}
              title={win.maximized ? 'Restore' : 'Maximize'}
            >
              <Glyph d={MAX_GLYPH} />
            </button>
            <button
              className="win-btn win-close"
              onClick={onClose}
              aria-label={`Close ${title}`}
              title="Close"
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
