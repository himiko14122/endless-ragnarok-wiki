'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { BookOpen, ChevronRight, List } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import type { TocItem } from '@/lib/content';

export type GuideLink = {
  title: string;
  href: string;
  category?: string;
};

export default function GuideSidebar({ tocItems, moreGuides, contentType = 'guides' }: { tocItems: TocItem[]; moreGuides: GuideLink[]; contentType?: string }) {
  const t = useTranslations();
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = tocItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [tocItems]);

  const handleTocClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  }, []);

  return (
    <aside className="hidden lg:block w-80 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden scrollbar-thin space-y-4">
      {/* Table of Contents */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-sm light-card-border card-accent-bar">
        <div className="section-label mb-4">
          <List className="w-3.5 h-3.5" style={{ display: 'none' }} />
          {t('guide_sidebar_toc')}
        </div>
        <nav className="space-y-0.5">
          {tocItems.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)]">{t('content_noContent')}</p>
          ) : (
            tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleTocClick(e, item.id)}
                className={`block px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                  activeId === item.id
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold border-l-2 border-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-white/[0.04] border-l-2 border-transparent'
                }`}
              >
                {item.text}
              </a>
            ))
          )}
        </nav>
      </div>

      {/* More Guides */}
      {moreGuides.length > 0 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 backdrop-blur-sm light-card-border card-accent-bar">
          <div className="section-label mb-4">
            <BookOpen className="w-3.5 h-3.5" style={{ display: 'none' }} />
            {t('guide_sidebar_more')}
          </div>
          <div className="space-y-2">
            {moreGuides.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 hover:border-[var(--color-accent)]/30 transition-all duration-200 light-card-border-subtle">
                <ChevronRight className="w-3 h-3 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{guide.title}</p>
                  {guide.category && <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{t(`guide_category_${guide.category}`)}</p>}
                </div>
              </Link>
            ))}
          </div>
          <Link href={`/${contentType}`} className="mt-4 text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1">
            {t('guide_sidebar_all')} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* 300x250 Ad - below More Guides */}
      {process.env.NEXT_PUBLIC_AD_BANNER_KEY && (
        <div className="flex justify-center">
          <AdBanner type="banner-300x250" />
        </div>
      )}
    </aside>
  );
}
