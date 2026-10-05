import { useEffect, useRef, useState } from 'react';
import AppIcon from './AppIcon';
import Magnetic from '../motion/Magnetic';
import { APPS, DESKTOP_ICONS } from '../apps/registry';
import { useLocale } from '../i18n/useLocale';
import { LOCALES } from '../i18n/locales';
import profilePhoto from '../assets/profile-photo.jpg';

export default function Taskbar({
  windows,
  activeId,
  wallpaperName,
  ready = true,
  onOpen,
  onToggle,
  onCycleWallpaper,
}) {
  const { locale, setLocale, t } = useLocale();
  const [now, setNow] = useState(null);
  /* One slot, not two booleans: a single `null` means "both menus closed", and
     opening either menu automatically closes the other. */
  const [openMenu, setOpenMenu] = useState(null);
  const [tick, setTick] = useState(false);
  const menuRef = useRef(null);

  /* Clock, plus a beat of emphasis whenever the displayed minute changes (which
     also covers a locale switch). The pulse is driven from the interval callback
     rather than a render-time effect so it never causes a cascading render. */
  useEffect(() => {
    let pulseTimer = 0;
    let lastStamp = null;

    const update = () => {
      const date = new Date();
      setNow(date);
      const stamp = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
      if (stamp === lastStamp) return;
      lastStamp = stamp;
      setTick(true);
      clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => setTick(false), 420);
    };

    update();
    const timer = setInterval(update, 1000 * 15);
    return () => {
      clearInterval(timer);
      clearTimeout(pulseTimer);
    };
  }, [locale]);

  const time = now?.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) ?? '--:--';
  const date =
    now?.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' }) ?? '';

  /* Dismiss on outside press or Escape. The taskbar is not the only click
     target — windows sit above it — so the listener has to live on document. */
  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpenMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  const activeLocale = LOCALES.find((l) => l.id === locale) ?? LOCALES[0];
  const appsOpen = openMenu === 'apps';
  const langOpen = openMenu === 'lang';

  return (
    <div className={`taskbar${ready ? ' is-ready' : ''}`}>
      <div className="taskbar-brand">
        <img className="taskbar-avatar" src={profilePhoto} alt="" />
        H.Souaied <span>v1.0</span>
      </div>

      <div className="taskbar-windows">
        {windows.map((w, i) => (
          <button
            key={w.id}
            className={`taskbar-item ${
              w.id === activeId && !w.minimized ? 'active' : w.minimized ? 'minimized' : ''
            }`}
            style={{ '--i': i }}
            onClick={() => onToggle(w.id)}
          >
            <span className="taskbar-item-sheen" aria-hidden="true" />
            <AppIcon name={APPS[w.appId].icon} size={15} />
            {t(APPS[w.appId].titleKey)}
          </button>
        ))}
      </div>

      <div className="taskbar-tools" ref={menuRef}>
        <div className="taskbar-apps">
          <Magnetic strength={0.22}>
            <button
              type="button"
              className={`taskbar-apps-btn${appsOpen ? ' open' : ''}`}
              onClick={() => setOpenMenu((open) => (open === 'apps' ? null : 'apps'))}
              aria-haspopup="menu"
              aria-expanded={appsOpen}
              aria-label={t('taskbar.apps')}
              title={t('taskbar.apps')}
            >
              <AppIcon name="grid" size={17} />
            </button>
          </Magnetic>

          {appsOpen && (
            <div className="taskbar-apps-menu" role="menu" aria-label={t('taskbar.apps')}>
              {DESKTOP_ICONS.map((id, i) => {
                const app = APPS[id];
                const name = t(app.titleKey);
                const win = windows.find((w) => w.appId === id);
                return (
                  <button
                    key={id}
                    type="button"
                    role="menuitem"
                    className={`taskbar-apps-opt${win ? ' running' : ''}`}
                    style={{ '--i': i }}
                    onClick={() => {
                      onOpen(id);
                      setOpenMenu(null);
                    }}
                    aria-label={t('taskbar.openApp', { name })}
                    title={t('taskbar.openApp', { name })}
                  >
                    <AppIcon name={app.icon} size={17} />
                    <span className="taskbar-apps-name">{name}</span>
                    {win && <span className="taskbar-apps-dot" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="taskbar-lang">
          <Magnetic strength={0.22}>
            <button
              type="button"
              className={`taskbar-lang-btn${langOpen ? ' open' : ''}`}
              onClick={() => setOpenMenu((open) => (open === 'lang' ? null : 'lang'))}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              aria-label={t('taskbar.changeLanguage', { name: activeLocale.label })}
              title={t('taskbar.changeLanguage', { name: activeLocale.label })}
            >
              <AppIcon name="globe" size={17} />
            </button>
          </Magnetic>

          {langOpen && (
            <div className="taskbar-lang-menu" role="menu" aria-label={t('taskbar.language')}>
              {LOCALES.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={l.id === locale}
                  className={`taskbar-lang-opt${l.id === locale ? ' active' : ''}`}
                  style={{ '--i': i }}
                  lang={l.id}
                  onClick={() => {
                    setLocale(l.id);
                    setOpenMenu(null);
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
      </div>

      <Magnetic strength={0.24}>
        <button
          className="taskbar-wallpaper"
          onClick={onCycleWallpaper}
          aria-label={t('taskbar.changeWallpaper', { name: wallpaperName })}
          title={t('taskbar.wallpaper', { name: wallpaperName })}
        >
          <AppIcon name="paint" size={17} />
        </button>
      </Magnetic>

      <div className={`taskbar-clock${tick ? ' tick' : ''}`}>
        <span>{time}</span>
        <span className="small">{date}</span>
      </div>
    </div>
  );
}