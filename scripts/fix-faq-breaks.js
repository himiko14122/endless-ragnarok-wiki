const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');
const languages = ['en', 'es', 'ja', 'pt'];

function fixFaqLineBreaks(content) {
  const lines = content.split('\n');
  let inFaq = false;

  for (let i = 0; i < lines.length; i++) {
    // Detect FAQ section header
    if (/^##\s+.*FAQ/i.test(lines[i])) {
      inFaq = true;
      continue;
    }

    // Exit FAQ on next non-FAQ ## heading
    if (inFaq && /^##/.test(lines[i]) && !/^##\s+.*FAQ/i.test(lines[i])) {
      inFaq = false;
      continue;
    }

    // Inside FAQ: if line is a question (bold ending with ?**), append <br/>
    if (inFaq && /^\*\*.*[?？]\*\*$/.test(lines[i].trim())) {
      lines[i] = lines[i] + '<br/>';
    }
  }

  return lines.join('\n');
}

let totalFixed = 0;

for (const lang of languages) {
  const guidesDir = path.join(contentDir, lang, 'guides');
  if (!fs.existsSync(guidesDir)) continue;

  const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(guidesDir, file);
    const original = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixFaqLineBreaks(original);

    if (fixed !== original) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      totalFixed++;
      console.log(`  FIX  ${lang}/${file}`);
    }
  }
}

console.log(`\nDone: ${totalFixed} files fixed`);
