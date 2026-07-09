const fs = require('fs');
const path = require('path');

const knownSlugs = new Set([
  "beginners-guide","storm-dive-advanced-guide","solo-play-guide","pvp-guide","trampler-tier-list-guide",
  "extraction-guide","upior-tips-guide","weapons-guide","weapon-tier-list-guide","trampler-build-guide",
  "crew-strategy-guide","trampler-components-guide","upiors-guide","voyage-vs-storm-dive-guide",
  "loot-guide","system-requirements-guide","lore-guide","trampler-build-optimization-guide",
  "trampler-component-synergy-guide","best-storm-dive-extraction-trampler","best-tramplers-ranked-2026",
  "light-vs-heavy-chassis-compared","weapon-damage-types-explained","weapon-loadout-by-trampler-class",
  "best-budget-weapons-beginners","best-weapons-ranked-tier-list","player-vs-mounted-weapons-compared",
  "upior-behavior-in-storm-dive-mode","all-upior-types-defeat-strategies","sandwraith-boss-strategy-guide",
  "upior-combat-tips-for-solo-players","upior-weakness-exploit-guide","underrated-b-c-tier-items-guide",
  "tier-list-solo-vs-crew-play-guide","complete-tier-list-june-2026","s-tier-tramplers-weapons-meta",
  "how-the-tier-list-is-determined","storm-dive-survival-strategies","voyage-vs-storm-dive-compared",
  "best-voyage-mode-farming-guide","game-mode-rewards-full-comparison","voyage-to-storm-dive-transition",
  "how-to-redeem-codes-on-steam","where-to-find-new-promo-codes","free-rewards-bonus-items-guide",
  "expired-codes-and-past-rewards","all-active-promo-codes-june-2026"
]);

for (const loc of ["en","de","uk","ja"]) {
  for (const cat of ["guides","tramplers","weapons","upiors","tier-list","game-modes","codes"]) {
    const d = path.join(__dirname, '..', 'content', loc, cat);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.mdx')) continue;
      const c = fs.readFileSync(path.join(d, f), 'utf-8');
      const m = c.match(/slug:\s*["']([^"']+)["']/);
      if (!m) console.log('NO SLUG:', loc, cat, f);
      else if (!knownSlugs.has(m[1])) console.log('UNKNOWN:', loc, cat, m[1]);
    }
  }
}
