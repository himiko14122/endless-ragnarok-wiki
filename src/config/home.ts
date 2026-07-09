import {
  BookOpen, Compass, Cog, Crown, Flame, Gamepad2, Map, Shield,
  Skull, Sparkles, Star, Swords, Trophy, Users, ScrollText, Wand2,
  type LucideIcon,
} from 'lucide-react';

export interface StatConfig {
  val: string;
  labelKey: string;
}

export interface ModuleCardConfig {
  key: string;
  labelKey: string;
  titleKey: string;
  descKey: string;
  href: string;
  stats: StatConfig[];
  icon: LucideIcon;
  ctaKey?: string;
}

export interface GameFeatureConfig {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
}

export interface StartHereStepConfig {
  titleKey: string;
  descKey: string;
  href: string;
}

export interface HeroCtaConfig {
  labelKey: string;
  href: string;
  style: 'primary' | 'secondary';
}

export const HOME_CONFIG = {
  hero: {
    videoId: 'bEFYnDCYmvM',
    badgeKeys: [
      'home_hero_badge_released',
      'home_hero_badge_characters',
      'home_hero_badge_newCharacters',
      'home_hero_badge_crossplay',
      'home_hero_badge_platforms',
      'home_hero_badge_genre',
      'home_hero_badge_steamRating',
      'home_hero_badge_conflux',
    ],
    ctas: [
      { labelKey: 'home_hero_cta_guides', href: '/guides/beginner-guide', style: 'primary' as const },
      { labelKey: 'home_hero_cta_tierList', href: '/tier-list', style: 'secondary' as const },
      { labelKey: 'home_hero_cta_conflux', href: '/conflux', style: 'secondary' as const },
    ],
  },

  moduleCards: [
    { key: 'beginner', labelKey: 'home_module_beginner', titleKey: 'home_module_beginner_title', descKey: 'home_module_beginner_desc', href: '/guides/beginner-guide', stats: [{ val: '__guideCount', labelKey: 'home_module_starter_pages' }, { val: '4', labelKey: 'home_module_core_systems' }], icon: BookOpen, ctaKey: 'home_module_beginner_cta' },
    { key: 'conflux', labelKey: 'home_module_conflux', titleKey: 'home_module_conflux_title', descKey: 'home_module_conflux_desc', href: '/conflux', stats: [{ val: '4', labelKey: 'home_module_room_types' }, { val: 'Solo', labelKey: 'home_module_mode_type' }], icon: Compass },
    { key: 'tierlist', labelKey: 'home_module_tierlist', titleKey: 'home_module_tierlist_title', descKey: 'home_module_tierlist_desc', href: '/tier-list', stats: [{ val: 'SS-A', labelKey: 'home_module_top_tiers' }, { val: '28', labelKey: 'home_module_character_count' }], icon: Trophy },
    { key: 'mastertraits', labelKey: 'home_module_masterTraits', titleKey: 'home_module_masterTraits_title', descKey: 'home_module_masterTraits_desc', href: '/master-traits', stats: [{ val: '3', labelKey: 'home_module_trait_paths' }, { val: '100', labelKey: 'home_module_unlock_level' }], icon: Star },
    { key: 'characters', labelKey: 'home_module_characters', titleKey: 'home_module_characters_title', descKey: 'home_module_characters_desc', href: '/characters', stats: [{ val: '6', labelKey: 'home_module_new_chars' }, { val: '28', labelKey: 'home_module_total_chars' }], icon: Users },
    { key: 'weapons', labelKey: 'home_module_weapons', titleKey: 'home_module_weapons_title', descKey: 'home_module_weapons_desc', href: '/weapon-transcendence', stats: [{ val: '6', labelKey: 'home_module_weapon_types' }, { val: 'EX', labelKey: 'home_module_slot_type' }], icon: Swords },
    { key: 'summons', labelKey: 'home_module_summons', titleKey: 'home_module_summons_title', descKey: 'home_module_summons_desc', href: '/summons', stats: [{ val: '2', labelKey: 'home_module_controllable' }, { val: '4', labelKey: 'home_module_party_summons' }], icon: Flame },
    { key: 'sigils', labelKey: 'home_module_sigils', titleKey: 'home_module_sigils_title', descKey: 'home_module_sigils_desc', href: '/sigils', stats: [{ val: 'S', labelKey: 'home_module_top_tier' }, { val: 'New', labelKey: 'home_module_new_expansion' }], icon: Sparkles },
    { key: 'bosses', labelKey: 'home_module_bosses', titleKey: 'home_module_bosses_title', descKey: 'home_module_bosses_desc', href: '/bosses', stats: [{ val: '4+', labelKey: 'home_module_major_bosses' }, { val: 'Chaos', labelKey: 'home_module_hardest_tier' }], icon: Skull },
    { key: 'coop', labelKey: 'home_module_coop', titleKey: 'home_module_coop_title', descKey: 'home_module_coop_desc', href: '/co-op', stats: [{ val: '4', labelKey: 'home_module_max_players' }, { val: 'Full', labelKey: 'home_module_crossplay' }], icon: Gamepad2 },
    { key: 'story', labelKey: 'home_module_story', titleKey: 'home_module_story_title', descKey: 'home_module_story_desc', href: '/story-walkthrough', stats: [{ val: 'New', labelKey: 'home_module_story_arc' }, { val: 'Ragnalia', labelKey: 'home_module_main_villain' }], icon: ScrollText },
    { key: 'endgame', labelKey: 'home_module_endgame', titleKey: 'home_module_endgame_title', descKey: 'home_module_endgame_desc', href: '/endgame', stats: [{ val: '3', labelKey: 'home_module_endgame_tiers' }, { val: 'Conflux', labelKey: 'home_module_fast_farm' }], icon: Crown },
    { key: 'builds', labelKey: 'home_module_builds', titleKey: 'home_module_builds_title', descKey: 'home_module_builds_desc', href: '/builds', stats: [{ val: '28', labelKey: 'home_module_all_chars' }, { val: '3', labelKey: 'home_module_trait_paths' }], icon: Cog },
  ] as ModuleCardConfig[],

  gameFeatures: [
    { titleKey: 'home_feature_conflux', descKey: 'home_feature_conflux_desc', icon: Compass },
    { titleKey: 'home_feature_summon', descKey: 'home_feature_summon_desc', icon: Flame },
    { titleKey: 'home_feature_masterTraits', descKey: 'home_feature_masterTraits_desc', icon: Star },
    { titleKey: 'home_feature_crossplay', descKey: 'home_feature_crossplay_desc', icon: Gamepad2 },
  ] as GameFeatureConfig[],

  startHereSteps: [
    { titleKey: 'home_start_1_title', descKey: 'home_start_1_desc', href: '/guides/beginner-guide' },
    { titleKey: 'home_start_2_title', descKey: 'home_start_2_desc', href: '/conflux' },
    { titleKey: 'home_start_3_title', descKey: 'home_start_3_desc', href: '/tier-list' },
    { titleKey: 'home_start_4_title', descKey: 'home_start_4_desc', href: '/master-traits' },
    { titleKey: 'home_start_5_title', descKey: 'home_start_5_desc', href: '/weapon-transcendence' },
  ] as StartHereStepConfig[],

  gameOverview: {
    infoItems: ['developer', 'platform', 'genre', 'releaseDate', 'steamRating', 'playableChars', 'newChars', 'crossplay'],
    cta: {
      guideLabelKey: 'home_about_cta',
      guideHref: '/guides',
      externalLabelKey: 'home_cta_steam',
      externalLinkKey: 'steam',
    },
  },

  faq: {
    keys: ['howToStart', 'bestCharacter', 'whatIsConflux', 'howToUnlockMasterTraits', 'whatIsWeaponTranscendence', 'bestSummons', 'crossplay', 'chaosDifficulty', 'bestBuilds', 'howToGetStrong'],
  },

  bottomCta: {
    guideHref: '/guides/beginner-guide',
    guideLabelKey: 'home_cta_guide',
    externalLinkKey: 'steam',
    externalLabelKey: 'home_cta_steam',
  },
};
