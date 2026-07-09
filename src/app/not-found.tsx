'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    const p = window.location.pathname;
    const locales = ['en', 'de', 'ja', 'uk'];
    const hasLocale = locales.some(
      (l) => p === `/${l}/` || p === `/${l}` || p.startsWith(`/${l}/`)
    );
    if (!hasLocale && p !== '/') {
      window.location.replace('/en' + p);
    }
  }, []);

  return (
    <html>
      <body>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d2b',
          color: '#a0a0c0',
        }}>
          Redirecting...
        </div>
      </body>
    </html>
  );
}
