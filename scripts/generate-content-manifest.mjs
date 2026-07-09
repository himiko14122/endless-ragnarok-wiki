import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { slug: githubSlug } = require('github-slugger');

const LOCALES = ['en', 'de', 'ja', 'uk'];
const CONTENT_TYPES = ['guides', 'tier-list', 'conflux', 'master-traits', 'characters', 'weapon-transcendence', 'summons', 'sigils', 'bosses', 'co-op', 'story-walkthrough', 'endgame', 'builds'];
const CONTENT_ROOT = path.join(process.cwd(), 'content');

function fileNameToSlug(fileName) {
  return fileName
    .replace(/\.mdx$/, '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function walkMdxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMdxFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [fullPath] : [];
  });
}

function extractMetaFromMdx(filePath) {
  try {
    const source = fs.readFileSync(filePath, 'utf-8');
    const slugMatch = source.match(/slug:\s*["']([^"']+)["']/);
    const titleMatch = source.match(/title:\s*["']([^"']+)["']/);
    return { slug: slugMatch ? slugMatch[1] : null, title: titleMatch ? titleMatch[1] : null };
  } catch {
    return { slug: null, title: null };
  }
}

function extractTocFromMdxSource(source) {
  return source
    .split('\n')
    .map((line) => line.match(/^##\s+(.+)$/))
    .filter((match) => Boolean(match))
    .map((match) => {
      const text = match[1].replace(/\*\*/g, '').replace(/\*/g, '');
      const id = githubSlug(text) || `h-${1}`;
      return { id, text };
    });
}

const contentPaths = [];
const tocMap = {};

for (const locale of LOCALES) {
  for (const contentType of CONTENT_TYPES) {
    const dir = path.join(CONTENT_ROOT, locale, contentType);
    for (const file of walkMdxFiles(dir)) {
      const relative = path.relative(path.join(CONTENT_ROOT, locale, contentType), file);
      const segments = relative.split(path.sep);
      const last = segments[segments.length - 1];
      const importPath = relative.replace(/\.mdx$/, '');

      const meta = extractMetaFromMdx(file);
      const title = meta.title || last.replace(/\.mdx$/, '').replace(/-/g, ' ');

      let slug;
      let slugSegments;
      if (meta.slug) {
        slug = meta.slug;
        slugSegments = meta.slug.split('/');
      } else {
        const fileSlug = fileNameToSlug(last);
        slug = [...segments.slice(0, -1), fileSlug].join('/');
        slugSegments = [...segments.slice(0, -1), fileSlug];
      }

      contentPaths.push({
        locale,
        contentType,
        slug,
        segments: slugSegments,
        importPath,
        title,
      });

      const tocKey = `${contentType}:${locale}:${slug}`;
      const source = fs.readFileSync(file, 'utf-8');
      const tocItems = extractTocFromMdxSource(source);
      if (tocItems.length > 0) {
        tocMap[tocKey] = tocItems;
      }
    }
  }
}

contentPaths.sort((a, b) => a.slug.localeCompare(b.slug));

const manifest = {
  contentPaths,
  tocMap,
};

const outputPath = path.join(process.cwd(), 'src', 'lib', 'content-manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log(`Content manifest generated: ${contentPaths.length} paths, ${Object.keys(tocMap).length} ToC entries`);
