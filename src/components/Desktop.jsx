import { APPS, DESKTOP_ICONS } from '../apps/registry';

export default function Desktop({ onOpen }) {
  return (
    <div className="desktop-icons">
      {DESKTOP_ICONS.map((id) => (
        <button className="desktop-icon" key={id} onClick={() => onOpen(id)}>
          <span className="desktop-icon-glyph">{APPS[id].icon}</span>
          <span className="desktop-icon-label">{APPS[id].title}</span>
        </button>
      ))}
    </div>
  );
}
