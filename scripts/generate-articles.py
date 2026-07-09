#!/usr/bin/env python3
"""Generate high-quality MDX articles for Endless Ragnarok wiki using LLM API."""

import json
import os
import sys
import time
import re
import requests

API_BASE_URL = "https://api.apifast.tech/v1"
API_KEY = "sk-fCleDfgCT1IVyf9Qn4nUm9o32AEo6yZ8cGhK1wh8Gq0GU1JK"
MODEL = "gemini-2.5-flash"
PROJECT_ROOT = "/Users/jinwei/Desktop/code/endless-ragnarok"
CONTENT_DIR = f"{PROJECT_ROOT}/content/en"

# Research context for the LLM
RESEARCH_CONTEXT = """
GAME: Endless Ragnarok — the major expansion DLC for Granblue Fantasy: Relink
PLATFORMS: PS5, PS4, Switch 2, PC (Steam)
DEVELOPER: Cygames
RELEASE: July 9, 2026
STEAM RATING: Very Positive (94%)
TOTAL CHARACTERS: 28 (6 new DLC)
CROSSPLAY: Full cross-platform (PS5/PS4/Switch 2/PC)

KEY SYSTEMS:
- The Conflux: Roguelite solo mode via gateways in Seedhollow or Tredame Sanctum. Randomly generated rooms (combat, treasure, rare monster). Power-ups chosen before each area, stay active until exit. Deeper depths = harder but better rewards. ~20 min runs. Fastest source of enhancement materials.
- Master Traits: 3 paths per character (Insight, Essence, Crux) unlocked at Level 100. Each has 3 unique Rank Perks and 4 Rank Style upgrades. Available for all 28 characters.
- Weapon Transcendence: Upgrade fully enhanced weapons beyond limits. 6 weapon types: Defender, Ascension, Executioner, Stinger, Stunner, Terminus. Unlock swappable traits (Slot II max 25, Slot IV max 10), Slot EX rewards, aesthetic effects. Materials from Fatebeaker quests and Conflux.
- Summon System: Lyria can summon primal beasts in combat. Each player brings 4 summons, only 1 fielded at a time. Controllable summons: Lucilius and Rolan. Primal Burst triggered when all 4 party members use Skybound Arts during link time. Passive bonuses from equipped summons. Summons only in Chaos-difficulty quests and higher.
- Sigils: Equipment system with trait effects. S-tier: Warpath+, War Elemental+, Character Specific. A-tier: Critical Hit Rate V+, Alpha/Beta/Gamma. New expansion Sigils with expanded traits.
- 6 New DLC Characters: Beatrix (DPS, Delta Clock mechanic), Eustace (Ranged), Fraux (Melee, Pactbearer to The Devil), Fediel (Dark, Six Dragons), Gallanza (Melee, Strength), Maglielle (Support, healing/shields/flying weapons)
- Prerequisite: Complete Proud Quest "The Tale of Bahamut's Rage" to unlock Epilogue
- Bosses: Beelzebub (major antagonist), The World (Arcarum creation), Ragnalia (Heralds of Doom), Seofon & Tweyen boss fights
- Chaos difficulty: Hardest tier, enemies can one-hit weaker characters
- Fatebeaker quests: High-difficulty providing Weapon Transcendence materials

TIER LIST (approximate):
- SS: Sandalphon (Supreme Primarch Mode, lightstep sword wave spam)
- S: Cagliostro, Charlotta, Lancelot, Narmaya, Vaseraga, Zeta
- A: Captain, Eugen, Io, Percival, Seofon, Siegfried, Tweyen, Vane
- B: Id, Katalina, Rackam, Yodarha
- New DLC characters still being evaluated
"""

def call_llm(system_prompt: str, user_prompt: str, max_retries=3) -> str:
    """Call LLM API to generate content."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 8000
    }
    
    for attempt in range(max_retries):
        try:
            resp = requests.post(f"{API_BASE_URL}/chat/completions", headers=headers, json=payload, timeout=120)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            elif resp.status_code == 429:
                print(f"  Rate limited, waiting 60s... (attempt {attempt+1})")
                time.sleep(60)
            else:
                print(f"  API error {resp.status_code}: {resp.text[:200]}")
                time.sleep(10)
        except Exception as e:
            print(f"  Request error: {e}")
            time.sleep(10)
    
    return ""

def extract_mdx_content(llm_output: str) -> str:
    """Extract MDX content from LLM output, removing markdown code fences if present."""
    # Remove ```mdx or ``` fences
    output = llm_output.strip()
    if output.startswith("```mdx"):
        output = output[len("```mdx"):].strip()
    if output.startswith("```"):
        output = output[3:].strip()
    if output.endswith("```"):
        output = output[:-3].strip()
    return output

def get_existing_metadata(filepath: str) -> dict:
    """Read existing metadata from an MDX file."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        match = re.search(r'export const metadata = \{([^}]+)\}', content, re.DOTALL)
        if match:
            # Simple parse - just extract the metadata block
            metadata_block = match.group(0)
            return metadata_block
    except:
        pass
    return ""

def generate_article(article_config: dict) -> str:
    """Generate a single article using LLM."""
    category = article_config["category"]
    title = article_config["title"]
    slug = article_config["slug"]
    keywords = article_config["keywords"]
    description = article_config["description"]
    difficulty = article_config.get("difficulty", "beginner")
    order = article_config.get("order", 1)
    
    system_prompt = f"""You are an expert SEO content writer for a gaming wiki. You write comprehensive, game-specific, original articles about Endless Ragnarok (the expansion DLC for Granblue Fantasy: Relink).

CRITICAL RULES:
1. Write ONLY game-specific, factual content about Endless Ragnarok — NEVER use generic filler, template text, or repetitive boilerplate
2. NEVER repeat the same paragraph or section structure across H2 sections — each section must have unique, topic-specific content
3. Each article must be at least 1600 words (excluding metadata)
4. Include 4-6 H2 sections with optional H3 subsections
5. Include 3-5 Markdown tables with relevant game data
6. End with an FAQ section (3-4 Q&A pairs)
7. Include internal links to related articles using format: [link text](/en/{{category}}/{{slug}}/)
8. Include at least 1 authoritative external link
9. The title H1 is rendered by the page template — do NOT include an H1 in your content
10. Target keywords naturally: main keyword in title (1x), first 200 words (2x), body (4x+), long-tail keywords (3-5x)
11. DO NOT use phrases like "When approaching understanding..." or "Each character has unique strengths and weaknesses within..." — these are banned boilerplate
12. Write in a direct, informative, wiki-style tone — be specific, use numbers, names, and concrete details

RESEARCH CONTEXT:
{RESEARCH_CONTEXT}
"""

    user_prompt = f"""Write a comprehensive MDX article for the Endless Ragnarok wiki.

CATEGORY: {category}
TITLE: {title}
SLUG: {slug}
KEYWORDS: {', '.join(keywords)}
DESCRIPTION: {description}
DIFFICULTY: {difficulty}

The article must start with this exact metadata export (do NOT modify it):

export const metadata = {{
  id: "{slug}",
  slug: "{slug}",
  order: {order},
  title: "{title}",
  description: "{description}",
  keywords: {json.dumps(keywords)},
  category: "{category}",
  difficulty: "{difficulty}",
  date: "2026-07-09",
  lastModified: "2026-07-09",
  image: "/images/{category}/{slug}.webp",
}};

After the metadata, write the article content (NO H1 — start with an intro paragraph then H2 sections).

Make the content SPECIFIC to this article's topic. Include:
- Concrete game mechanics, numbers, character names, boss names
- Specific strategies with step-by-step instructions where applicable
- Data tables with real game information
- Internal links to related articles on this wiki
- Practical tips that players can immediately apply

DO NOT write generic filler like "Understanding [topic] encompasses a wide range of mechanics" or repeat the same table in every section. Each section must advance the reader's knowledge with NEW information."""

    result = call_llm(system_prompt, user_prompt)
    return extract_mdx_content(result)

# Define all articles to generate
ARTICLES = [
    # === GUIDES (10 articles) ===
    {
        "category": "guides",
        "title": "Endless Ragnarok Beginner Guide — How to Start the Expansion",
        "slug": "beginner-guide",
        "keywords": ["Endless Ragnarok beginner guide", "Endless Ragnarok how to start", "Endless Ragnarok what to do first", "Endless Ragnarok how to unlock", "Endless Ragnarok prerequisite quest"],
        "description": "Everything you need to know before diving into Endless Ragnarok. Covers how to unlock the expansion, prerequisites, and key tips for new and returning players.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Combat Guide — Link Attacks, Skybound Arts, and Chain Bursts",
        "slug": "combat-guide",
        "keywords": ["Endless Ragnarok combat guide", "Endless Ragnarok link attack guide", "Endless Ragnarok chain burst guide", "Endless Ragnarok skybound arts guide", "Endless Ragnarok combat tips"],
        "description": "Master Endless Ragnarok's combat system with detailed breakdowns of Link Attacks, Skybound Arts, Chain Bursts, and how the new Summon system integrates into combat flow.",
        "difficulty": "beginner",
        "order": 2
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Progression Guide — Leveling, Upgrades, and Unlock Order",
        "slug": "progression-guide",
        "keywords": ["Endless Ragnarok progression guide", "Endless Ragnarok how to level up fast", "Endless Ragnarok upgrade kit guide", "Endless Ragnarok early game guide", "Endless Ragnarok what to do first"],
        "description": "Optimize your progression through Endless Ragnarok with this detailed guide covering leveling routes, upgrade priorities, and the most efficient unlock order for all expansion systems.",
        "difficulty": "beginner",
        "order": 3
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Tips and Tricks — 25 Essential Tips for New and Returning Players",
        "slug": "tips-and-tricks",
        "keywords": ["Endless Ragnarok tips and tricks", "Endless Ragnarok new player tips", "Endless Ragnarok things to know before playing", "Endless Ragnarok how to get strong fast", "Endless Ragnarok best starter character"],
        "description": "25 essential tips that every Endless Ragnarok player should know, from optimizing your first Conflux run to maximizing material farming efficiency.",
        "difficulty": "beginner",
        "order": 4
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Difficulty Settings Explained — From Full Assist to Chaos",
        "slug": "difficulty-settings-explained",
        "keywords": ["Endless Ragnarok difficulty settings explained", "Endless Ragnarok full assist mode", "Endless Ragnarok how to unlock proud difficulty", "Endless Ragnarok proud quest guide", "Endless Ragnarok chaos difficulty"],
        "description": "Complete breakdown of every difficulty tier in Endless Ragnarok, from Full Assist Mode for newcomers to Chaos tier for endgame veterans. Includes unlock requirements and rewards for each tier.",
        "difficulty": "beginner",
        "order": 5
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Returning Player Guide — What's New and What Changed",
        "slug": "returning-player-guide",
        "keywords": ["Endless Ragnarok returning player guide", "Endless Ragnarok what is included", "Endless Ragnarok DLC content list", "Endless Ragnarok patch notes guide", "Endless Ragnarok how to access expansion"],
        "description": "A focused guide for returning Granblue Fantasy: Relink players covering every new system, change, and addition in the Endless Ragnarok expansion.",
        "difficulty": "beginner",
        "order": 6
    },
    {
        "category": "guides",
        "title": "The Tale of Bahamut's Rage Guide — How to Complete the Endless Ragnarok Prerequisite",
        "slug": "tale-of-bahamuts-rage-guide",
        "keywords": ["Endless Ragnarok tale of bahamuts rage guide", "Endless Ragnarok proud quest guide", "Endless Ragnarok epilogue unlock", "Endless Ragnarok how to unlock", "Endless Ragnarok prerequisite quest"],
        "description": "Step-by-step walkthrough for completing The Tale of Bahamut's Rage on Proud difficulty, the required prerequisite quest to unlock Endless Ragnarok content.",
        "difficulty": "intermediate",
        "order": 7
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Complete Guide — All Systems, Characters, and Content",
        "slug": "complete-guide",
        "keywords": ["Endless Ragnarok complete guide", "Endless Ragnarok DLC content list", "Endless Ragnarok what is included", "Endless Ragnarok all features", "Endless Ragnarok everything you need to know"],
        "description": "The ultimate comprehensive guide covering every system, character, mode, and piece of content in the Endless Ragnarok expansion for Granblue Fantasy: Relink.",
        "difficulty": "beginner",
        "order": 8
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Platform and Performance Guide — PC, PS5, PS4, and Switch 2",
        "slug": "platform-and-performance-guide",
        "keywords": ["Endless Ragnarok best platform", "Endless Ragnarok PS5 performance guide", "Endless Ragnarok PC settings optimization", "Endless Ragnarok switch 2 guide", "Endless Ragnarok frame rate guide"],
        "description": "Performance comparison and optimization guide for Endless Ragnarok across all platforms including PC settings recommendations, PS5 performance modes, and Switch 2 details.",
        "difficulty": "beginner",
        "order": 9
    },
    {
        "category": "guides",
        "title": "Endless Ragnarok Review — Is the Expansion Worth Buying?",
        "slug": "review",
        "keywords": ["Endless Ragnarok review guide", "Endless Ragnarok should I buy", "Endless Ragnarok worth it reddit", "Endless Ragnarok standard vs special edition", "Endless Ragnarok how to install"],
        "description": "Honest review of Endless Ragnarok covering content value, new systems quality, performance, and whether the expansion is worth the price for different player types.",
        "difficulty": "beginner",
        "order": 10
    },
    
    # === TIER LIST (5 articles) ===
    {
        "category": "tier-list",
        "title": "Endless Ragnarok Character Tier List — All 28 Characters Ranked",
        "slug": "character-tier-list",
        "keywords": ["Endless Ragnarok tier list", "Endless Ragnarok best characters ranked", "Endless Ragnarok character tier list 2026", "Endless Ragnarok SS tier characters", "Endless Ragnarok character ranking"],
        "description": "Complete character tier list ranking all 28 playable characters from SS to B tier based on damage, utility, survivability, and Chaos-tier performance.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "tier-list",
        "title": "Endless Ragnarok Best DPS Characters — Top Damage Dealers Ranked",
        "slug": "best-dps-characters",
        "keywords": ["Endless Ragnarok best DPS character", "Endless Ragnarok best DPS ranking", "Endless Ragnarok strongest character", "Endless Ragnarok meta characters", "Endless Ragnarok highest damage"],
        "description": "Detailed ranking of the best DPS characters in Endless Ragnarok with damage breakdowns, optimal builds, and performance comparisons across Chaos and Conflux content.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "tier-list",
        "title": "Endless Ragnarok Best Support Characters — Healers and Buffers Ranked",
        "slug": "best-support-characters",
        "keywords": ["Endless Ragnarok best support character", "Endless Ragnarok support tier list", "Endless Ragnarok best healer", "Endless Ragnarok best buffer", "Endless Ragnarok co op best characters"],
        "description": "Ranking of the best support characters in Endless Ragnarok including healers, buffers, and utility picks for co-op and Chaos-tier content.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "tier-list",
        "title": "Endless Ragnarok Best Characters for Chaos Difficulty",
        "slug": "best-characters-for-chaos-difficulty",
        "keywords": ["Endless Ragnarok best for Chaos difficulty", "Endless Ragnarok best endgame character", "Endless Ragnarok chaos tier characters", "Endless Ragnarok hardest content characters", "Endless Ragnarok best solo character"],
        "description": "Which characters excel in Chaos difficulty content, with specific build recommendations, Sigil setups, and team compositions for surviving the hardest quests.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "tier-list",
        "title": "Endless Ragnarok New DLC Characters Ranked — Beatrix, Eustace, Fraux, Fediel, Gallanza, Maglielle",
        "slug": "new-dlc-characters-ranked",
        "keywords": ["Endless Ragnarok new characters tier list", "Endless Ragnarok DLC characters ranked", "Endless Ragnarok Beatrix tier", "Endless Ragnarok Maglielle tier", "Endless Ragnarok new character ranking"],
        "description": "Detailed ranking and analysis of all 6 new DLC characters in Endless Ragnarok, including their unique mechanics, tier placement, and best use cases.",
        "difficulty": "intermediate",
        "order": 5
    },

    # === CONFLUX (5 articles) ===
    {
        "category": "conflux",
        "title": "The Conflux Complete Guide — Endless Ragnarok's Roguelite Mode",
        "slug": "the-conflux-complete-guide",
        "keywords": ["Endless Ragnarok Conflux guide", "Endless Ragnarok Conflux explained", "Endless Ragnarok Conflux tips", "Endless Ragnarok how to unlock Conflux", "Endless Ragnarok Conflux roguelite explained"],
        "description": "Everything you need to know about The Conflux, Endless Ragnarok's roguelite solo mode — from entry requirements to advanced strategies for maximizing rewards.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "conflux",
        "title": "Conflux Best Power-Ups and Room Selection Strategy",
        "slug": "conflux-best-power-ups-and-room-selection-strategy",
        "keywords": ["Endless Ragnarok Conflux best power ups", "Endless Ragnarok Conflux resonance points", "Endless Ragnarok Conflux room types", "Endless Ragnarok Conflux area selection", "Endless Ragnarok Conflux strategy"],
        "description": "Optimal power-up choices and room selection strategies for every Conflux run, including which power-ups to prioritize and which rooms to avoid.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "conflux",
        "title": "Conflux Best Characters — Who Performs Best in the Roguelite Mode",
        "slug": "conflux-best-characters",
        "keywords": ["Endless Ragnarok Conflux best character", "Endless Ragnarok Conflux solo mode", "Endless Ragnarok Conflux build guide", "Endless Ragnarok best character for Conflux", "Endless Ragnarok Conflux character picks"],
        "description": "Which characters dominate in the Conflux mode and why, with specific build recommendations for each top pick and strategies for solo roguelite runs.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "conflux",
        "title": "Conflux Farming Guide — Fastest Routes for Materials and Sigils",
        "slug": "conflux-farming-guide",
        "keywords": ["Endless Ragnarok Conflux farming", "Endless Ragnarok Conflux fastest run", "Endless Ragnarok Conflux materials", "Endless Ragnarok Conflux sigil farming", "Endless Ragnarok Conflux endgame farming"],
        "description": "Optimized farming routes through the Conflux for Weapon Transcendence materials, Sigils, and enhancement items with timing benchmarks.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "conflux",
        "title": "Conflux Advanced Guide — Depth Scaling, Resonance, and Multiple Run Strategies",
        "slug": "conflux-advanced-guide",
        "keywords": ["Endless Ragnarok Conflux advanced guide", "Endless Ragnarok Conflux depth guide", "Endless Ragnarok Conflux deeper depths", "Endless Ragnarok Conflux multiple runs strategy", "Endless Ragnarok Conflux efficiency tips"],
        "description": "Advanced Conflux strategies covering depth scaling mechanics, Resonance point optimization, and how to chain multiple runs for maximum efficiency.",
        "difficulty": "advanced",
        "order": 5
    },

    # === MASTER TRAITS (5 articles) ===
    {
        "category": "master-traits",
        "title": "Endless Ragnarok Master Traits Explained — Insight, Essence, and Crux Paths",
        "slug": "master-traits-explained",
        "keywords": ["Endless Ragnarok Master Traits explained", "Endless Ragnarok Insight Essence Crux", "Endless Ragnarok how to unlock Master Traits", "Endless Ragnarok Master Traits Level 100", "Endless Ragnarok which Master Trait to choose"],
        "description": "Complete explanation of the Master Traits system in Endless Ragnarok, covering all three paths (Insight, Essence, Crux), how to unlock them, and which to choose for each character.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "master-traits",
        "title": "Best Master Trait Paths for Every Character in Endless Ragnarok",
        "slug": "best-master-trait-paths-for-every-character",
        "keywords": ["Endless Ragnarok best Master Traits for each character", "Endless Ragnarok Master Traits Sandalphon", "Endless Ragnarok Master Traits Cagliostro", "Endless Ragnarok Master Traits recommended", "Endless Ragnarok Master Traits best path"],
        "description": "Character-by-character Master Trait recommendations with detailed reasoning for each path choice, covering all 28 characters.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "master-traits",
        "title": "Master Traits DPS Optimization — Maximizing Damage with the Right Path",
        "slug": "master-traits-dps-optimization",
        "keywords": ["Endless Ragnarok Master Traits best DPS path", "Endless Ragnarok Master Traits DPS optimization", "Endless Ragnarok Master Traits combat performance", "Endless Ragnarok Master Traits skill rotation", "Endless Ragnarok Master Traits build combos"],
        "description": "How to maximize DPS output through Master Trait selection, covering the best paths for damage-focused builds and how Rank Perks affect skill rotations.",
        "difficulty": "advanced",
        "order": 3
    },
    {
        "category": "master-traits",
        "title": "Master Traits vs Base Skills — When the New Paths Outperform the Originals",
        "slug": "master-traits-vs-base-skills",
        "keywords": ["Endless Ragnarok Master Traits vs base skills", "Endless Ragnarok Master Traits customization", "Endless Ragnarok Master Traits which is better", "Endless Ragnarok Master Traits switch path", "Endless Ragnarok Master Traits passive effects"],
        "description": "Detailed comparison of Master Trait paths versus base character skills, analyzing when each path outperforms the others and how to decide which to use.",
        "difficulty": "intermediate",
        "order": 4
    },
    {
        "category": "master-traits",
        "title": "Master Traits for New DLC Characters — Beatrix, Eustace, Fraux, Fediel, Gallanza, Maglielle",
        "slug": "master-traits-for-new-dlc-characters",
        "keywords": ["Endless Ragnarok Master Traits new characters", "Endless Ragnarok Master Traits Beatrix", "Endless Ragnarok Master Traits Eustace", "Endless Ragnarok Master Traits Maglielle", "Endless Ragnarok Master Traits all characters list"],
        "description": "Specific Master Trait path recommendations for the 6 new DLC characters, with analysis of how each path changes their playstyle and effectiveness.",
        "difficulty": "intermediate",
        "order": 5
    },

    # === CHARACTERS (5 articles) ===
    {
        "category": "characters",
        "title": "Endless Ragnarok Beatrix Guide — Delta Clock Mechanic and Best Builds",
        "slug": "beatrix-guide",
        "keywords": ["Endless Ragnarok Beatrix", "Endless Ragnarok Beatrix Delta Clock", "Endless Ragnarok Beatrix build", "Endless Ragnarok Beatrix tier", "Endless Ragnarok Beatrix skills"],
        "description": "Complete guide to Beatrix in Endless Ragnarok, covering her unique Delta Clock mechanic for attack, defense, and healing buffs, plus optimal builds and Sigil setups.",
        "difficulty": "intermediate",
        "order": 1
    },
    {
        "category": "characters",
        "title": "Endless Ragnarok Cagliostro Guide — Party Buffs, Revives, and Top Support Build",
        "slug": "cagliostro-guide",
        "keywords": ["Endless Ragnarok Cagliostro", "Endless Ragnarok Cagliostro build", "Endless Ragnarok Cagliostro tier", "Endless Ragnarok Cagliostro support", "Endless Ragnarok best support character"],
        "description": "Complete guide to Cagliostro in Endless Ragnarok, covering her party-wide buff abilities, revive mechanic, and why she remains a top S-tier support character.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "characters",
        "title": "Endless Ragnarok Sandalphon Guide — Supreme Primarch Mode and SS Tier Build",
        "slug": "sandalphon-guide",
        "keywords": ["Endless Ragnarok Sandalphon", "Endless Ragnarok Sandalphon tier", "Endless Ragnarok Sandalphon build", "Endless Ragnarok Sandalphon Supreme Primarch Mode", "Endless Ragnarok SS tier characters"],
        "description": "Complete guide to Sandalphon in Endless Ragnarok, covering his Supreme Primarch Mode, lightstep sword wave spam build, and why he is the only SS-tier character.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "characters",
        "title": "Endless Ragnarok Maglielle Guide — Ranged Support with Healing and Shields",
        "slug": "maglielle-guide",
        "keywords": ["Endless Ragnarok Maglielle", "Endless Ragnarok Maglielle build", "Endless Ragnarok Maglielle healing", "Endless Ragnarok Maglielle support", "Endless Ragnarok Maglielle tier"],
        "description": "Complete guide to Maglielle in Endless Ragnarok, covering her ranged support playstyle with healing, invulnerability shields, flying weapons, and optimal builds.",
        "difficulty": "intermediate",
        "order": 4
    },
    {
        "category": "characters",
        "title": "Endless Ragnarok New Characters Overview — All 6 DLC Additions",
        "slug": "new-characters",
        "keywords": ["Endless Ragnarok new characters", "Endless Ragnarok Beatrix", "Endless Ragnarok Eustace", "Endless Ragnarok Fraux", "Endless Ragnarok Fediel", "Endless Ragnarok Gallanza"],
        "description": "Overview of all 6 new DLC characters in Endless Ragnarok with skill summaries, playstyle descriptions, tier placements, and recommendations for which to play first.",
        "difficulty": "beginner",
        "order": 5
    },

    # === WEAPON TRANSCENDENCE (5 articles) ===
    {
        "category": "weapon-transcendence",
        "title": "Endless Ragnarok Weapon Transcendence Guide — How the System Works",
        "slug": "weapon-transcendence-guide",
        "keywords": ["Endless Ragnarok Weapon Transcendence guide", "Endless Ragnarok Weapon Transcendence explained", "Endless Ragnarok how to transcend weapons", "Endless Ragnarok swappable traits", "Endless Ragnarok Weapon Transcendence requirements"],
        "description": "Complete guide to the Weapon Transcendence system in Endless Ragnarok, covering how to unlock it, swappable traits, Slot EX rewards, and material requirements.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "weapon-transcendence",
        "title": "Endless Ragnarok Weapon Types Explained — Defender, Executioner, Stinger, and More",
        "slug": "weapon-types-explained",
        "keywords": ["Endless Ragnarok weapon type explained", "Endless Ragnarok Defender weapon traits", "Endless Ragnarok Executioner weapon traits", "Endless Ragnarok Stinger weapon traits", "Endless Ragnarok Terminus weapon traits"],
        "description": "Detailed breakdown of all weapon types in Endless Ragnarok — Defender, Ascension, Executioner, Stinger, Stunner, and Terminus — with their trait pools and best use cases.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "weapon-transcendence",
        "title": "Best Weapon Traits for Every Build Type in Endless Ragnarok",
        "slug": "best-weapon-traits-for-every-build-type",
        "keywords": ["Endless Ragnarok best weapon traits", "Endless Ragnarok best traits for DPS", "Endless Ragnarok best traits for support", "Endless Ragnarok swappable trait pool", "Endless Ragnarok weapon build recommendations"],
        "description": "Which weapon traits to prioritize for DPS, support, and tank builds, with specific swappable trait recommendations for each build archetype.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "weapon-transcendence",
        "title": "Endless Ragnarok Slot EX Guide — Unlocking the Ultimate Weapon Upgrades",
        "slug": "slot-ex-guide",
        "keywords": ["Endless Ragnarok Slot EX guide", "Endless Ragnarok Slot II swappable", "Endless Ragnarok Slot IV swappable", "Endless Ragnarok max level 7 weapon", "Endless Ragnarok weapon aesthetic effects"],
        "description": "Everything about Slot EX rewards in Weapon Transcendence, including how to unlock them, what they provide, and which weapons are worth the investment.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "weapon-transcendence",
        "title": "Weapon Transcendence Farming — How to Get Materials Fast",
        "slug": "weapon-transcendence-farming",
        "keywords": ["Endless Ragnarok Weapon Transcendence materials", "Endless Ragnarok weapon farming", "Endless Ragnarok Fatebeaker quests materials", "Endless Ragnarok how to get materials fast", "Endless Ragnarok Conflux materials for weapons"],
        "description": "Optimal farming routes for Weapon Transcendence materials, comparing Conflux runs vs Fatebeaker quests with efficiency benchmarks and drop rate information.",
        "difficulty": "advanced",
        "order": 5
    },

    # === SUMMONS (5 articles) ===
    {
        "category": "summons",
        "title": "Endless Ragnarok Summon System Guide — How Primal Beast Summons Work",
        "slug": "summon-system-guide",
        "keywords": ["Endless Ragnarok Summon system guide", "Endless Ragnarok how to use summons", "Endless Ragnarok Lyria summon mechanic", "Endless Ragnarok summon unlock requirements", "Endless Ragnarok controllable summons"],
        "description": "Complete guide to the new Summon system in Endless Ragnarok, covering how Lyria calls primal beasts, controllable vs passive summons, and summon mechanics in combat.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "summons",
        "title": "Endless Ragnarok Best Summons to Equip — Primal Beast Rankings",
        "slug": "best-summons-to-equip",
        "keywords": ["Endless Ragnarok best summons to equip", "Endless Ragnarok summon setup guide", "Endless Ragnarok Lucilius summon", "Endless Ragnarok Rolan summon", "Endless Ragnarok summon list all"],
        "description": "Ranking of the best summons to equip in Endless Ragnarok, including Lucilius, Rolan, and other primal beasts with their passive bonuses and combat effectiveness.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "summons",
        "title": "Endless Ragnarok Primal Burst Guide — How to Trigger the Ultimate Combo",
        "slug": "primal-burst-guide",
        "keywords": ["Endless Ragnarok Primal Burst guide", "Endless Ragnarok how to trigger Primal Burst", "Endless Ragnarok Skybound Arts summon combo", "Endless Ragnarok link time summon guide", "Endless Ragnarok summon damage guide"],
        "description": "How to trigger Primal Bursts in Endless Ragnarok, the requirements, timing, and strategies for maximizing this devastating combo attack.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "summons",
        "title": "Endless Ragnarok Summon Strategy for Boss Fights and Chaos Difficulty",
        "slug": "summon-strategy-for-boss-fights-and-chaos-difficulty",
        "keywords": ["Endless Ragnarok summon Chaos difficulty", "Endless Ragnarok summon for boss fights", "Endless Ragnarok summon optimization", "Endless Ragnarok summon endgame setup", "Endless Ragnarok best summon combinations"],
        "description": "Summon strategies optimized for boss fights and Chaos difficulty content, including which summons to bring, when to deploy them, and how to coordinate in co-op.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "summons",
        "title": "Endless Ragnarok Summon Tips — Controlling Summons, Repositioning, and Cooldown Management",
        "slug": "summon-tips",
        "keywords": ["Endless Ragnarok summon tips and tricks", "Endless Ragnarok summon clunky control tips", "Endless Ragnarok summon repositioning tip", "Endless Ragnarok summon cooldown guide", "Endless Ragnarok summon wasting tips"],
        "description": "Practical tips for controlling summons effectively in Endless Ragnarok, including repositioning techniques, cooldown management, and how to avoid wasting summon windows.",
        "difficulty": "intermediate",
        "order": 5
    },

    # === SIGILS (5 articles) ===
    {
        "category": "sigils",
        "title": "Endless Ragnarok Best Sigils Guide — S-Tier Must-Haves and Farming Routes",
        "slug": "best-sigils-guide",
        "keywords": ["Endless Ragnarok best Sigils", "Endless Ragnarok Sigil guide", "Endless Ragnarok must have Sigils", "Endless Ragnarok Warpath plus Sigil", "Endless Ragnarok best Sigil traits"],
        "description": "Complete guide to the best Sigils in Endless Ragnarok, including S-tier must-haves, tier rankings, and farming routes for each category.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "sigils",
        "title": "Endless Ragnarok Sigil Tier List — All Sigils Ranked from S to C",
        "slug": "sigil-tier-list",
        "keywords": ["Endless Ragnarok Sigil tier list", "Endless Ragnarok Sigil priority list", "Endless Ragnarok best DPS Sigils", "Endless Ragnarok best support Sigils", "Endless Ragnarok Sigil rarity guide"],
        "description": "All Sigils in Endless Ragnarok ranked by tier, including new expansion additions, with detailed analysis of why each Sigil sits in its tier.",
        "difficulty": "intermediate",
        "order": 2
    },
    {
        "category": "sigils",
        "title": "Best Sigils for DPS Characters in Endless Ragnarok",
        "slug": "best-sigils-for-dps-characters",
        "keywords": ["Endless Ragnarok best Sigils for Sandalphon", "Endless Ragnarok best Sigils for Beatrix", "Endless Ragnarok best DPS Sigils", "Endless Ragnarok War Elemental plus Sigil", "Endless Ragnarok Critical Hit Rate V plus"],
        "description": "Specific Sigil recommendations for every DPS character in Endless Ragnarok, with loadout templates and priority order for each character's build.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "sigils",
        "title": "Endless Ragnarok Sigil Farming Guide — Where to Get Every Sigil",
        "slug": "sigil-farming-guide",
        "keywords": ["Endless Ragnarok Sigil farming guide", "Endless Ragnarok Sigil farming fastest", "Endless Ragnarok where to find Sigils", "Endless Ragnarok Sigil drop rate", "Endless Ragnarok how to get best Sigils"],
        "description": "Complete farming guide for every Sigil type in Endless Ragnarok, with optimal quest selections, Conflux strategies, and drop rate information.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "sigils",
        "title": "Endless Ragnarok New Expansion Sigils — All Added Sigils and Their Effects",
        "slug": "new-expansion-sigils",
        "keywords": ["Endless Ragnarok new expansion Sigils", "Endless Ragnarok new Sigils list", "Endless Ragnarok Sigil trait effects explained", "Endless Ragnarok Tier V Sigils", "Endless Ragnarok character specific Sigils"],
        "description": "All new Sigils added in the Endless Ragnarok expansion with their trait effects, rarity, how to obtain them, and which characters benefit most.",
        "difficulty": "intermediate",
        "order": 5
    },

    # === BOSSES (5 articles) ===
    {
        "category": "bosses",
        "title": "Endless Ragnarok Boss Guides — All Major Bosses and Strategies",
        "slug": "boss-guides",
        "keywords": ["Endless Ragnarok all new bosses", "Endless Ragnarok boss fight strategy", "Endless Ragnarok boss attack patterns", "Endless Ragnarok boss weaknesses", "Endless Ragnarok hardest boss"],
        "description": "Overview of every major boss in Endless Ragnarok including Beelzebub, The World, Ragnalia, and enhanced versions, with general strategy tips for each encounter.",
        "difficulty": "intermediate",
        "order": 1
    },
    {
        "category": "bosses",
        "title": "Endless Ragnarok Beelzebub Boss Guide — Attack Patterns and How to Beat Him",
        "slug": "beelzebub-boss-guide",
        "keywords": ["Endless Ragnarok Beelzebub boss guide", "Endless Ragnarok how to beat Beelzebub", "Endless Ragnarok Beelzebub attack patterns", "Endless Ragnarok Beelzebub weakness", "Endless Ragnarok best team for boss fights"],
        "description": "Complete strategy guide for the Beelzebub boss fight in Endless Ragnarok, covering attack patterns, dodge timings, recommended builds, and team compositions.",
        "difficulty": "advanced",
        "order": 2
    },
    {
        "category": "bosses",
        "title": "Endless Ragnarok The World Boss Guide — Arcarum Creation Mechanics",
        "slug": "the-world-boss-guide",
        "keywords": ["Endless Ragnarok The World boss guide", "Endless Ragnarok how to beat The World", "Endless Ragnarok The World mechanics", "Endless Ragnarok Arcarum explained", "Endless Ragnarok The World weakness"],
        "description": "Complete strategy guide for The World boss fight in Endless Ragnarok, covering the unique Arcarum creation mechanics, self-awareness phase, and optimal strategies.",
        "difficulty": "advanced",
        "order": 3
    },
    {
        "category": "bosses",
        "title": "Endless Ragnarok Ragnalia Boss Guide — Heralds of Doom Encounters",
        "slug": "ragnalia-boss-guide",
        "keywords": ["Endless Ragnarok Ragnalia boss guide", "Endless Ragnarok Herald of Doom boss", "Endless Ragnarok how to beat Ragnalia", "Endless Ragnarok enhanced bosses explained", "Endless Ragnarok Ragnalia mechanics"],
        "description": "Complete strategy guide for Ragnalia encounters in Endless Ragnarok, covering the Herald of Doom mechanics, enhanced boss versions, and escalation patterns.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "bosses",
        "title": "Endless Ragnarok Chaos Difficulty Boss Tips — Surviving the Hardest Fights",
        "slug": "chaos-difficulty-boss-tips",
        "keywords": ["Endless Ragnarok Chaos difficulty boss tips", "Endless Ragnarok boss one hit kill prevention", "Endless Ragnarok boss dodge guide", "Endless Ragnarok best setup for bosses", "Endless Ragnarok boss sigil recommendations"],
        "description": "Essential tips for surviving Chaos difficulty boss fights in Endless Ragnarok, including one-hit kill prevention, Sigil loadouts, and dodging strategies.",
        "difficulty": "advanced",
        "order": 5
    },

    # === CO-OP (5 articles) ===
    {
        "category": "co-op",
        "title": "Endless Ragnarok Co-op and Crossplay Guide — Full Platform Support",
        "slug": "co-op-and-crossplay-guide",
        "keywords": ["Endless Ragnarok crossplay guide", "Endless Ragnarok cross platform play", "Endless Ragnarok co op tips", "Endless Ragnarok PS5 PS4 crossplay", "Endless Ragnarok how to play with friends"],
        "description": "Complete guide to co-op and crossplay in Endless Ragnarok, covering how to set up cross-platform sessions, matchmaking, and tips for finding groups.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "co-op",
        "title": "Endless Ragnarok Crossplay — How to Play with Friends on Any Platform",
        "slug": "crossplay-how-to-play-with-friends-on-any-platform",
        "keywords": ["Endless Ragnarok crossplay how to invite", "Endless Ragnarok crossplay friend code", "Endless Ragnarok Switch 2 crossplay", "Endless Ragnarok PC crossplay", "Endless Ragnarok local wireless play Switch 2"],
        "description": "Step-by-step guide for setting up crossplay sessions across PS5, PS4, Switch 2, and PC, including invite methods, friend codes, and local wireless on Switch 2.",
        "difficulty": "beginner",
        "order": 2
    },
    {
        "category": "co-op",
        "title": "Best Team Compositions for Co-op Content in Endless Ragnarok",
        "slug": "best-team-compositions-for-co-op-content",
        "keywords": ["Endless Ragnarok best team composition", "Endless Ragnarok co op roles guide", "Endless Ragnarok best DPS character co op", "Endless Ragnarok best support character co op", "Endless Ragnarok co op boss strategy"],
        "description": "Optimal team compositions for every co-op scenario in Endless Ragnarok, from Chaos difficulty boss fights to Fatebeaker quest farming runs.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "co-op",
        "title": "Endless Ragnarok Co-op Summon Rules — How Summons Work in Multiplayer",
        "slug": "co-op-summon-rules",
        "keywords": ["Endless Ragnarok summon rules in co op", "Endless Ragnarok one summon at a time co op", "Endless Ragnarok subsequent summons cost less", "Endless Ragnarok summon per player co op", "Endless Ragnarok co op link attack timing"],
        "description": "Detailed explanation of how the Summon system works in co-op, including the one-summon-at-a-time rule, cost reduction for subsequent summons, and coordination tips.",
        "difficulty": "intermediate",
        "order": 4
    },
    {
        "category": "co-op",
        "title": "Endless Ragnarok Co-op Etiquette and Advanced Strategies",
        "slug": "co-op-etiquette-and-advanced-strategies",
        "keywords": ["Endless Ragnarok co op etiquette", "Endless Ragnarok co op advanced strategies", "Endless Ragnarok co op communication tips", "Endless Ragnarok co op carry build", "Endless Ragnarok co op developer tips"],
        "description": "Advanced co-op strategies and etiquette for Endless Ragnarok, including chain burst coordination, link attack timing, and tips from the developers.",
        "difficulty": "advanced",
        "order": 5
    },

    # === STORY WALKTHROUGH (5 articles) ===
    {
        "category": "story-walkthrough",
        "title": "Endless Ragnarok Story Walkthrough — Complete Chapter-by-Chapter Guide",
        "slug": "story-walkthrough",
        "keywords": ["Endless Ragnarok story walkthrough", "Endless Ragnarok story chapters", "Endless Ragnarok how long is the story", "Endless Ragnarok epilogue story", "Endless Ragnarok story progression tips"],
        "description": "Step-by-step story walkthrough for the Endless Ragnarok expansion, covering every chapter, key story beats, and boss encounters in order.",
        "difficulty": "beginner",
        "order": 1
    },
    {
        "category": "story-walkthrough",
        "title": "Endless Ragnarok Story Explained — Plot Summary and Key Events",
        "slug": "story-explained",
        "keywords": ["Endless Ragnarok story explained", "Endless Ragnarok story summary no spoilers", "Endless Ragnarok Ragnalia explained", "Endless Ragnarok Beelzebub lore", "Endless Ragnarok new story arc"],
        "description": "Complete plot summary of Endless Ragnarok's story arc, explaining the Ragnalia, Beelzebub, The World, and the connection to the broader Granblue Fantasy lore.",
        "difficulty": "beginner",
        "order": 2
    },
    {
        "category": "story-walkthrough",
        "title": "Endless Ragnarok Lore Guide — Astrals, Primal Beasts, and the Sky Realm",
        "slug": "lore-guide",
        "keywords": ["Endless Ragnarok lore guide", "Endless Ragnarok Astrals explained", "Endless Ragnarok Primal Beasts lore", "Endless Ragnarok Sky Realm lore", "Endless Ragnarok world building"],
        "description": "Deep dive into the lore of Endless Ragnarok, covering the Astrals, Primal Beasts, Arcarum, the Sky Realm, and how the expansion connects to Granblue Fantasy's broader mythology.",
        "difficulty": "intermediate",
        "order": 3
    },
    {
        "category": "story-walkthrough",
        "title": "Endless Ragnarok New Antagonists — Ragnalia, Beelzebub, and The World",
        "slug": "new-antagonists",
        "keywords": ["Endless Ragnarok new antagonists list", "Endless Ragnarok Ragnalia explained", "Endless Ragnarok Herald of Doom", "Endless Ragnarok The World lore", "Endless Ragnarok main villain explained"],
        "description": "Detailed profiles of every major antagonist in Endless Ragnarok, including their motivations, lore connections, and role in the story progression.",
        "difficulty": "intermediate",
        "order": 4
    },
    {
        "category": "story-walkthrough",
        "title": "Endless Ragnarok Side Quests and Fate Episodes Guide",
        "slug": "side-quests-and-fate-episodes-guide",
        "keywords": ["Endless Ragnarok side quests guide", "Endless Ragnarok Fate Episodes new", "Endless Ragnarok character backstories", "Endless Ragnarok story quest list", "Endless Ragnarok Lyria journal entries"],
        "description": "Complete guide to all side quests and Fate Episodes in Endless Ragnarok, including unlock requirements, rewards, and character backstory content.",
        "difficulty": "intermediate",
        "order": 5
    },

    # === ENDGAME (5 articles) ===
    {
        "category": "endgame",
        "title": "Endless Ragnarok Endgame Checklist — Everything to Do After the Story",
        "slug": "endgame-checklist",
        "keywords": ["Endless Ragnarok endgame checklist", "Endless Ragnarok what to do after story", "Endless Ragnarok post game guide", "Endless Ragnarok endgame content", "Endless Ragnarok things to do endgame"],
        "description": "Complete endgame checklist for Endless Ragnarok covering every activity, system to master, and piece of content to tackle after finishing the main story.",
        "difficulty": "intermediate",
        "order": 1
    },
    {
        "category": "endgame",
        "title": "Endless Ragnarok Endgame Farming Guide — Optimal Routes for Every Material",
        "slug": "endgame-farming-guide",
        "keywords": ["Endless Ragnarok endgame farming", "Endless Ragnarok farming guide", "Endless Ragnarok best quests to farm", "Endless Ragnarok sigil farming endgame", "Endless Ragnarok weapon farming"],
        "description": "Optimized farming routes for every endgame material in Endless Ragnarok, comparing Conflux vs Fatebeaker vs specific quest farming with efficiency benchmarks.",
        "difficulty": "advanced",
        "order": 2
    },
    {
        "category": "endgame",
        "title": "Endless Ragnarok Sigil Farming Endgame — Best Quests and Routes",
        "slug": "sigil-farming-endgame",
        "keywords": ["Endless Ragnarok Sigil farming endgame", "Endless Ragnarok Sigil farming fastest", "Endless Ragnarok best quests to farm sigils", "Endless Ragnarok Sigil drop rate", "Endless Ragnarok Sigil optimization"],
        "description": "Dedicated Sigil farming guide for endgame players, with specific quest selections, Conflux room strategies, and how to target specific Sigil traits.",
        "difficulty": "advanced",
        "order": 3
    },
    {
        "category": "endgame",
        "title": "Endless Ragnarok Fatebeaker Quests Guide — High-Difficulty Endgame Challenges",
        "slug": "fatebeaker-quests-guide",
        "keywords": ["Endless Ragnarok Fatebeaker quests", "Endless Ragnarok Fatebeaker boss quests", "Endless Ragnarok high difficulty quests", "Endless Ragnarok Weapon Transcendence materials", "Endless Ragnarok endgame challenges"],
        "description": "Complete guide to Fatebeaker-grade quests in Endless Ragnarok, covering quest types, difficulty ratings, rewards, and optimal team compositions.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "endgame",
        "title": "Endless Ragnarok Efficiency Tips — Maximize Your Grinding Sessions",
        "slug": "efficiency-tips",
        "keywords": ["Endless Ragnarok efficiency tips", "Endless Ragnarok how to get strong fast", "Endless Ragnarok fastest way to start", "Endless Ragnarok farming optimization", "Endless Ragnarok time saving tips"],
        "description": "Efficiency tips for Endless Ragnarok endgame grinding, covering time-saving strategies, optimal session planning, and how to avoid wasting resources.",
        "difficulty": "intermediate",
        "order": 5
    },

    # === BUILDS (5 articles) ===
    {
        "category": "builds",
        "title": "Endless Ragnarok All Character Builds — Best Setup for Every Character",
        "slug": "all-character-builds",
        "keywords": ["Endless Ragnarok all character builds", "Endless Ragnarok best build for each character", "Endless Ragnarok build guide", "Endless Ragnarok character builds 2026", "Endless Ragnarok optimal builds"],
        "description": "Build recommendations for all 28 characters in Endless Ragnarok, covering best Master Trait paths, Sigil loadouts, weapon choices, and skill rotations.",
        "difficulty": "intermediate",
        "order": 1
    },
    {
        "category": "builds",
        "title": "Endless Ragnarok Beatrix Build — Delta Clock DPS Build Guide",
        "slug": "beatrix-build",
        "keywords": ["Endless Ragnarok Beatrix build", "Endless Ragnarok Beatrix Delta Clock", "Endless Ragnarok Beatrix best Sigils", "Endless Ragnarok Beatrix Master Traits", "Endless Ragnarok Beatrix weapon"],
        "description": "Optimal DPS build for Beatrix in Endless Ragnarok, covering Master Trait path, Sigil loadout, weapon choice, and Delta Clock rotation strategy.",
        "difficulty": "advanced",
        "order": 2
    },
    {
        "category": "builds",
        "title": "Endless Ragnarok Cagliostro Build — Support Healer Build Guide",
        "slug": "cagliostro-build",
        "keywords": ["Endless Ragnarok Cagliostro build", "Endless Ragnarok Cagliostro support", "Endless Ragnarok Cagliostro best Sigils", "Endless Ragnarok Cagliostro Master Traits", "Endless Ragnarok Cagliostro revive"],
        "description": "Optimal support build for Cagliostro in Endless Ragnarok, covering Master Trait path, Sigil loadout, weapon choice, and party buff rotation strategy.",
        "difficulty": "advanced",
        "order": 3
    },
    {
        "category": "builds",
        "title": "Endless Ragnarok Sandalphon Build — SS Tier Supreme Primarch DPS Build",
        "slug": "sandalphon-build",
        "keywords": ["Endless Ragnarok Sandalphon build", "Endless Ragnarok Sandalphon Supreme Primarch Mode", "Endless Ragnarok Sandalphon best Sigils", "Endless Ragnarok Sandalphon Master Traits", "Endless Ragnarok Sandalphon lightstep"],
        "description": "Optimal DPS build for Sandalphon in Endless Ragnarok, covering Supreme Primarch Mode optimization, lightstep sword wave spam, and Sigil priority.",
        "difficulty": "advanced",
        "order": 4
    },
    {
        "category": "builds",
        "title": "Endless Ragnarok Maglielle Build — Ranged Support Build Guide",
        "slug": "maglielle-build",
        "keywords": ["Endless Ragnarok Maglielle build", "Endless Ragnarok Maglielle healing", "Endless Ragnarok Maglielle best Sigils", "Endless Ragnarok Maglielle Master Traits", "Endless Ragnarok Maglielle invulnerability shield"],
        "description": "Optimal support build for Maglielle in Endless Ragnarok, covering healing rotation, invulnerability shield usage, flying weapons, and Sigil loadout.",
        "difficulty": "advanced",
        "order": 5
    },
]

def get_filename(article: dict) -> str:
    """Generate the PascalCase filename for an article."""
    slug = article["slug"]
    pascal = slug.replace("-", " ").title().replace(" ", "-")
    return f"Endless-Ragnarok-{pascal}.mdx"

def get_filepath(article: dict) -> str:
    """Get the full filepath for an article."""
    return f"{CONTENT_DIR}/{article['category']}/{get_filename(article)}"

def main():
    # Parse args
    start_from = 0
    if len(sys.argv) > 1:
        start_from = int(sys.argv[1])
    
    total = len(ARTICLES)
    success = 0
    failed = 0
    skipped = 0
    
    print(f"Generating {total} articles, starting from index {start_from}")
    
    for i, article in enumerate(ARTICLES):
        if i < start_from:
            skipped += 1
            continue
        
        filepath = get_filepath(article)
        filename = get_filename(article)
        print(f"\n[{i+1}/{total}] Generating: {article['category']}/{filename}")
        
        # Generate content
        content = generate_article(article)
        
        if not content:
            print(f"  ❌ FAILED - empty response from LLM")
            failed += 1
            continue
        
        # Validate content quality
        word_count = len(content.split())
        has_boilerplate = any(phrase in content for phrase in [
            "When approaching understanding",
            "Each character in Endless Ragnarok has unique strengths and weaknesses within",
            "The detailed mechanics of understanding",
            "To apply understanding",
        ])
        
        if has_boilerplate:
            print(f"  ⚠️  WARNING - contains banned boilerplate, regenerating...")
            content = generate_article(article)
            if not content:
                print(f"  ❌ FAILED - empty response on retry")
                failed += 1
                continue
            has_boilerplate = any(phrase in content for phrase in [
                "When approaching understanding",
                "Each character in Endless Ragnarok has unique strengths and weaknesses within",
            ])
            if has_boilerplate:
                print(f"  ❌ FAILED - still contains boilerplate after retry")
                failed += 1
                continue
        
        # Ensure content starts with metadata export
        if not content.startswith("export const metadata"):
            print(f"  ⚠️  Content doesn't start with metadata, skipping")
            failed += 1
            continue
        
        # Write file
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            f.write(content + "\n")
        
        # Count words excluding metadata
        metadata_end = content.find("};")
        if metadata_end > 0:
            body = content[metadata_end + 2:]
            body_words = len(body.split())
        else:
            body_words = word_count
        
        print(f"  ✅ Written: {body_words} words (body), {filepath}")
        success += 1
        
        # Small delay to avoid rate limiting
        time.sleep(2)
    
    print(f"\n=== Generation Complete ===")
    print(f"Success: {success}, Failed: {failed}, Skipped: {skipped}")
    print(f"Total articles: {total}")

if __name__ == "__main__":
    main()
