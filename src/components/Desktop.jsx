import AppIcon from './AppIcon';
import { APPS, DESKTOP_ICONS } from '../apps/registry';

export default function Desktop({ onOpen }) {
  return (
    <div className="desktop-icons">
      {DESKTOP_ICONS.map((id) => (
        <button
          className="desktop-icon"
          key={id}
          onClick={() => onOpen(id)}
          title={APPS[id].title}
        >
          <span className="desktop-icon-glyph">
            <AppIcon name={APPS[id].icon} size={22} />
          </span>
          <span className="desktop-icon-label">{APPS[id].title}</span>
        </button>
      ))}
    </div>
  );
}
