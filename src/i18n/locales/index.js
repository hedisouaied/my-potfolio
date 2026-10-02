import en from './en';
import fr from './fr';

export const DEFAULT_LOCALE = 'en';

/* Dictionaries are keyed by locale id, so adding a language is just a new file
   plus one more entry here — nothing else needs to know about it. */
export const MESSAGES = { en, fr };

/* `label` is deliberately always in its own language, never translated: you look
   for "Français" in a list, not "French". `id` doubles as the Intl locale tag. */
export const LOCALES = [
  { id: 'en', short: 'EN', label: 'English' },
  { id: 'fr', short: 'FR', label: 'Français' },
];
