import { useEffect, useRef, useState } from 'react';
import AppIcon from './AppIcon';
import { APPS } from '../apps/registry';
import { useLocale } from '../i18n/useLocale';
import { LOCALES } from '../i18n/locales';
import profilePhoto from '../assets/profile-photo.jpg';

export default function Taskbar({
  windows,
  activeId,
  wallpaperName,
  onToggle,
  onCycleWallpaper,
}) {
  const { locale, setLocale, t } = useLocale();
  const [now, setNow] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  /* Dismiss on outside press or Escape. The taskbar is not the only click
     target — windows sit above it — so the listener has to live on document. */
  useEffect(() => {
    if (!langOpen) return undefined;
    const onPointerDown = (e) => {
      if (!langRef.current?.contains(e.target)) setLangOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [langOpen]);

  const time = now?.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) ?? '--:--';
  const date =
    now?.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' }) ?? '';

  const activeLocale = LOCALES.find((l) => l.id === locale) ?? LOCALES[0];

  return (
    <div className="taskbar">
      <div className="taskbar-brand">
        <img className="taskbar-avatar" src={profilePhoto} alt="" />
        H.Souaied <span>v1.0</span>
      </div>
      <div className="taskbar-windows">
        {windows.map((w) => (
          <button
            key={w.id}
            className={`taskbar-item ${
              w.id === activeId && !w.minimized ? 'active' : w.minimized ? 'minimized' : ''
            }`}
            onClick={() => onToggle(w.id)}
          >
            <AppIcon name={APPS[w.appId].icon} size={15} />
            {t(APPS[w.appId].titleKey)}
          </button>
        ))}
      </div>

      <div className="taskbar-lang" ref={langRef}>
        <button
          type="button"
          className={`taskbar-lang-btn${langOpen ? ' open' : ''}`}
          onClick={() => setLangOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={langOpen}
          aria-label={t('taskbar.changeLanguage', { name: activeLocale.label })}
          title={t('taskbar.changeLanguage', { name: activeLocale.label })}
        >
          <AppIcon name="globe" size={17} />
        </button>

        {langOpen && (
          <div className="taskbar-lang-menu" role="menu" aria-label={t('taskbar.language')}>
            {LOCALES.map((l) => (
              <button
                key={l.id}
                type="button"
                role="menuitemradio"
                aria-checked={l.id === locale}
                className={`taskbar-lang-opt${l.id === locale ? ' active' : ''}`}
                lang={l.id}
                onClick={() => {
                  setLocale(l.id);
                  setLangOpen(false);
                }}
              >
                <span className="taskbar-lang-short">{l.short}</span>
                <span className="taskbar-lang-name">{l.label}</span>
                {l.id === locale && (
                  <span className="taskbar-lang-tick" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="taskbar-wallpaper"
        onClick={onCycleWallpaper}
        aria-label={t('taskbar.changeWallpaper', { name: wallpaperName })}
        title={t('taskbar.wallpaper', { name: wallpaperName })}
      >
        <AppIcon name="paint" size={17} />
      </button>
      <div className="taskbar-clock">
        <span>{time}</span>
        <span className="small">{date}</span>
      </div>
    </div>
  );
}
