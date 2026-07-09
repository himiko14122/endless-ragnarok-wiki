import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import {
  absoluteUrl,
  EXTERNAL_LINKS,
  HERO_IMAGE,
  localizedPath,
  LOGO_IMAGE,
  SITE_NAME,
  SITE_URL,
} from '@/config/site';

export type PageType = 'website' | 'article';

export function getAlternates(path = '/', locale: Locale | string) {
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, absoluteUrl(localizedPath(item, path))])
  );

  return {
    canonical: absoluteUrl(localizedPath(locale, path)),
    languages: {
      ...languages,
      'x-default': absoluteUrl(localizedPath(routing.defaultLocale, path)),
    },
  };
}

export function getOgLocale(locale: string) {
  if (locale === 'de') return 'de_DE';
  if (locale === 'uk') return 'uk_UA';
  if (locale === 'ja') return 'ja_JP';
  return 'en_US';
}

export function getBaseMetadata(
  path: string,
  locale: Locale | string,
  title: string,
  description: string,
  pageType: PageType = 'website',
  image?: string,
): Metadata {
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(HERO_IMAGE);

  return {
    title,
    description,
    alternates: getAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: absoluteUrl(localizedPath(locale, path)),
      siteName: SITE_NAME,
      locale: getOgLocale(locale),
      alternateLocale: routing.locales.map(getOgLocale),
      type: pageType,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_IMAGE),
    image: absoluteUrl(HERO_IMAGE),
    sameAs: [EXTERNAL_LINKS.discord, EXTERNAL_LINKS.youtube, EXTERNAL_LINKS.steam],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale | string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  locale: Locale | string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(localizedPath(input.locale, input.path)),
    image: absoluteUrl(input.image || HERO_IMAGE),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: organizationJsonLd(),
  };
}

export function itemListJsonLd(
  items: { name: string; path: string }[],
  locale: Locale | string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}
