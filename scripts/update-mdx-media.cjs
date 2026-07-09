const fs = require('fs');
const path = require('path');

const ARTICLE_VIDEOS = {
  'guides/beginners-guide': 'jDiPS-ZzJ6o',
  'guides/storm-dive-advanced-guide': 'SmfQQXwQH2k',
  'guides/solo-play-guide': 'G_WMmRw-3Pc',
  'guides/pvp-guide': 'Tnv6tw31cnU',
  'guides/trampler-tier-list-guide': '9yQbA0CSy9I',
  'guides/extraction-guide': 'hPmYi8fwnUk',
  'guides/upior-tips-guide': 'NmXiwIyXJLg',
  'guides/weapons-guide': 'alq42OkzdzM',
  'guides/weapon-tier-list-guide': 'JRTIzM6RZBw',
  'guides/trampler-build-guide': '62a_Sr1gHNA',
  'guides/crew-strategy-guide': 'QBxOhPulpak',
  'guides/trampler-components-guide': 'Dd4KWeK8Y4I',
  'guides/upiors-guide': '9fbgXXia4i8',
  'guides/voyage-vs-storm-dive-guide': 'f0C6kSGcUa8',
  'guides/loot-guide': 'nVQNpp02820',
  'guides/system-requirements-guide': 'AOQo4oWkrXk',
  'guides/lore-guide': 'LPEMtTe8t8Y',
  'tramplers/trampler-build-optimization-guide': 'frlEgl4UCkU',
  'tramplers/trampler-component-synergy-guide': 'voIHUnPUN60',
  'tramplers/best-storm-dive-extraction-trampler': 'I0IGG0ev0X0',
  'tramplers/best-tramplers-ranked-2026': 'zBDjpX_sx9Q',
  'tramplers/light-vs-heavy-chassis-compared': 'juTXYA9cVic',
  'weapons/weapon-damage-types-explained': '0vVNBlZ_Q-Y',
  'weapons/weapon-loadout-by-trampler-class': 'R5g4L15OTBQ',
  'weapons/best-budget-weapons-beginners': 'yCqRT0p7sWk',
  'weapons/best-weapons-ranked-tier-list': 'k9gMYqSPwOM',
  'weapons/player-vs-mounted-weapons-compared': '8YZcibSaHkc',
  'upiors/upior-behavior-in-storm-dive-mode': 'nSeM1stPu3Q',
  'upiors/all-upior-types-defeat-strategies': '_VvlhRY0J0c',
  'upiors/sandwraith-boss-strategy-guide': 'p0OC7q5hFeE',
  'upiors/upior-combat-tips-for-solo-players': 'EitxRK2mziQ',
  'upiors/upior-weakness-exploit-guide': 'tp4GAM2Ttrw',
  'tier-list/underrated-b-c-tier-items-guide': '9mjNPkIbSTM',
  'tier-list/tier-list-solo-vs-crew-play-guide': 'NIoL2o6F51U',
  'tier-list/complete-tier-list-june-2026': 'p0AuYSbCA_s',
  'tier-list/s-tier-tramplers-weapons-meta': 'W0bcDA5y3yQ',
  'tier-list/how-the-tier-list-is-determined': 'Fgvfs-SDqnM',
  'game-modes/storm-dive-survival-strategies': '_uENIPtZIec',
  'game-modes/voyage-vs-storm-dive-compared': '4pxK8dlUdwY',
  'game-modes/best-voyage-mode-farming-guide': '6tEyNq2mtd8',
  'game-modes/game-mode-rewards-full-comparison': 'Ut0DOU-O64c',
  'game-modes/voyage-to-storm-dive-transition': '2dcKYDvxqRI',
  'codes/how-to-redeem-codes-on-steam': 'koKFVJixpqc',
  'codes/where-to-find-new-promo-codes': 'dysokDJmjGY',
  'codes/free-rewards-bonus-items-guide': 'FssxIct4lkg',
  'codes/expired-codes-and-past-rewards': 'DX6_ts11NOY',
  'codes/all-active-promo-codes-june-2026': 'v4EwkBAbAzU',
};

const SLUG_VIDEO_MAP = {};
for (const [articlePath, videoId] of Object.entries(ARTICLE_VIDEOS)) {
  const slug = articlePath.split('/').pop();
  const category = articlePath.split('/').slice(0, -1).join('/');
  const shortSlug = slug;
  const longSlug = 'sand-raiders-of-sophie-' + slug;
  const imagePath = `/images/${category}/${slug}.jpg`;
  SLUG_VIDEO_MAP[shortSlug] = { videoId, imagePath, category };
  SLUG_VIDEO_MAP[longSlug] = { videoId, imagePath, category };
}

const contentDir = path.join(__dirname, '..', 'content');
const locales = ['en', 'de', 'uk', 'ja'];
const categories = ['guides', 'tramplers', 'weapons', 'upiors', 'tier-list', 'game-modes', 'codes'];
let updated = 0;
let skipped = 0;

for (const locale of locales) {
  for (const category of categories) {
    const dir = path.join(contentDir, locale, category);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.mdx')) continue;
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf-8');

      const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
      if (!slugMatch) { skipped++; continue; }
      const slug = slugMatch[1];
      const mapping = SLUG_VIDEO_MAP[slug];
      if (!mapping) { skipped++; continue; }

      const { videoId, imagePath } = mapping;

      content = content.replace(
        /image:\s*["'][^"']+["']/,
        `image: "${imagePath}"`
      );
      content = content.replace(
        /video:\s*["'][^"']*["']/,
        `video: "${videoId}"`
      );

      fs.writeFileSync(filePath, content, 'utf-8');
      updated++;
    }
  }
}

console.log(`Updated: ${updated}, Skipped: ${skipped}`);
