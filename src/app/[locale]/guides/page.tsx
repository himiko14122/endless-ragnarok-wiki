import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { getAllContent } from '@/lib/content';
import { getBaseMetadata } from '@/lib/seo';
import { Link } from '@/i18n/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return getBaseMetadata('/guides', locale, t('nav_guides'), t('page_guides_description'));
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();
  const items = await getAllContent('guides', validLocale);
  const sorted = [...items].sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
  const featured = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[var(--font-heading)] gradient-text">{t('nav_guides')}</h1>
      <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed text-[0.9375rem]">{t('section_guides_desc')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 font-[var(--font-heading)] text-[var(--color-accent)]">⭐ {t('guides_featured')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <Link key={item.slug} href={item.path} className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-200">
              {item.metadata.image && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image src={item.metadata.image} alt={item.metadata.title || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors">{item.metadata.title || item.slug}</h3>
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">{item.metadata.description}</p>
                <span className="text-sm font-semibold text-[var(--color-accent)] group-hover:underline">{t('read_more')} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {remaining.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6 font-[var(--font-heading)] text-[var(--color-accent)]">All Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {remaining.map((item) => (
              <Link key={item.slug} href={item.path} className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-200">
                {item.metadata.image && (
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image src={item.metadata.image} alt={item.metadata.title || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors">{item.metadata.title || item.slug}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{item.metadata.description}</p>
                  <span className="text-sm text-[var(--color-accent)] group-hover:underline mt-2 inline-block">{t('read_more')} →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
