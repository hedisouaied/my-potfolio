import { useEffect, useMemo, useState } from 'react';
import { LocaleContext } from './LocaleContext';
import { DEFAULT_LOCALE, LOCALES, MESSAGES } from './locales';

const STORAGE_KEY = 'hedios:locale';

const readStoredLocale = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return LOCALES.some((l) => l.id === saved) ? saved : DEFAULT_LOCALE;
};

const lookup = (dict, key) => key.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), dict);

/* Falls back to English for any key a translation forgot, then to the raw key
   itself, so a missing string shows up as "apps.about" rather than a blank. */
const translate = (messages, key, vars) => {
  const raw = lookup(messages, key) ?? lookup(MESSAGES[DEFAULT_LOCALE], key);
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string') return key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
};

export default function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(readStoredLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => {
    const messages = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
    return {
      locale,
      setLocale,
      t: (key, vars) => translate(messages, key, vars),
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
