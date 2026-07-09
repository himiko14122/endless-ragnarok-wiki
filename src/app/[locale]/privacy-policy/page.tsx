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
    title: `${t('nav_privacyPolicy')} | ${t('site_title')}`,
    description: t('page_privacyPolicy_description'),
    alternates: {
      canonical: `${SITE_URL}/privacy-policy`,
      languages: {
        'en': `${SITE_URL}/privacy-policy`,
        'de': `${SITE_URL}/de/privacy-policy`,
        'uk': `${SITE_URL}/uk/privacy-policy`,
        'ja': `${SITE_URL}/ja/privacy-policy`,
      },
    },
    keywords: ['Endless Ragnarok Wiki Privacy Policy', 'Endless Ragnarok privacy', 'Endless Ragnarok data collection'],
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const t = await getTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[var(--font-heading)] gradient-text">{t('privacyPolicy_title')}</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">{t('privacyPolicy_lastUpdated')}</p>

      {/* Introduction */}
      <section className="mb-10">
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('privacyPolicy_intro')}
        </p>
      </section>

      {/* Information We Collect */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_infoCollect_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('privacyPolicy_infoCollect_p1')}
        </p>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_infoCollect_auto')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_infoCollect_cookies')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-warning)] mt-0.5">•</span>
            <span className="font-semibold">{t('privacyPolicy_infoCollect_noPersonal')}</span>
          </li>
        </ul>
      </section>

      {/* How We Use Information */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_howUse_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('privacyPolicy_howUse_p1')}
        </p>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_howUse_analytics')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_howUse_performance')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_howUse_preferences')}</span>
          </li>
        </ul>
      </section>

      {/* Third-Party Services */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_thirdParty_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('privacyPolicy_thirdParty_p1')}
        </p>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_thirdParty_ga')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_thirdParty_steam')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_thirdParty_discord')}</span>
          </li>
        </ul>
      </section>

      {/* Children's Privacy */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_children_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('privacyPolicy_children_p1')}
        </p>
      </section>

      {/* Your Data Rights */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_dataRights_title')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('privacyPolicy_dataRights_p1')}
        </p>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_dataRights_optOut')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_dataRights_cookies')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5">•</span>
            <span>{t('privacyPolicy_dataRights_contact')}</span>
          </li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_security_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('privacyPolicy_security_p1')}
        </p>
      </section>

      {/* Changes to This Policy */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_changes_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('privacyPolicy_changes_p1')}
        </p>
      </section>

      {/* Contact Us */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 font-[var(--font-heading)]">{t('privacyPolicy_contact_title')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('privacyPolicy_contact_p1')}
        </p>
      </section>

      <div className="mt-8 flex gap-4">
        <Link href="/terms-of-service" className="btn-primary">{t('nav_termsOfService')} &rarr;</Link>
        <Link href="/" className="btn-secondary">&larr; {t('nav_home')}</Link>
      </div>
    </div>
  );
}
