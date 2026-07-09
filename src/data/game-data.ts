import { Compass, Cog, Shield, Swords, Zap, type LucideIcon } from 'lucide-react';

// Endless Ragnarok has no tramplers/weapons/upiors/game modes like the template
// These are empty to avoid breaking imports in page.tsx
export interface Trampler { id: string; nameKey: string; descKey: string; type: string; typeKey: string; tier: string; specialty: string; specialtyKey: string; image: string; strengthsKey: string; teamCompKey: string; recommendedWeapons: string[]; tipsKeys: string[]; }
export const tramplers: Trampler[] = [];

export interface Weapon { id: string; nameKey: string; descKey: string; type: string; typeKey: string; tier: string; damageType: string; damageTypeKey: string; image: string; strengthsKey: string; bestForKey: string; recommendedTramplers: string[]; tipsKeys: string[]; }
export const weapons: Weapon[] = [];

export interface Upior { id: string; nameKey: string; descKey: string; tipKey?: string; tier: string; threat: string; threatKey: string; weakness: string; weaknessKey: string; image: string; weaknessDetailKey: string; strategyKey: string; recommendedWeapons: string[]; }
export const upiors: Upior[] = [];

export interface GameMode { id: string; nameKey: string; descKey: string; type: string; typeKey: string; rewards: string[]; }
export const gameModes: GameMode[] = [];

export interface PromoCodeReward { item: string; itemKey: string; amount: number; }
export interface PromoCode { id: string; code: string; rewards: PromoCodeReward[]; status: "active" | "expired"; levelReq: number; }
export const promoCodes: PromoCode[] = [];

export interface LootCategory { id: string; nameKey: string; descKey: string; tier: string; value: string; valueKey: string; weight: string; weightKey: string; }
export const lootCategories: LootCategory[] = [];

export interface ChassisType { id: string; nameKey: string; descKey: string; size: string; sizeKey: string; crewCapacity: number; moduleSlots: number; speed: string; speedKey: string; }
export const chassisTypes: ChassisType[] = [];

export interface TramplerComponent { id: string; nameKey: string; descKey: string; category: string; categoryKey: string; image: string; }
export const tramplerComponents: TramplerComponent[] = [];

export const TIER_COLOR_MAP: Record<string, string> = {
  SS: 'var(--color-tier-s)',
  S: 'var(--color-tier-s)',
  A: 'var(--color-tier-a)',
  B: 'var(--color-tier-b)',
  C: 'var(--color-tier-c)',
};
export const TIER_COLOR_DEFAULT = 'var(--color-tier-c)';

export const THREAT_COLOR_MAP: Record<string, string> = {
  extreme: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a',
};
export const THREAT_COLOR_DEFAULT = '#16a34a';

export const TRAMPLER_TYPE_COLOR_MAP: Record<string, string> = {
  Heavy: 'var(--color-tier-s)',
  Medium: 'var(--color-tier-a)',
  Light: 'var(--color-tier-b)',
};
export const TRAMPLER_TYPE_COLOR_DEFAULT = 'var(--color-tier-b)';

export const COMPONENT_CATEGORY_ICONS: Record<string, LucideIcon> = {
  Mobility: Compass,
  Power: Zap,
  Defense: Shield,
  Offense: Swords,
  Utility: Cog,
};

export function tierColor(tier: string): string {
  return TIER_COLOR_MAP[tier] ?? TIER_COLOR_DEFAULT;
}

export function threatColor(threat: string): string {
  return THREAT_COLOR_MAP[threat.toLowerCase()] ?? THREAT_COLOR_DEFAULT;
}

export function tramplerTypeColor(type: string): string {
  return TRAMPLER_TYPE_COLOR_MAP[type] ?? TRAMPLER_TYPE_COLOR_DEFAULT;
}
