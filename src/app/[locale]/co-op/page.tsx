import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { getAllContent } from '@/lib/content';
import { getBaseMetadata } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { NAVIGATION_CONFIG } from '@/config/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const nav = NAVIGATION_CONFIG.find((item) => item.key === 'co-op');
  return getBaseMetadata('/co-op', locale, nav ? t(nav.labelKey) : 'co-op', t('section_guides_desc'));
}

export default async function CoOpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();
  const nav = NAVIGATION_CONFIG.find((item) => item.key === 'co-op');
  const title = nav ? t(nav.labelKey) : 'co-op';
  const items = await getAllContent('co-op', validLocale);
  const sorted = [...items].sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[var(--font-heading)] gradient-text">{title}</h1>
      <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed text-[0.9375rem]">{t('category_coop_overview')}</p>

      {/* Feature Data Table */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 font-[var(--font-heading)] text-[var(--color-accent)]">&#128202; Key Information</h2>
        <div className="card overflow-hidden" dangerouslySetInnerHTML={{ __html: t('category_feature_coop_html') }} />
      </section>

      {/* QuickTips */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 font-[var(--font-heading)] text-[var(--color-accent)]">&#9889; Quick Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2"><span className="text-[var(--color-accent)] mt-0.5">&#128161;</span><span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{t('category_coop_quicktips_1')}</span></li>
          <li className="flex items-start gap-2"><span className="text-[var(--color-accent)] mt-0.5">&#128161;</span><span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{t('category_coop_quicktips_2')}</span></li>
          <li className="flex items-start gap-2"><span className="text-[var(--color-accent)] mt-0.5">&#128161;</span><span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{t('category_coop_quicktips_3')}</span></li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6 font-[var(--font-heading)] text-[var(--color-accent)]">&#10067; Frequently Asked Questions</h2>
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 text-[var(--color-text-primary)]">{t('category_coop_faq_1')}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{t('category_coop_faq_1_answer')}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 text-[var(--color-text-primary)]">{t('category_coop_faq_2')}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{t('category_coop_faq_2_answer')}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 text-[var(--color-text-primary)]">{t('category_coop_faq_3')}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{t('category_coop_faq_3_answer')}</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 font-[var(--font-heading)] text-[var(--color-accent)]">&#11088; {t('guides_featured')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {sorted.slice(0, 3).map((item) => (
            <Link key={item.slug} href={item.path} className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-200">
              {item.metadata.image && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image src={item.metadata.image} alt={item.metadata.title || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors">{item.metadata.title || item.slug}</h3>
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">{item.metadata.description}</p>
                <span className="text-sm font-semibold text-[var(--color-accent)] group-hover:underline">{t('read_more')} &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {sorted.length > 3 && (
        <section>
          <h2 className="text-xl font-bold mb-6 font-[var(--font-heading)] text-[var(--color-accent)]">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.slice(3).map((item) => (
              <Link key={item.slug} href={item.path} className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-200">
                {item.metadata.image && (
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image src={item.metadata.image} alt={item.metadata.title || ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors">{item.metadata.title || item.slug}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{item.metadata.description}</p>
                  <span className="text-sm text-[var(--color-accent)] group-hover:underline mt-2 inline-block">{t('read_more')} &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
