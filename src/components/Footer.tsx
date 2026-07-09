import { getTranslations } from 'next-intl/server';
import { EXTERNAL_LINKS } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { getAllContent } from '@/lib/content';
import { getLocale } from 'next-intl/server';
import { NAVIGATION_CONFIG } from '@/config/navigation';

export default async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  const guides = await getAllContent('guides', locale);

  const categoryItems = NAVIGATION_CONFIG.filter(
    (item) => item.showInHeader && item.isContentType
  );

  const guideLinks = guides.slice(0, 5).map((item) => ({
    label: item.metadata.title || item.slug,
    href: item.path,
  }));

  const sections = [
    {
      title: t('footer_gameCategories'),
      links: categoryItems.map((item) => ({
        label: t(item.labelKey),
        href: item.path,
      })),
    },
    {
      title: t('nav_guides'),
      links: guideLinks,
    },
    {
      title: t('footer_resources'),
      links: [
        { label: t('guide_beginner'), href: '/guides' },
        { label: t('nav_about'), href: '/about' },
        { label: t('nav_sitemap'), href: '/sitemap' },
      ],
    },
    {
      title: t('footer_community'),
      links: [
        { label: t('footer_playOnSteam'), href: EXTERNAL_LINKS.steam, external: true },
        { label: t('footer_joinDiscord'), href: EXTERNAL_LINKS.discord, external: true },
        { label: t('footer_officialYouTube'), href: EXTERNAL_LINKS.youtube, external: true },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 font-[var(--font-heading)]">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    {'external' in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">{t('footer_rights')}</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacy-policy" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">{t('nav_privacyPolicy')}</Link>
            <Link href="/terms-of-service" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">{t('nav_termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
