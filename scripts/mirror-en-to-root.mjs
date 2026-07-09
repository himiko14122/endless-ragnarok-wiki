import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'out');
const EN_DIR = path.join(OUT_DIR, 'en');

if (!fs.existsSync(EN_DIR)) {
  console.log('No en/ directory found, skipping mirror.');
  process.exit(0);
}

// Only mirror the English homepage to root — NOT the entire en/ directory.
// With localePrefix: 'always', English pages should live under /en/ only.
// The homepage at /en/index.html is copied to /index.html so the root URL works.
const enIndexHtml = path.join(EN_DIR, 'index.html');
const rootIndexHtml = path.join(OUT_DIR, 'index.html');

if (fs.existsSync(enIndexHtml)) {
  fs.copyFileSync(enIndexHtml, rootIndexHtml);
  console.log('Mirrored en/index.html to root index.html');
} else {
  console.log('No en/index.html found, skipping mirror.');
}
