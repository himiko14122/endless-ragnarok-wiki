import type { getTranslations } from 'next-intl/server';

export type Translator = Awaited<ReturnType<typeof getTranslations>>;

export function translate(t: Pick<Translator, 'has'> & ((key: string) => string), key: string | undefined, fallback = '') {
  if (!key) return fallback;
  if (t.has(key)) return t(key);
  return fallback || key;
}
