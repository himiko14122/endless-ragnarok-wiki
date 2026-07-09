import { Link } from '@/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { translate } from '@/lib/i18n';
import { getBaseMetadata } from '@/lib/seo';
import { SITE_URL, EXTERNAL_LINKS } from '@/config/site';
import type { Metadata } from 'next';


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();
  return {
    title: `${t('nav_about')} | ${t('site_title')}`,
    description: t('page_about_description'),
    alternates: {
      canonical: `${SITE_URL}/about`,
      languages: {
        'en': `${SITE_URL}/about`,
        'de': `${SITE_URL}/de/about`,
        'uk': `${SITE_URL}/uk/about`,
        'ja': `${SITE_URL}/ja/about`,
      },
    },
    keywords: ['Endless Ragnarok Wiki', 'Endless Ragnarok about', 'Endless Ragnarok community wiki', 'Endless Ragnarok fan wiki', 'Granblue Fantasy Relink expansion'],
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[var(--font-heading)] gradient-text">{t('nav_about')}</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('about_wikiTitle')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('about_wikiP1')}
        </p>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('about_wikiP2')}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('about_gameTitle')}</h2>
        <div className="card mb-6">
          <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
            {t('about_gameP1')}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href={EXTERNAL_LINKS.steam} target="_blank" rel="noopener noreferrer" className="card text-center hover:border-[var(--color-accent)] transition-colors">
              <span className="text-2xl mb-2 block">🎮</span>
              <span className="font-bold text-sm">{t('about_playSteam')}</span>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('about_officialPage')}</p>
            </a>
            <a href={EXTERNAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="card text-center hover:border-[var(--color-accent)] transition-colors">
              <span className="text-2xl mb-2 block">💬</span>
              <span className="font-bold text-sm">{t('about_joinDiscord')}</span>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('about_communityServer')}</p>
            </a>
            <a href={EXTERNAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="card text-center hover:border-[var(--color-accent)] transition-colors">
              <span className="text-2xl mb-2 block">📺</span>
              <span className="font-bold text-sm">{t('about_watchYouTube')}</span>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('about_devChannel')}</p>
            </a>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('about_coverTitle')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '🤖', title: t('about_cover_1'), desc: t('about_cover_1_desc') },
            { icon: '⚔️', title: t('about_cover_2'), desc: t('about_cover_2_desc') },
            { icon: '🎁', title: t('about_cover_3'), desc: t('about_cover_3_desc') },
            { icon: '📊', title: t('about_cover_4'), desc: t('about_cover_4_desc') },
            { icon: '🎮', title: t('about_cover_5'), desc: t('about_cover_5_desc') },
            { icon: '👹', title: t('about_cover_6'), desc: t('about_cover_6_desc') },
          ].map((item) => (
            <div key={item.title} className="card">
              <span className="text-xl mb-2 block">{item.icon}</span>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('about_sourcesTitle')}</h2>
        <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
          {[t('about_source_1'), t('about_source_2'), t('about_source_3'), t('about_source_4')].map((text, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[var(--color-accent)] mt-0.5">•</span>
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('about_disclaimerTitle')}</h2>
        <div className="card border-[var(--color-warning)]/30">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {t('about_disclaimerP')}
          </p>
        </div>
      </section>

      <div className="mt-8">
        <Link href={'/'} className="btn-secondary">&larr; {t('nav_home')}</Link>
      </div>
    </div>
  );
}
