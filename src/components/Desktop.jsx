import AppIcon from './AppIcon';
import { APPS, DESKTOP_ICONS } from '../apps/registry';
import { useLocale } from '../i18n/useLocale';

export default function Desktop({ onOpen }) {
  const { t } = useLocale();

  return (
    <div className="desktop-icons">
      {DESKTOP_ICONS.map((id, i) => (
        <button
          className="desktop-icon"
          key={id}
          /* Drives the staggered entrance. Delay is derived from the index in CSS
             so adding an app to the registry never means editing the markup. */
          style={{ '--i': i }}
          onClick={() => onOpen(id)}
          title={t(APPS[id].titleKey)}
        >
          <span className="desktop-icon-glyph">
            <span className="desktop-icon-sheen" aria-hidden="true" />
            <AppIcon name={APPS[id].icon} size={22} />
          </span>
          <span className="desktop-icon-label">{t(APPS[id].titleKey)}</span>
        </button>
      ))}
    </div>
  );
}