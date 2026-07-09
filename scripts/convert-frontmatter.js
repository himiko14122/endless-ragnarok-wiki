const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');
const languages = ['en', 'es', 'ja', 'pt'];

function yamlValueToJs(val, indent) {
  // Already looks like a JS array: ["a", "b"]
  if (val.trim().startsWith('[')) return val.trim();
  // Already quoted string
  if (val.startsWith('"') && val.endsWith('"')) return val;
  // Unquoted string — quote it
  return JSON.stringify(val.trim());
}

function convertFrontmatter(content) {
  // Must start with ---
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) return null;

  const secondDelim = content.indexOf('\n---\n', 4);
  if (secondDelim === -1) return null;

  const fmBlock = content.substring(4, secondDelim);
  const body = content.substring(secondDelim + 5); // skip \n---\n

  // Parse YAML key-value pairs
  const lines = fmBlock.split('\n');
  const entries = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      // Multiline array continuation — skip, we handle arrays as single-line
      continue;
    }

    const key = trimmed.substring(0, colonIdx).trim();
    const val = trimmed.substring(colonIdx + 1).trim();
    entries.push({ key, val });
  }

  // Build JavaScript export
  let exportBlock = 'export const metadata = {\n';
  for (let i = 0; i < entries.length; i++) {
    const { key, val } = entries[i];
    const jsVal = yamlValueToJs(val);
    exportBlock += `  ${key}: ${jsVal},\n`;
  }
  exportBlock += '};\n';

  // Trim leading whitespace from body to avoid double blank lines after };
  const trimmedBody = body.replace(/^\n+/, '');

  return exportBlock + '\n' + trimmedBody;
}

let totalConverted = 0;
let totalSkipped = 0;

for (const lang of languages) {
  const guidesDir = path.join(contentDir, lang, 'guides');
  if (!fs.existsSync(guidesDir)) continue;

  const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(guidesDir, file);
    const original = fs.readFileSync(filePath, 'utf-8');
    const converted = convertFrontmatter(original);

    if (converted) {
      fs.writeFileSync(filePath, converted, 'utf-8');
      totalConverted++;
      console.log(`  OK  ${lang}/${file}`);
    } else {
      totalSkipped++;
      console.log(`  SKIP ${lang}/${file} (no frontmatter)`);
    }
  }
}

console.log(`\nDone: ${totalConverted} converted, ${totalSkipped} skipped`);
