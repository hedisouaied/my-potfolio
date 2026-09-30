import { Rnd } from 'react-rnd';

export default function WindowFrame({ win, title, icon, active, onFocus, onClose, onMinimize, onChangeRect, children }) {
  if (win.minimized) return null;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      minWidth={280}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="win-titlebar"
      style={{ zIndex: win.z }}
      onDragStart={onFocus}
      onDragStop={(e, d) => onChangeRect({ x: d.x, y: d.y })}
      onResizeStart={onFocus}
      onResizeStop={(e, dir, ref, delta, pos) =>
        onChangeRect({ w: parseInt(ref.style.width, 10), h: parseInt(ref.style.height, 10), x: pos.x, y: pos.y })
      }
      className={`window ${active ? 'active' : ''}`}
    >
      <div className="window-inner" onMouseDownCapture={() => { if (!active) onFocus(); }}>
        <div className="win-titlebar">
          <span className="win-icon" aria-hidden="true">{icon}</span>
          <span className="win-title">{title}</span>
          <div className="win-controls">
            <button className="win-btn win-min" onClick={onMinimize} aria-label="Minimize">–</button>
            <button className="win-btn win-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>
        <div className="win-body">{children}</div>
      </div>
    </Rnd>
  );
}
