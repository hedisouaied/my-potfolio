import * as en from './en';
import * as fr from './fr';

import { DEFAULT_LOCALE } from '../../i18n/locales';

const BUNDLES = { en, fr };

/* Every bundle exports the same named shape, so callers destructure once and
   never branch on the locale. Unknown locales fall back to the default. */
export function getContent(locale) {
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_LOCALE];
}
