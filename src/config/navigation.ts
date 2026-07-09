import { BookOpen, Crown, Compass, Cog, Flame, Gamepad2, Home, Info, Map, ScrollText, Shield, Skull, Sparkles, Star, Swords, Trophy, Users, Wand2, type LucideIcon } from 'lucide-react';

export const NAVIGATION_CONFIG = [
  { key: 'home', labelKey: 'nav_home', path: '/', icon: Home, showInHeader: false, showInSidebar: true, showInFooter: false, sitemap: true, priority: 1, changeFrequency: 'daily' },
  { key: 'guides', labelKey: 'nav_guides', path: '/guides', icon: BookOpen, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'tier-list', labelKey: 'nav_tierList', path: '/tier-list', icon: Trophy, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'conflux', labelKey: 'nav_conflux', path: '/conflux', icon: Compass, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.9, changeFrequency: 'weekly' },
  { key: 'master-traits', labelKey: 'nav_masterTraits', path: '/master-traits', icon: Star, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'characters', labelKey: 'nav_characters', path: '/characters', icon: Users, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'weapon-transcendence', labelKey: 'nav_weaponTranscendence', path: '/weapon-transcendence', icon: Swords, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'summons', labelKey: 'nav_summons', path: '/summons', icon: Flame, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'sigils', labelKey: 'nav_sigils', path: '/sigils', icon: Sparkles, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'bosses', labelKey: 'nav_bosses', path: '/bosses', icon: Skull, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'co-op', labelKey: 'nav_coop', path: '/co-op', icon: Gamepad2, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'story-walkthrough', labelKey: 'nav_story', path: '/story-walkthrough', icon: ScrollText, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.7, changeFrequency: 'weekly' },
  { key: 'endgame', labelKey: 'nav_endgame', path: '/endgame', icon: Crown, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'builds', labelKey: 'nav_builds', path: '/builds', icon: Cog, isContentType: true, showInHeader: true, showInSidebar: true, showInFooter: true, sitemap: true, priority: 0.8, changeFrequency: 'weekly' },
  { key: 'about', labelKey: 'nav_about', path: '/about', icon: Info, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: true, priority: 0.7, changeFrequency: 'monthly' },
  { key: 'sitemap', labelKey: 'nav_sitemap', path: '/sitemap', icon: Map, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: false, priority: 0.5, changeFrequency: 'monthly' },
  { key: 'privacy-policy', labelKey: 'nav_privacyPolicy', path: '/privacy-policy', icon: Shield, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: true, priority: 0.4, changeFrequency: 'yearly' },
  { key: 'terms-of-service', labelKey: 'nav_termsOfService', path: '/terms-of-service', icon: ScrollText, showInHeader: false, showInSidebar: false, showInFooter: true, sitemap: true, priority: 0.4, changeFrequency: 'yearly' },
] as const;

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => 'isContentType' in item && item.isContentType).map((item) => item.key);

export type NavigationItem = (typeof NAVIGATION_CONFIG)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];

export function isContentType(value: string): value is ContentType {
  return CONTENT_TYPES.includes(value as ContentType);
}

export function getNavigationItem(path: string) {
  const normalized = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  return NAVIGATION_CONFIG.find((item) => item.path === normalized || item.key === path);
}

export const CONTENT_DIR_NAMES: Record<ContentType | string, string> = {
  guides: 'guides',
  'tier-list': 'tier-list',
  conflux: 'conflux',
  'master-traits': 'master-traits',
  characters: 'characters',
  'weapon-transcendence': 'weapon-transcendence',
  summons: 'summons',
  sigils: 'sigils',
  bosses: 'bosses',
  'co-op': 'co-op',
  'story-walkthrough': 'story-walkthrough',
  endgame: 'endgame',
  builds: 'builds',
} as Record<ContentType, string>;

export function getContentDir(contentType: ContentType): string {
  return CONTENT_DIR_NAMES[contentType] || contentType;
}

export const GUIDE_CATEGORIES: Record<string, { emoji: string; order: number }> = {
  general:             { emoji: '🚀', order: 1 },
  guides:              { emoji: '📖', order: 2 },
  progression:        { emoji: '⏳', order: 3 },
  combat:             { emoji: '⚡', order: 4 },
  strategy:           { emoji: '🎯', order: 5 },
  'tier-list':        { emoji: '🏆', order: 6 },
  conflux:            { emoji: '🌀', order: 7 },
  'master-traits':    { emoji: '✨', order: 8 },
  characters:         { emoji: '👥', order: 9 },
  'weapon-transcendence': { emoji: '⚔️', order: 10 },
  summons:            { emoji: '🔥', order: 11 },
  sigils:             { emoji: '💎', order: 12 },
  bosses:             { emoji: '💀', order: 13 },
  'co-op':            { emoji: '🤝', order: 14 },
  'story-walkthrough': { emoji: '📜', order: 15 },
  endgame:            { emoji: '👑', order: 16 },
  builds:             { emoji: '🔧', order: 17 },
};

export const CATEGORY_ORDER = Object.entries(GUIDE_CATEGORIES)
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([key]) => key);

export const CATEGORY_AFFINITY: Record<string, string[]> = {
  combat: ['strategy', 'builds'],
  strategy: ['combat', 'tier-list'],
  progression: ['general', 'endgame'],
  general: ['progression', 'guides'],
  'tier-list': ['builds', 'characters'],
  conflux: ['endgame', 'strategy'],
  'master-traits': ['builds', 'characters'],
  characters: ['tier-list', 'builds'],
  'weapon-transcendence': ['builds', 'sigils'],
  summons: ['bosses', 'combat'],
  sigils: ['builds', 'weapon-transcendence'],
  bosses: ['combat', 'summons'],
  'co-op': ['strategy', 'builds'],
  'story-walkthrough': ['general'],
  endgame: ['conflux', 'builds'],
  builds: ['characters', 'sigils'],
};
