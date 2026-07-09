import { Link } from '@/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { translate } from '@/lib/i18n';
import { getBaseMetadata } from '@/lib/seo';
import { SITE_URL } from '@/config/site';

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
    title: `${t('nav_termsOfService')} | ${t('site_title')}`,
    description: t('page_termsOfService_description'),
    alternates: {
      canonical: `${SITE_URL}/terms-of-service`,
      languages: {
        'en': `${SITE_URL}/terms-of-service`,
        'de': `${SITE_URL}/de/terms-of-service`,
        'uk': `${SITE_URL}/uk/terms-of-service`,
        'ja': `${SITE_URL}/ja/terms-of-service`,
      },
    },
    keywords: ['Endless Ragnarok Wiki Terms of Service', 'Endless Ragnarok terms', 'Endless Ragnarok usage terms'],
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[var(--font-heading)] gradient-text">{t('termsOfService_title')}</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">{t('termsOfService_lastUpdated')}</p>

      {/* Introduction */}
      <section className="mb-10">
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_intro')}
        </p>
      </section>

      {/* About the Site */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_aboutSite_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('termsOfService_aboutSite_p1')}
        </p>
        <div className="card border-[var(--color-warning)]/30">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {t('termsOfService_aboutSite_p2')}
          </p>
        </div>
      </section>

      {/* Acceptable Use */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_use_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('termsOfService_use_p1')}
        </p>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] mb-6">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">&#10003;</span>
            <span>{t('termsOfService_use_read')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">&#10003;</span>
            <span>{t('termsOfService_use_share')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">&#10003;</span>
            <span>{t('termsOfService_use_personal')}</span>
          </li>
        </ul>
        <h3 className="text-lg font-bold mb-3 font-[var(--font-heading)] text-[var(--color-warning)]">{t('termsOfService_use_notAllowed_title')}</h3>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-warning)] mt-0.5">&#10007;</span>
            <span>{t('termsOfService_use_notAllowed_scrape')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-warning)] mt-0.5">&#10007;</span>
            <span>{t('termsOfService_use_notAllowed_reproduce')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-warning)] mt-0.5">&#10007;</span>
            <span>{t('termsOfService_use_notAllowed_misuse')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-warning)] mt-0.5">&#10007;</span>
            <span>{t('termsOfService_use_notAllowed_interfere')}</span>
          </li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_ip_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('termsOfService_ip_p1')}
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_ip_p2')}
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_disclaimer_title')}</h2>
        <div className="card border-[var(--color-warning)]/30 mb-4">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-semibold">
            {t('termsOfService_disclaimer_p1')}
          </p>
        </div>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('termsOfService_disclaimer_p2')}
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_disclaimer_p3')}
        </p>
      </section>

      {/* Third-Party Links */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_links_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_links_p1')}
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_limitation_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_limitation_p1')}
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_changes_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_changes_p1')}
        </p>
      </section>

      {/* Contact Us */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('termsOfService_contact_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('termsOfService_contact_p1')}
        </p>
      </section>

      <div className="mt-8 flex gap-4">
        <Link href="/privacy-policy" className="btn-primary">{t('nav_privacyPolicy')} &rarr;</Link>
        <Link href="/" className="btn-secondary">&larr; {t('nav_home')}</Link>
      </div>
    </div>
  );
}
