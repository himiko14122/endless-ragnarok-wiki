import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import JsonLd from '@/components/JsonLd';
import GuideSidebar from '@/components/GuideSidebar';
import { Link } from '@/i18n/navigation';
import { NAVIGATION_CONFIG, isContentType, getNavigationItem, GUIDE_CATEGORIES, CATEGORY_ORDER, CATEGORY_AFFINITY, CONTENT_TYPES, type ContentType } from '@/config/navigation';
import { getAllContent, getAllContentPaths, getContent, getPrevNextContent, getTocItems } from '@/lib/content';
import { articleJsonLd, breadcrumbJsonLd, getBaseMetadata, itemListJsonLd } from '@/lib/seo';
import { translate } from '@/lib/i18n';
import AdBanner from '@/components/AdBanner';
import ArticleContent from '@/components/ArticleContent';
import ArticleVideo from '@/components/ArticleVideo';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const CONTENT_TYPES_WITH_DEDICATED_PAGES = new Set(CONTENT_TYPES);

export async function generateStaticParams() {
  const contentParams = getAllContentPaths('en').flatMap((item) =>
    routing.locales.map((locale) => ({
      locale,
      slug: [item.contentType, ...item.segments],
    }))
  );
  return contentParams;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  const [first, ...rest] = slug;
  const path = `/${slug.join('/')}`;

  if (rest.length > 0 && isContentType(first)) {
    const content = await getContent(validLocale, first, rest);
    if (!content) return {};
    const t = await getTranslations({ locale: validLocale });
    const title = content.metadata.title || content.slug;
    return getBaseMetadata(path, validLocale, title, content.metadata.description || '', 'article', content.metadata.image);
  }

  if (CONTENT_TYPES_WITH_DEDICATED_PAGES.has(first as ContentType) && rest.length === 0) {
    return {};
  }

  if (isContentType(first)) {
    const t = await getTranslations({ locale: validLocale });
    const nav = NAVIGATION_CONFIG.find((item) => item.key === first);
    return getBaseMetadata(path, validLocale, t(nav?.labelKey || 'nav_home'), t('section_guides_desc'));
  }

  const t = await getTranslations({ locale: validLocale });
  const nav = NAVIGATION_CONFIG.find((item) => item.path === path);
  return getBaseMetadata(path, validLocale, t(nav?.labelKey || 'site_title'), t('page_home_description'));
}

export default async function CatchAllPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();
  const [first, ...rest] = slug;
  const adKey = process.env.NEXT_PUBLIC_AD_BANNER_KEY;

  if (CONTENT_TYPES_WITH_DEDICATED_PAGES.has(first as ContentType) && rest.length === 0) {
    notFound();
  }

  if (isContentType(first)) {
    const content = await getContent(validLocale, first, rest);
    if (!content) notFound();

    const title = content.metadata.title || content.slug;
    const allItems = await getAllContent(first, validLocale);
    const { prev, next } = getPrevNextContent(allItems, content.slug);
    const tocItems = getTocItems(validLocale, first, rest);
    const GUIDE_STOP_WORDS = new Set(['endless', 'ragnarok', 'granblue', 'fantasy', 'relink', 'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'is', 'it', 'guide', 'how', 'what', 'all', 'vs', 'game']);
    const currentCategory = content.metadata.category;
    const currentKeywords = (content.metadata.keywords || []).map((k) => k.toLowerCase());
    const currentTitleWords = (content.metadata.title || content.slug).toLowerCase().split(/[\s\-:]+/).filter((w) => w.length > 2 && !GUIDE_STOP_WORDS.has(w));
    const moreGuidesSource = first === 'guides' ? allItems : await getAllContent('guides', validLocale);
    const scored = moreGuidesSource
      .filter((item) => item.slug !== content.slug)
      .map((item) => {
        let score = 0;
        if (item.metadata.category === currentCategory) score += 3;
        if (item.metadata.category && currentCategory) {
          if (CATEGORY_AFFINITY[currentCategory]?.includes(item.metadata.category)) score += 1;
        }
        const itemKeywords = (item.metadata.keywords || []).map((k) => k.toLowerCase());
        const kwOverlap = currentKeywords.filter((k) => itemKeywords.some((ik) => ik.includes(k) || k.includes(ik))).length;
        score += Math.min(kwOverlap, 4);
        const itemTitleWords = (item.metadata.title || item.slug).toLowerCase().split(/[\s\-:]+/).filter((w) => w.length > 2 && !GUIDE_STOP_WORDS.has(w));
        const titleOverlap = currentTitleWords.filter((w) => itemTitleWords.includes(w)).length;
        score += Math.min(titleOverlap, 4);
        if (item.metadata.difficulty === content.metadata.difficulty) score += 1;
        const hash = (content.slug + item.slug).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        score += (hash % 100) / 200;
        return { item, score };
      })
      .sort((a, b) => b.score - a.score || (a.item.metadata.order ?? 99) - (b.item.metadata.order ?? 99));
    const moreGuides = scored.slice(0, 5).map(({ item }) => ({
      title: item.metadata.title || item.slug,
      href: item.path,
      category: item.metadata.category,
    }));

    const ContentComponent = content.Content;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <JsonLd data={articleJsonLd({ title, description: content.metadata.description || '', path: content.path, locale: validLocale, datePublished: content.metadata.date, dateModified: content.metadata.lastModified, image: content.metadata.image })} />
        <JsonLd data={breadcrumbJsonLd([{ name: t('nav_home'), path: '/' }, { name: t(getNavigationItem(first)!.labelKey), path: `/${first}` }, { name: title, path: content.path }], validLocale)} />

        <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">{t('nav_home')}</Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <Link href={`/${first}`} className="hover:text-[var(--color-accent)] transition-colors">{t(getNavigationItem(first)!.labelKey)}</Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-[var(--color-text-primary)] font-medium">{title}</span>
        </nav>

        <div className="flex gap-10">
          <div className="min-w-0 flex-1 max-w-4xl">
            {content.isFallback && (
              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400/80 flex items-center gap-2">
                <span className="text-base">⚠</span> {t('content_fallbackNotice')}
              </div>
            )}

            <div className="mb-10 pb-8 border-b border-[var(--color-border)] relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-transparent rounded-t-full opacity-60" />
              <div className="flex items-center gap-2 mb-4 pt-1">
                {content.metadata.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{t(`guide_category_${content.metadata.category}`)}</span>
                )}
                {content.metadata.difficulty && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)]">{content.metadata.difficulty}</span>
                )}
                {content.metadata.lastModified && (
                  <span className="text-[10px] text-[var(--color-text-muted)]">{t('common_updated')}: {new Date(content.metadata.lastModified).toLocaleDateString(validLocale)}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] gradient-text leading-tight mb-5">{title}</h1>
              {content.metadata.description && <p className="text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed">{content.metadata.description}</p>}
            </div>

            {content.metadata.video && (
              <ArticleVideo videoId={content.metadata.video} title={title} />
            )}

            {adKey && (
              <div className="flex justify-center py-4 mb-8">
                <AdBanner type="native-banner" />
              </div>
            )}

            <ArticleContent showAds={!!adKey}>
              <ContentComponent />
            </ArticleContent>

            {adKey && (
              <div className="flex justify-center py-6 mt-6">
                <div className="hidden md:block">
                  <AdBanner type="banner-728x90" />
                </div>
                <div className="block md:hidden">
                  <AdBanner type="banner-468x60" />
                </div>
              </div>
            )}

            <div className="mt-14 border-t border-[var(--color-border)] pt-8">
              <div className="flex justify-between gap-4">
                {prev ? (
                  <Link href={prev.path} className="group flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.08] px-5 py-4 flex-1 hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_20px_rgba(0,200,255,0.06)] transition-all duration-300 card-accent-bar">
                    <span className="text-[10px] text-[var(--color-accent)] uppercase tracking-wider font-semibold">{t('guide_nav_prev')}</span>
                    <span className="text-sm font-semibold group-hover:text-[var(--color-accent)] transition-colors truncate">{prev.metadata.title || prev.slug}</span>
                  </Link>
                ) : <div className="flex-1" />}
                {next ? (
                  <Link href={next.path} className="group flex items-center justify-end gap-3 rounded-xl bg-white/[0.03] border border-white/[0.08] px-5 py-4 flex-1 text-right hover:border-[var(--color-accent-secondary)]/40 hover:shadow-[0_0_20px_rgba(255,215,0,0.06)] transition-all duration-300 card-accent-bar">
                    <span className="text-[10px] text-[var(--color-accent-secondary)] uppercase tracking-wider font-semibold">{t('guide_nav_next')}</span>
                    <span className="text-sm font-semibold group-hover:text-[var(--color-accent-secondary)] transition-colors truncate">{next.metadata.title || next.slug}</span>
                  </Link>
                ) : <div className="flex-1" />}
              </div>
              <div className="mt-6">
                <Link href={`/${first}`} className="btn-secondary">{t('guide_nav_all')}</Link>
              </div>
            </div>
          </div>

          {tocItems.length > 0 && <GuideSidebar tocItems={tocItems} moreGuides={moreGuides} contentType={first} />}
        </div>
      </div>
    );
  }

  notFound();
}
