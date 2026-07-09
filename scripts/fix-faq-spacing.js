const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');
const languages = ['en', 'es', 'ja', 'pt'];

function fixFaqSpacing(content) {
  const lines = content.split('\n');
  const result = [];
  let inFaq = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isFaqHeader = /^##\s+.*FAQ/i.test(line);
    const isFaqQuestion = /^\*\*.*\?\*\*$/.test(line.trim());
    const prevLine = result.length > 0 ? result[result.length - 1] : null;
    const isPrevBlank = prevLine !== null && prevLine.trim() === '';

    // FAQ header detected
    if (isFaqHeader) {
      inFaq = true;
      result.push(line);
      continue;
    }

    // Exit FAQ section on next non-FAQ heading
    if (inFaq && /^##/.test(line) && !isFaqHeader) {
      inFaq = false;
      result.push(line);
      continue;
    }

    // Inside FAQ: ensure blank line before each question
    if (inFaq && isFaqQuestion) {
      if (!isPrevBlank && prevLine !== null && prevLine.trim() !== '') {
        result.push(''); // single blank separator
      }
      result.push(line);
      continue;
    }

    result.push(line);
  }

  // Remove trailing blank lines at end of file to prevent multiple runs adding more
  while (result.length > 0 && result[result.length - 1].trim() === '') {
    result.pop();
  }

  return result.join('\n') + '\n';
}

let totalFixed = 0;

for (const lang of languages) {
  const guidesDir = path.join(contentDir, lang, 'guides');
  if (!fs.existsSync(guidesDir)) continue;

  const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(guidesDir, file);
    const original = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixFaqSpacing(original);

    if (fixed !== original) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      totalFixed++;
      console.log(`  FIX  ${lang}/${file}`);
    }
  }
}

console.log(`\nDone: ${totalFixed} files fixed`);
