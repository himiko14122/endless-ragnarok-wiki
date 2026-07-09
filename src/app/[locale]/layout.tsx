import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Cinzel, Nunito } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SidebarNav from '@/components/SidebarNav';
import JsonLd from '@/components/JsonLd';
import AdBanner from '@/components/AdBanner';
import { routing, type Locale } from '@/i18n/routing';
import { absoluteUrl, HERO_IMAGE, SITE_URL, GA_TRACKING_ID } from '@/config/site';
import { getAlternates, organizationJsonLd } from '@/lib/seo';
import { getOgLocale } from '@/lib/seo';
import { getAllContent, getAllContentPaths } from '@/lib/content';
import { CONTENT_TYPES } from '@/config/navigation';
import { translate } from '@/lib/i18n';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
  variable: '--font-heading',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: undefined });
  const image = absoluteUrl(HERO_IMAGE);
  const localeList = routing.locales;

  return {
    title: {
      default: t('site_title'),
      template: `%s | ${t('site_title')}`,
    },
    description: t('site_description'),
    metadataBase: new URL(SITE_URL),
    alternates: getAlternates('/', locale),
    openGraph: {
      title: t('site_title'),
      description: t('site_description'),
      url: absoluteUrl(locale === 'en' ? '/en' : `/${locale}`),
      siteName: 'Endless Ragnarok Wiki',
      locale: getOgLocale(locale),
      alternateLocale: localeList.map(getOgLocale),
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: t('site_title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('site_title'),
      description: t('site_description'),
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || '',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
      other: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  setRequestLocale(validLocale);
  const messages = await getMessages();
  const guides = await getAllContent('guides', validLocale);
  const t = await getTranslations({ locale: validLocale });
  const guideLinks = guides.map((item) => ({
    label: item.metadata.title || item.slug,
    path: item.path,
  }));

  const localePaths = getAllContentPaths(validLocale);
  const defaultPaths = validLocale !== routing.defaultLocale ? getAllContentPaths(routing.defaultLocale) : [];
  const navDropdownItems: Record<string, { label: string; path: string }[]> = {};
  for (const ct of CONTENT_TYPES) {
    const localCt = localePaths.filter(p => p.contentType === ct);
    const defaultCt = defaultPaths.filter(p => p.contentType === ct);
    const seen = new Set<string>();
    const merged: typeof localCt = [];
    for (const p of localCt) { seen.add(p.slug); merged.push(p); }
    for (const p of defaultCt) { if (!seen.has(p.slug)) merged.push(p); }
    navDropdownItems[ct] = merged.map(p => ({
      label: p.title,
      path: `/${ct}/${p.slug}`,
    }));
  }

  const adKey = process.env.NEXT_PUBLIC_AD_BANNER_KEY;

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}})()` }} />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pl30269145.effectivecpmnetwork.com" />
        {GA_TRACKING_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="lazyOnload" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_TRACKING_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className={`${cinzel.variable} ${nunito.variable} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={organizationJsonLd()} />
          <Header navDropdownItems={navDropdownItems} />
          {adKey && (
            <div className="fixed top-16 left-0 right-0 z-20 pointer-events-none">
              <div className="mx-auto max-w-4xl flex justify-center pointer-events-auto">
                <AdBanner type="banner-320x50" />
              </div>
            </div>
          )}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 xl:ml-40">{children}</main>
            <SidebarNav navDropdownItems={navDropdownItems} />
          </div>
          {adKey && (
            <aside className="fixed left-0 top-16 bottom-0 w-40 z-30 hidden xl:flex flex-col items-center pt-4 pointer-events-auto">
              <AdBanner type="banner-160x600" />
            </aside>
          )}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
