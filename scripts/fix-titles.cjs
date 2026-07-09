const fs = require("fs");
const path = require("path");

const locales = ["en", "de", "uk", "ja"];
let fixed = 0;

for (const locale of locales) {
  const baseDir = path.join("content", locale);
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) { walk(fp); continue; }
      if (!f.endsWith(".mdx")) continue;

      let content = fs.readFileSync(fp, "utf8");
      const match = content.match(/export const metadata = \{([\s\S]*?)\};/);
      if (!match) continue;
      const body = match[1];

      const titleKeyMatch = body.match(/titleKey:\s*"([^"]*)"/);
      if (!titleKeyMatch) continue;

      const titleKeyValue = titleKeyMatch[1];

      const titleMatch = body.match(/title:\s*"([^"]*)"/);
      if (!titleMatch) continue;

      if (titleMatch[1] !== titleKeyValue) {
        const oldTitleLine = content.match(/title:\s*"[^"]*"/)[0];
        const escaped = titleKeyValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const newTitleLine = 'title: "' + escaped + '"';
        content = content.replace(oldTitleLine, newTitleLine);
        fs.writeFileSync(fp, content);
        fixed++;
        console.log("Fixed: " + locale + "/" + f + ": " + titleMatch[1] + " -> " + titleKeyValue);
      }
    }
  }
  walk(baseDir);
}
console.log("Total fixed:", fixed);
