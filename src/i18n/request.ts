import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

import en from '@/locales/en.json';
import de from '@/locales/de.json';
import uk from '@/locales/uk.json';
import ja from '@/locales/ja.json';

const messages = { en, de, uk, ja } as const;

type Messages = typeof en;
type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T extends JsonObject>(base: T, override: JsonObject): T {
  const result: JsonObject = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key];
    result[key] = isObject(baseValue) && isObject(value) ? deepMerge(baseValue, value) : value;
  }

  return result as T;
}

function unflattenMessages(input: JsonObject) {
  return input;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const localeMessages = messages[locale] as Messages;
  const mergedMessages = locale === routing.defaultLocale ? en : deepMerge(en, localeMessages);

  return {
    locale,
    messages: unflattenMessages(mergedMessages),
  };
});
