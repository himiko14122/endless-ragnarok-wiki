'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocale } from 'next-intl';
import AdBanner from '@/components/AdBanner';

function AdSlotBanner() {
  return (
    <div className="flex justify-center py-4 my-6">
      <AdBanner type="banner-300x250" />
    </div>
  );
}

function AdSlotResponsive() {
  return (
    <div className="flex justify-center py-4 my-6">
      <div className="hidden md:block">
        <AdBanner type="banner-728x90" />
      </div>
      <div className="block md:hidden">
        <AdBanner type="banner-468x60" />
      </div>
    </div>
  );
}

interface ArticleContentProps {
  children: React.ReactNode;
  showAds?: boolean;
}

export default function ArticleContent({ children, showAds = true }: ArticleContentProps) {
  const articleRef = useRef<HTMLElement>(null);
  const rootsRef = useRef<ReturnType<typeof createRoot>[]>([]);
  const locale = useLocale();

  useEffect(() => {
    if (!articleRef.current) return;
    const anchors = articleRef.current.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
    if (locale === 'en') {
      anchors.forEach((a) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/en/')) {
          a.setAttribute('href', href.replace(/^\/en/, ''));
        }
      });
    } else {
      const localePrefix = `/${locale}/`;
      anchors.forEach((a) => {
        if (!a.getAttribute('href')?.startsWith(localePrefix) && !a.getAttribute('href')?.startsWith(`/${locale}`)) {
          const href = a.getAttribute('href')!;
          const trailing = href.endsWith('/') ? '' : '/';
          a.setAttribute('href', `/${locale}${href.startsWith('/') ? '' : '/'}${href}${trailing}`);
        }
      });
    }
  }, [locale]);

  useEffect(() => {
    if (!showAds || !articleRef.current) return;

    let cancelled = false;

    requestAnimationFrame(() => {
      if (cancelled) return;
      const article = articleRef.current;
      if (!article || document.getElementById('ad-mid-1') || document.getElementById('ad-mid-2')) return;

      const allChildren = Array.from(article.children);
      if (allChildren.length < 6) return;

      const totalHeight = allChildren.reduce((sum, el) => sum + (el as HTMLElement).offsetHeight, 0);
      const third = totalHeight / 3;

      let accumulated = 0;
      let insertAfter1: Element | null = null;
      let insertAfter2: Element | null = null;

      for (const child of allChildren) {
        accumulated += (child as HTMLElement).offsetHeight;

        if (!insertAfter1 && accumulated >= third) {
          insertAfter1 = child;
        }
        if (insertAfter1 && !insertAfter2 && accumulated >= third * 2) {
          insertAfter2 = child;
          break;
        }
      }

      const mountAd = (afterEl: Element, id: string, element: React.ReactElement) => {
        const container = document.createElement('div');
        container.id = id;
        afterEl.after(container);
        const root = createRoot(container);
        rootsRef.current.push(root);
        root.render(element);
      };

      if (insertAfter1) mountAd(insertAfter1, 'ad-mid-1', <AdSlotBanner />);
      if (insertAfter2) mountAd(insertAfter2, 'ad-mid-2', <AdSlotResponsive />);
    });

    return () => {
      cancelled = true;
      rootsRef.current.forEach((root) => root.unmount());
      rootsRef.current = [];
      const el1 = document.getElementById('ad-mid-1');
      const el2 = document.getElementById('ad-mid-2');
      el1?.remove();
      el2?.remove();
    };
  }, [showAds]);

  return (
    <article ref={articleRef} className="mdx-content">
      {children}
    </article>
  );
}
