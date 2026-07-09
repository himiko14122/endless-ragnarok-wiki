import type { ComponentType } from 'react';
import { routing, type Locale } from '@/i18n/routing';
import { CONTENT_TYPES, isContentType, getContentDir, type ContentType } from '@/config/navigation';

const isDev = process.env.NODE_ENV === 'development';

export type ContentMetadata = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  slug?: string;
  date?: string;
  lastModified?: string;
  image?: string;
  video?: string;
  keywords?: string[];
  order?: number;
};

export type ContentPath = {
  locale: Locale;
  contentType: ContentType;
  slug: string;
  segments: string[];
  importPath: string;
  title: string;
};

export type LoadedContent = {
  Content: ComponentType<Record<string, unknown>>;
  metadata: ContentMetadata;
  locale: Locale;
  requestedLocale: Locale;
  contentType: ContentType;
  slug: string;
  path: string;
  isFallback: boolean;
};

type ManifestData = {
  contentPaths: ContentPath[];
  tocMap: Record<string, TocItem[]>;
};

let manifestCache: ManifestData | null = null;

function getManifest(): ManifestData | null {
  if (manifestCache) return manifestCache;
  try {
    const m = require('./content-manifest.json') as ManifestData;
    manifestCache = m;
    return m;
  } catch {
    return null;
  }
}

let contentPathsCache: ContentPath[] | null = null;
let slugMapCache: Map<string, { importPath: string; title: string }> | null = null;

export function fileNameToSlug(fileName: string) {
  return fileName
    .replace(/\.mdx$/, '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function walkMdxFilesFs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMdxFilesFs(fullPath);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [fullPath] : [];
  });
}

function extractMetaFromMdxFs(filePath: string): { slug: string | null; title: string | null } {
  try {
    const source = fs.readFileSync(filePath, 'utf-8');
    const slugMatch = source.match(/slug:\s*["']([^"']+)["']/);
    const titleMatch = source.match(/title:\s*["']([^"']+)["']/);
    return {
      slug: slugMatch ? slugMatch[1] : null,
      title: titleMatch ? titleMatch[1] : null,
    };
  } catch {
    return { slug: null, title: null };
  }
}

function parseContentFileFs(locale: Locale, contentType: ContentType, filePath: string): ContentPath {
  const dir = getContentDir(contentType);
  const relative = path.relative(path.join(contentRoot, locale, dir), filePath);
  const segments = relative.split(path.sep);
  const last = segments[segments.length - 1];
  const importPath = relative.replace(/\.mdx$/, '');

  const meta = extractMetaFromMdxFs(filePath);
  const title = meta.title || last.replace(/\.mdx$/, '').replace(/-/g, ' ');

  if (meta.slug) {
    return {
      locale,
      contentType,
      slug: meta.slug,
      segments: meta.slug.split('/'),
      importPath,
      title,
    };
  }

  const fileSlug = fileNameToSlug(last);
  return {
    locale,
    contentType,
    slug: [...segments.slice(0, -1), fileSlug].join('/'),
    segments: [...segments.slice(0, -1), fileSlug],
    importPath,
    title,
  };
}

let fs: typeof import('fs');
let path: typeof import('path');
let contentRoot: string;

if (isDev) {
  fs = require('fs');
  path = require('path');
  contentRoot = path.join(process.cwd(), 'content');
}

function getAllContentPathsFs(language?: Locale | 'en'): ContentPath[] {
  const locales = language ? [language] : routing.locales;
  const paths: ContentPath[] = [];

  for (const locale of locales) {
    for (const contentType of CONTENT_TYPES) {
      const dir = path.join(contentRoot, locale, getContentDir(contentType));
      for (const file of walkMdxFilesFs(dir)) {
        paths.push(parseContentFileFs(locale, contentType, file));
      }
    }
  }

  return paths.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getAllContentPaths(language?: Locale | 'en'): ContentPath[] {
  if (!isDev) {
    const manifest = getManifest();
    if (manifest) {
      if (contentPathsCache && !language) return contentPathsCache;
      const result = language
        ? manifest.contentPaths.filter((p) => p.locale === language)
        : manifest.contentPaths;
      if (!language) contentPathsCache = result;
      return result;
    }
  }

  if (contentPathsCache && !language) return contentPathsCache;
  const result = getAllContentPathsFs(language);
  if (!language) contentPathsCache = result;
  return result;
}

function getSlugMap(): Map<string, { importPath: string; title: string }> {
  if (slugMapCache) return slugMapCache;
  const paths = getAllContentPaths();
  slugMapCache = new Map(paths.map(p => [`${p.contentType}:${p.locale}:${p.slug}`, { importPath: p.importPath, title: p.title }]));
  return slugMapCache;
}

function findImportPath(contentType: ContentType, locale: Locale, slug: string): string | null {
  return getSlugMap().get(`${contentType}:${locale}:${slug}`)?.importPath ?? null;
}

export function findTitleForSlug(contentType: ContentType, locale: Locale, slug: string): string | null {
  return getSlugMap().get(`${contentType}:${locale}:${slug}`)?.title ?? null;
}

async function importMdxByPath(locale: Locale, contentType: ContentType, importPath: string) {
  const dir = getContentDir(contentType);
  return import(`../../content/${locale}/${dir}/${importPath}.mdx`);
}

function resolveLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
}

export async function getContent(localeInput: string, contentTypeInput: string, slugInput: string | string[]): Promise<LoadedContent | null> {
  if (!isContentType(contentTypeInput)) return null;

  const requestedLocale = resolveLocale(localeInput);
  const segments = Array.isArray(slugInput) ? slugInput : slugInput.split('/').filter(Boolean);
  const slug = segments.join('/');

  for (const locale of [requestedLocale, routing.defaultLocale]) {
    const importPath = findImportPath(contentTypeInput, locale, slug);
    if (!importPath) continue;
    try {
      const mod = await importMdxByPath(locale, contentTypeInput, importPath);
      if (!mod?.default) continue;
      const metadata = (mod.metadata || {}) as ContentMetadata;

      return {
        Content: mod.default,
        metadata: { ...metadata, slug: metadata.slug || slug },
        locale,
        requestedLocale,
        contentType: contentTypeInput as ContentType,
        slug,
        path: `/${contentTypeInput}/${slug}`,
        isFallback: locale !== requestedLocale,
      };
    } catch {
      if (locale === routing.defaultLocale) return null;
    }
  }

  return null;
}

const _getAllContent = async (contentType: ContentType, language: string) => {
  const requestedLocale = resolveLocale(language);
  const allPaths = getAllContentPaths(routing.defaultLocale);
  const englishPaths = allPaths.filter((item) => item.contentType === contentType);
  const items = await Promise.all(
    englishPaths.map((item) => getContent(requestedLocale, contentType, item.segments))
  );

  return items
    .filter((item): item is LoadedContent => Boolean(item))
    .sort((a, b) => (a.metadata.order ?? 999) - (b.metadata.order ?? 999) || a.slug.localeCompare(b.slug));
};

export const getAllContent = _getAllContent;

export function getPrevNextContent(items: LoadedContent[], slug: string) {
  const index = items.findIndex((item) => item.slug === slug);
  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index >= 0 && index < items.length - 1 ? items[index + 1] : null,
  };
}

import { slug as githubSlug } from 'github-slugger';

export type TocItem = {
  id: string;
  text: string;
};

export function slugifyHeading(text: string) {
  return githubSlug(text);
}

export function extractTocFromMdxSource(source: string): TocItem[] {
  return source
    .split('\n')
    .map((line) => line.match(/^##\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match, index) => {
      const text = match[1].replace(/\*\*/g, '').replace(/\*/g, '');
      return { id: slugifyHeading(text) || `h-${index + 1}`, text };
    });
}

export function getRawContent(localeInput: string, contentTypeInput: string, slugInput: string | string[]): string {
  if (!isContentType(contentTypeInput)) return '';
  const requestedLocale = resolveLocale(localeInput);
  const segments = Array.isArray(slugInput) ? slugInput : slugInput.split('/').filter(Boolean);
  const slug = segments.join('/');

  if (isDev) {
    for (const locale of [requestedLocale, routing.defaultLocale]) {
      const importPath = findImportPath(contentTypeInput, locale, slug);
      if (importPath) {
        const filePath = path.join(contentRoot, locale, getContentDir(contentTypeInput), `${importPath}.mdx`);
        if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf-8');
      }
    }
  }

  return '';
}

export function getTocItems(localeInput: string, contentTypeInput: string, slugInput: string | string[]): TocItem[] {
  if (!isContentType(contentTypeInput)) return [];
  const requestedLocale = resolveLocale(localeInput);
  const segments = Array.isArray(slugInput) ? slugInput : slugInput.split('/').filter(Boolean);
  const slug = segments.join('/');

  if (isDev) {
    const raw = getRawContent(localeInput, contentTypeInput, slugInput);
    return extractTocFromMdxSource(raw);
  }

  const manifest = getManifest();
  if (!manifest) return [];

  for (const locale of [requestedLocale, routing.defaultLocale]) {
    const key = `${contentTypeInput}:${locale}:${slug}`;
    if (manifest.tocMap[key]) return manifest.tocMap[key];
  }

  return [];
}

export function invalidateContentCache() {
  contentPathsCache = null;
  slugMapCache = null;
}

const _getAllContentByDate = async (language: string) => {
  const requestedLocale = resolveLocale(language);
  const allContent = await Promise.all(
    CONTENT_TYPES.map((ct) => _getAllContent(ct, requestedLocale))
  );
  const flat = allContent.flat();
  return flat.sort((a, b) => {
    const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
    const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
    if (dateB !== dateA) return dateB - dateA;
    return (b.metadata.order ?? 999) - (a.metadata.order ?? 999);
  });
};

export const getAllContentByDate = _getAllContentByDate;
