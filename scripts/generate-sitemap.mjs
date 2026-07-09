import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://endlessragnarokwiki.wiki';
const LOCALES = ['en', 'de', 'ja', 'uk'];
const CONTENT_TYPES = ['guides', 'tier-list', 'conflux', 'master-traits', 'characters', 'weapon-transcendence', 'summons', 'sigils', 'bosses', 'co-op', 'story-walkthrough', 'endgame', 'builds'];
const NAV_PAGES = [
  { path: '/', priority: 1, changefreq: 'daily' },
  { path: '/guides', priority: 0.9, changefreq: 'weekly' },
  { path: '/tier-list', priority: 0.9, changefreq: 'weekly' },
  { path: '/conflux', priority: 0.9, changefreq: 'weekly' },
  { path: '/master-traits', priority: 0.8, changefreq: 'weekly' },
  { path: '/characters', priority: 0.8, changefreq: 'weekly' },
  { path: '/weapon-transcendence', priority: 0.8, changefreq: 'weekly' },
  { path: '/summons', priority: 0.8, changefreq: 'weekly' },
  { path: '/sigils', priority: 0.8, changefreq: 'weekly' },
  { path: '/bosses', priority: 0.8, changefreq: 'weekly' },
  { path: '/co-op', priority: 0.8, changefreq: 'weekly' },
  { path: '/story-walkthrough', priority: 0.7, changefreq: 'weekly' },
  { path: '/endgame', priority: 0.8, changefreq: 'weekly' },
  { path: '/builds', priority: 0.8, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.4, changefreq: 'yearly' },
  { path: '/terms-of-service', priority: 0.4, changefreq: 'yearly' },
];

function localizedPath(locale, p) {
  // English homepage is at root, other pages use /en/ prefix
  // All URLs must have trailing slash (trailingSlash: true in next.config.mjs)
  const trailingSlash = p === '/' ? '/' : `${p}/`;
  if (locale === 'en') {
    return p === '/' ? '/' : `/en${trailingSlash}`;
  }
  return p === '/' ? `/${locale}/` : `/${locale}${trailingSlash}`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildAlternates(locale, pagePath) {
  const lines = [];
  // Include ALL locales including self-referencing (Google best practice)
  for (const l of LOCALES) {
    const alp = localizedPath(l, pagePath);
    lines.push(`    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${alp}" />`);
  }
  // x-default always points to the default locale version
  const xDefaultPath = localizedPath('en', pagePath);
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${xDefaultPath}" />`);
  return lines.join('\n');
}

const manifestPath = path.join(process.cwd(), 'src', 'lib', 'content-manifest.json');
let contentPaths = [];
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  contentPaths = manifest.contentPaths || [];
}

const now = new Date().toISOString().split('T')[0];
const urls = [];

for (const page of NAV_PAGES) {
  for (const locale of LOCALES) {
    const lp = localizedPath(locale, page.path);
    const alternates = buildAlternates(locale, page.path);
    urls.push(`  <url>\n    <loc>${SITE_URL}${lp}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n${alternates}\n  </url>`);
  }
}

for (const item of contentPaths) {
  const contentPath = `/${item.contentType}/${item.slug}`;
  const lp = localizedPath(item.locale, contentPath);
  const alternates = buildAlternates(item.locale, contentPath);
  urls.push(`  <url>\n    <loc>${SITE_URL}${lp}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n${alternates}\n  </url>`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated: ${urls.length} URLs`);
