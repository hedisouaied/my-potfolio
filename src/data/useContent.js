import { useMemo } from 'react';
import { useLocale } from '../i18n/useLocale';
import { getContent } from './profile';

export default function useContent() {
  const { locale } = useLocale();
  return useMemo(() => getContent(locale), [locale]);
}
