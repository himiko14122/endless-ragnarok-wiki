import { routing, type Locale } from '@/i18n/routing';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://endlessragnarokwiki.wiki';
export const SITE_NAME = 'Endless Ragnarok Wiki';
export const HERO_IMAGE = '/images/hero.webp';
export const LOGO_IMAGE = '/favicon.svg';
export const TWITTER_HANDLE = '@granbluefantasy';
export const GA_TRACKING_ID = 'G-HG8RLGV3RP';

export const SLUG_PREFIX = 'Endless-Ragnarok-';

export const EXTERNAL_LINKS = {
  steam: 'https://store.steampowered.com/app/881020/Granblue_Fantasy_Relink/',
  discord: 'https://discord.gg/granbluefantasy',
  youtube: 'https://www.youtube.com/@cygames',
  official: 'https://relink-ragnarok.granbluefantasy.com/en/',
} as const;

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function localizedPath(locale: Locale | string, path = '/') {
  const normalized = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return normalized === '/' ? '/' : `/en${normalized}`;
  }
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}
