const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');
const languages = ['en', 'es', 'ja', 'pt'];

/**
 * Matches FAQ section headers in all supported languages.
 * EN: FAQ, Stats FAQ, Currency Guide FAQ, etc.
 * ES: Preguntas Frecuentes, Preguntas Frecuentes del Modo Infinito, etc.
 * PT: Perguntas Frequentes
 * JA: よくある質問, ステータスFAQ, etc.
 */
const FAQ_HEADER = /^##\s+.*(?:FAQ|Preguntas Frecuentes|Perguntas Frequentes|よくある質問)/i;

/**
 * In FAQ sections, puts questions and answers in separate paragraphs:
 *   **Question?**\nAnswer  →  **Question?**\n\nAnswer
 */
function separateFaqQA(content) {
  const lines = content.split('\n');
  const result = [];
  let inFaq = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // FAQ header
    if (FAQ_HEADER.test(line)) {
      inFaq = true;
      result.push(line);
      result.push(''); // blank after ## FAQ header
      continue;
    }

    // Exit FAQ section on next non-FAQ ## heading
    if (inFaq && /^##/.test(line) && !FAQ_HEADER.test(line)) {
      inFaq = false;
      result.push(line);
      continue;
    }

    // FAQ question line: ensure blank line after it
    if (inFaq && /^\*\*.*[?？]\*\*$/.test(line.trim())) {
      result.push(line);
      result.push(''); // blank between question and answer
      continue;
    }

    result.push(line);
  }

  return result.join('\n');
}

let totalFixed = 0;

for (const lang of languages) {
  const guidesDir = path.join(contentDir, lang, 'guides');
  if (!fs.existsSync(guidesDir)) continue;

  for (const file of fs.readdirSync(guidesDir).filter(f => f.endsWith('.mdx'))) {
    const filePath = path.join(guidesDir, file);
    const original = fs.readFileSync(filePath, 'utf-8');
    const fixed = separateFaqQA(original);

    if (fixed !== original) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      totalFixed++;
      console.log(`  FIX  ${lang}/${file}`);
    }
  }
}

console.log(`\nDone: ${totalFixed} files fixed`);
