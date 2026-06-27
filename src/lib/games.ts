export type Dimension = "micro" | "meso" | "macro";

export type Game = {
  id: string;
  title: string;
  type: string;
  platforms: string[];
  tags: string[];
  storeUrl?: string;
  officialUrl?: string;
  imageUrl?: string;
  imageSource?: "steam" | "official" | "local" | "none";
  cheat: string;
  category: "pure" | "micro-macro" | "micro-meso" | "meso-macro" | "tri-core";
  micro: number;
  meso: number;
  macro: number;
  why: string;
};

export type Scores = Record<Dimension, number>;

type GameSeed = Omit<Game, "storeUrl" | "officialUrl" | "imageUrl" | "imageSource" | "cheat" | "category"> &
  Partial<Pick<Game, "storeUrl" | "officialUrl" | "imageUrl" | "imageSource" | "cheat" | "category">>;

export const dimensions: Array<{
  id: Dimension;
  label: string;
  short: string;
  color: string;
  description: string;
  cheatTest: string;
}> = [
  {
    id: "micro",
    label: "Micro",
    short: "Execution",
    color: "var(--micro)",
    description: "Timing under pressure, clean aim, input discipline, and muscle memory.",
    cheatTest: "Would perfect execution flatten the challenge?",
  },
  {
    id: "meso",
    label: "Meso",
    short: "Reads",
    color: "var(--meso)",
    description: "Mindgames, odds, hidden information, and the way opponents leak intent.",
    cheatTest: "Would private information make the game cave in?",
  },
  {
    id: "macro",
    label: "Macro",
    short: "Systems",
    color: "var(--macro)",
    description: "Resources, build orders, win conditions, long plans, and optimization.",
    cheatTest: "Would a perfect coach or engine solve the hard part?",
  },
];

const gameSeeds: GameSeed[] = [
  {
    id: "league-of-legends",
    title: "League of Legends",
    type: "MOBA",
    platforms: ["PC"],
    tags: ["PvP", "Team", "Real-time", "Draft"],
    micro: 78,
    meso: 88,
    macro: 91,
    why: "Mechanical trades keep colliding with lane reads and map calls. No pause button.",
  },
  {
    id: "counter-strike-2",
    title: "Counter-Strike 2",
    type: "Tactical Shooter",
    platforms: ["PC"],
    tags: ["PvP", "Team", "Aim", "Economy"],
    micro: 92,
    meso: 86,
    macro: 68,
    why: "Aim hits hard here. Crosshair placement too. Then utility, info, and economy quietly decide the round.",
  },
  {
    id: "rocket-league",
    title: "Rocket League",
    type: "Sports Action",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    tags: ["PvP", "Physics", "Team", "Aerials"],
    micro: 96,
    meso: 76,
    macro: 62,
    why: "Car control does the heavy lifting, while rotations and opponent reads add another layer underneath.",
  },
  {
    id: "tekken-8",
    title: "Tekken 8",
    type: "Fighting",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["PvP", "Fighting", "Reads", "Execution"],
    micro: 91,
    meso: 90,
    macro: 45,
    why: "Combos and punishes are only the surface. Reads, frame traps, matchup memory; the pressure gets close.",
  },
  {
    id: "super-smash-bros-ultimate",
    title: "Super Smash Bros. Ultimate",
    type: "Platform Fighter",
    platforms: ["Switch"],
    tags: ["PvP", "Fighting", "Party", "Movement"],
    micro: 88,
    meso: 87,
    macro: 42,
    why: "Movement and spacing are twitchy, yet baits and edgeguard reads decide who gets to stay on stage.",
  },
  {
    id: "hearthstone",
    title: "Hearthstone",
    type: "Card Battler",
    platforms: ["PC", "Mobile"],
    tags: ["Cards", "RNG", "Ladder", "Deckbuilding"],
    micro: 12,
    meso: 84,
    macro: 74,
    why: "Odds matter. So do bluff signals and the slow resource lines that shape a match before lethal appears.",
  },
  {
    id: "teamfight-tactics",
    title: "Teamfight Tactics",
    type: "Auto Battler",
    platforms: ["PC", "Mobile"],
    tags: ["RNG", "Economy", "Draft", "Optimization"],
    micro: 16,
    meso: 73,
    macro: 91,
    why: "Scouting helps; probability whispers. Economy and composition paths usually speak louder.",
  },
  {
    id: "poker",
    title: "Poker",
    type: "Table Game",
    platforms: ["Tabletop", "PC", "Mobile"],
    tags: ["Hidden Info", "Bluff", "Math", "PvP"],
    micro: 3,
    meso: 96,
    macro: 72,
    why: "Reads sit at the center, with range logic, bluff frequency, and bankroll choices pressing from every side.",
  },
  {
    id: "starcraft-ii",
    title: "StarCraft II",
    type: "RTS",
    platforms: ["PC"],
    tags: ["PvP", "Real-time", "Build Orders", "APM"],
    micro: 86,
    meso: 73,
    macro: 96,
    why: "APM and unit control matter immediately. Build orders, tech timing, and economy punish you later.",
  },
  {
    id: "age-of-empires-iv",
    title: "Age of Empires IV",
    type: "RTS",
    platforms: ["PC", "Xbox"],
    tags: ["Real-time", "Economy", "Map Control", "History"],
    micro: 63,
    meso: 62,
    macro: 92,
    why: "Villager efficiency and tech paths carry enormous weight; raw mechanics only get you so far.",
  },
  {
    id: "speedrunning",
    title: "Speedrunning",
    type: "Challenge Format",
    platforms: ["Any"],
    tags: ["Execution", "Routes", "Singleplayer", "Optimization"],
    micro: 94,
    meso: 28,
    macro: 81,
    why: "Precise inputs and route optimization carry the run. Opponent psychology barely enters the room.",
  },
  {
    id: "rubiks-cube",
    title: "Rubik's Cube",
    type: "Puzzle Sport",
    platforms: ["Physical"],
    tags: ["Execution", "Pattern", "Optimization", "Solo"],
    micro: 82,
    meso: 9,
    macro: 76,
    why: "Finger tricks turn lookahead into speed, while algorithm choice keeps the solve from drifting.",
  },
  {
    id: "celeste",
    title: "Celeste",
    type: "Precision Platformer",
    platforms: ["PC", "Console"],
    tags: ["Platformer", "Singleplayer", "Execution"],
    micro: 93,
    meso: 18,
    macro: 38,
    why: "Progress hangs on timing. Clean inputs. A movement rhythm that survives the panic.",
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    type: "Action RPG",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["Bosses", "Builds", "Exploration", "PvE"],
    micro: 78,
    meso: 42,
    macro: 69,
    why: "Boss execution and reads change shape once builds, routes, and resource habits enter the fight.",
  },
  {
    id: "dark-souls-iii",
    title: "Dark Souls III",
    type: "Action RPG",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["Bosses", "PvE", "Builds", "Timing"],
    micro: 80,
    meso: 38,
    macro: 58,
    why: "Timing dominates. Pattern recognition follows close behind, framed by the build you brought in.",
  },
  {
    id: "overwatch-2",
    title: "Overwatch 2",
    type: "Hero Shooter",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    tags: ["PvP", "Team", "Aim", "Cooldowns"],
    micro: 86,
    meso: 82,
    macro: 75,
    why: "Aim has to land. Cooldowns need counting. Ult economy and team tempo keep tugging the fight around.",
  },
  {
    id: "valorant",
    title: "Valorant",
    type: "Tactical Shooter",
    platforms: ["PC", "Console"],
    tags: ["PvP", "Aim", "Utility", "Team"],
    micro: 88,
    meso: 83,
    macro: 73,
    why: "Gunfights are strict. Utility chains and site plans decide plenty of rounds before the peek happens.",
  },
  {
    id: "dota-2",
    title: "Dota 2",
    type: "MOBA",
    platforms: ["PC"],
    tags: ["PvP", "Team", "Draft", "Economy"],
    micro: 75,
    meso: 86,
    macro: 97,
    why: "Item timings, drafts, and map pressure feel deeply systemic, with reads layered into almost every move.",
  },
  {
    id: "chess",
    title: "Chess",
    type: "Abstract Strategy",
    platforms: ["Board", "PC", "Mobile"],
    tags: ["Perfect Info", "Strategy", "Tactics", "PvP"],
    micro: 4,
    meso: 45,
    macro: 96,
    why: "No execution pressure. An engine would still compress the planning and tactics into something unfair.",
  },
  {
    id: "go",
    title: "Go",
    type: "Abstract Strategy",
    platforms: ["Board", "PC", "Mobile"],
    tags: ["Perfect Info", "Territory", "Strategy", "PvP"],
    micro: 3,
    meso: 54,
    macro: 98,
    why: "Long-term shape, influence, and whole-board planning take up most of the oxygen.",
  },
  {
    id: "civilization-vi",
    title: "Civilization VI",
    type: "4X Strategy",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["4X", "Turn-Based", "Economy", "Diplomacy"],
    micro: 7,
    meso: 55,
    macro: 95,
    why: "Victory conditions, research paths, expansion, diplomacy: the system is the main event.",
  },
  {
    id: "slay-the-spire",
    title: "Slay the Spire",
    type: "Roguelike Deckbuilder",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Cards", "RNG", "Roguelike", "Optimization"],
    micro: 8,
    meso: 68,
    macro: 87,
    why: "Card drafts and relic paths shape the run, while risk management matters far more than reaction speed.",
  },
  {
    id: "hades",
    title: "Hades",
    type: "Action Roguelike",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Action", "Roguelike", "Builds", "PvE"],
    micro: 82,
    meso: 34,
    macro: 62,
    why: "Dash timing and weapon control keep the hands busy; boon synergies shape the run around them.",
  },
  {
    id: "dead-cells",
    title: "Dead Cells",
    type: "Action Roguelike",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Action", "Roguelike", "Platformer", "Builds"],
    micro: 86,
    meso: 28,
    macro: 58,
    why: "Fast combat execution sits up front. Build choices decide how much momentum you get to keep.",
  },
  {
    id: "mario-kart-8-deluxe",
    title: "Mario Kart 8 Deluxe",
    type: "Arcade Racing",
    platforms: ["Switch"],
    tags: ["Racing", "Party", "Items", "PvP"],
    micro: 64,
    meso: 71,
    macro: 35,
    why: "Drifts and racing lines matter, while items, positioning, and chaos reads bend the race sideways.",
  },
  {
    id: "trackmania",
    title: "Trackmania",
    type: "Time Trial Racing",
    platforms: ["PC", "Console"],
    tags: ["Racing", "Time Trial", "Execution", "Routes"],
    micro: 95,
    meso: 10,
    macro: 59,
    why: "Input perfection plus track optimization. That is almost the entire mountain.",
  },
  {
    id: "minecraft",
    title: "Minecraft",
    type: "Sandbox",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Sandbox", "Survival", "Creative", "Co-op"],
    micro: 35,
    meso: 42,
    macro: 78,
    why: "The skill profile depends on the mode. Planning, systems, and long projects still carry a lot of weight.",
  },
  {
    id: "terraria",
    title: "Terraria",
    type: "Sandbox Action",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Sandbox", "Bosses", "Crafting", "Co-op"],
    micro: 67,
    meso: 29,
    macro: 74,
    why: "Boss execution gets sharper when arena building, gear progression, and prep are already handled.",
  },
  {
    id: "factorio",
    title: "Factorio",
    type: "Automation",
    platforms: ["PC", "Switch"],
    tags: ["Automation", "Optimization", "Logistics", "Base"],
    micro: 13,
    meso: 18,
    macro: 99,
    why: "Factory design, throughput, long-range optimization. The appeal lives inside the machine.",
  },
  {
    id: "oxygen-not-included",
    title: "Oxygen Not Included",
    type: "Colony Sim",
    platforms: ["PC"],
    tags: ["Simulation", "Base", "Systems", "Survival"],
    micro: 6,
    meso: 24,
    macro: 97,
    why: "Thermodynamics, resource chains, and colony planning punish weak systems without much ceremony.",
  },
  {
    id: "rimworld",
    title: "RimWorld",
    type: "Colony Sim",
    platforms: ["PC", "Console"],
    tags: ["Simulation", "Story", "Base", "RNG"],
    micro: 12,
    meso: 66,
    macro: 86,
    why: "Random events and pawn behavior crash into base layout, then crisis planning decides who sleeps tonight.",
  },
  {
    id: "among-us",
    title: "Among Us",
    type: "Social Deduction",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Social", "Hidden Info", "Bluff", "Party"],
    micro: 18,
    meso: 95,
    macro: 34,
    why: "Lies matter. Reads matter more. Kill timing and social credibility do the rest in a very human mess.",
  },
  {
    id: "rainbow-six-siege",
    title: "Rainbow Six Siege",
    type: "Tactical Shooter",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["PvP", "Team", "Destruction", "Utility"],
    micro: 82,
    meso: 91,
    macro: 77,
    why: "Angles and aim are harsh. Intel, site setup, and utility trades make the game feel much larger.",
  },
  {
    id: "apex-legends",
    title: "Apex Legends",
    type: "Battle Royale",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    tags: ["PvP", "Aim", "Movement", "BR"],
    micro: 89,
    meso: 79,
    macro: 65,
    why: "Movement and aim ask plenty from you. Third-party reads and rotation choices keep the map unstable.",
  },
  {
    id: "fortnite",
    title: "Fortnite",
    type: "Battle Royale",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["PvP", "Building", "Aim", "BR"],
    micro: 93,
    meso: 72,
    macro: 63,
    why: "Build mechanics and aim spike fast; rotations and inventory plans keep the chaos usable.",
  },
  {
    id: "tetris-effect",
    title: "Tetris Effect",
    type: "Puzzle",
    platforms: ["PC", "Console", "VR"],
    tags: ["Puzzle", "Execution", "Pattern", "Solo"],
    micro: 84,
    meso: 14,
    macro: 70,
    why: "Fast placement fuses with pattern reading, and the stack plan has to survive both.",
  },
  {
    id: "osu",
    title: "osu!",
    type: "Rhythm",
    platforms: ["PC"],
    tags: ["Rhythm", "Aim", "Execution", "Solo"],
    micro: 99,
    meso: 8,
    macro: 25,
    why: "Aim, rhythm, muscle memory. Almost the whole skill feeling lives there.",
  },
  {
    id: "beat-saber",
    title: "Beat Saber",
    type: "VR Rhythm",
    platforms: ["VR"],
    tags: ["VR", "Rhythm", "Execution", "Fitness"],
    micro: 96,
    meso: 7,
    macro: 24,
    why: "Physical timing and precise movement sit right at the center.",
  },
  {
    id: "escape-from-tarkov",
    title: "Escape from Tarkov",
    type: "Extraction Shooter",
    platforms: ["PC"],
    tags: ["PvP", "Loot", "Extraction", "Hidden Info"],
    micro: 78,
    meso: 88,
    macro: 76,
    why: "Aim, sound reads, map knowledge, and risk economy are tangled too tightly to separate.",
  },
  {
    id: "monster-hunter-world",
    title: "Monster Hunter: World",
    type: "Action RPG",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["Bosses", "Co-op", "Gear", "Timing"],
    micro: 77,
    meso: 44,
    macro: 71,
    why: "Weapon mastery and monster reads connect with gear choices, items, and hunt preparation.",
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    type: "CRPG",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["RPG", "Tactics", "Dice", "Narrative"],
    micro: 6,
    meso: 62,
    macro: 86,
    why: "Builds and positioning do heavy work. Resource spending matters, with dice and dialogue info adding Meso pressure.",
  },
  {
    id: "street-fighter-6",
    title: "Street Fighter 6",
    type: "Fighting",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["PvP", "Fighting", "Execution", "Reads"],
    micro: 89,
    meso: 91,
    macro: 48,
    why: "Hit-confirms and spacing make every second dense; Drive reads pull the mind game even closer.",
  },
  {
    id: "mario-maker-2",
    title: "Super Mario Maker 2",
    type: "Creation Platformer",
    platforms: ["Switch"],
    tags: ["Platformer", "Creation", "Execution", "Puzzle"],
    micro: 85,
    meso: 25,
    macro: 55,
    why: "Kaizo levels test execution hard. Good level design and solution routes ask for planning.",
  },
  {
    id: "geometry-dash",
    title: "Geometry Dash",
    type: "Rhythm Platformer",
    platforms: ["PC", "Mobile"],
    tags: ["Rhythm", "Platformer", "Execution", "Solo"],
    micro: 98,
    meso: 8,
    macro: 31,
    why: "Memorization helps, while perfect inputs and timing break open the core difficulty.",
  },
  {
    id: "aim-lab",
    title: "Aim Lab",
    type: "Aim Trainer",
    platforms: ["PC"],
    tags: ["Aim", "Training", "Execution", "Solo"],
    micro: 100,
    meso: 6,
    macro: 18,
    why: "The product measures aim almost directly: flicks, tracking, reaction. Little gets hidden.",
  },
  {
    id: "poly-bridge",
    title: "Poly Bridge",
    type: "Engineering Puzzle",
    platforms: ["PC", "Mobile", "Switch"],
    tags: ["Puzzle", "Physics", "Optimization", "Solo"],
    micro: 4,
    meso: 12,
    macro: 96,
    why: "A solver for budget, stress, and load paths would make the levels fold quickly.",
  },
  {
    id: "connect-4",
    title: "Connect 4",
    type: "Abstract Strategy",
    platforms: ["Board", "PC", "Mobile"],
    tags: ["Perfect Info", "Strategy", "PvP", "Solved"],
    micro: 2,
    meso: 35,
    macro: 94,
    why: "The task is complete line planning and threat control, with no execution pressure to hide behind.",
  },
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    type: "Abstract Strategy",
    platforms: ["Paper", "PC", "Mobile"],
    tags: ["Perfect Info", "Strategy", "Solved", "PvP"],
    micro: 1,
    meso: 20,
    macro: 86,
    why: "Optimal play can be solved as a system, ending in a draw against anyone who knows the script.",
  },
  {
    id: "jump-king",
    title: "Jump King",
    type: "Precision Platformer",
    platforms: ["PC", "Console"],
    tags: ["Platformer", "Execution", "Routes", "Solo"],
    micro: 95,
    meso: 14,
    macro: 58,
    why: "Jump strength, timing, and nerves dominate; route knowledge lowers the cost of each mistake.",
  },
  {
    id: "getting-over-it",
    title: "Getting Over It",
    type: "Physics Climber",
    platforms: ["PC", "Mobile"],
    tags: ["Physics", "Execution", "Routes", "Solo"],
    micro: 94,
    meso: 12,
    macro: 55,
    why: "Perfect mouse movement and route memory matter far more than reading an opponent.",
  },
  {
    id: "8-ball-pool",
    title: "8 Ball Pool",
    type: "Billiards",
    platforms: ["Mobile", "Web"],
    tags: ["Physics", "Aim", "PvP", "Angles"],
    micro: 76,
    meso: 39,
    macro: 70,
    why: "Precise cue control meets position play, angle planning, and safety decisions.",
  },
  {
    id: "brawlhalla",
    title: "Brawlhalla",
    type: "Platform Fighter",
    platforms: ["PC", "PlayStation", "Xbox", "Switch", "Mobile"],
    tags: ["PvP", "Fighting", "Reads", "Execution"],
    micro: 85,
    meso: 88,
    macro: 39,
    why: "Movement, punishes, and dodge reads are the core. Long-range system planning stays light.",
  },
  {
    id: "tetris-99",
    title: "Tetris 99",
    type: "Battle Royale Puzzle",
    platforms: ["Switch"],
    tags: ["Puzzle", "Execution", "Targeting", "PvP"],
    micro: 85,
    meso: 72,
    macro: 62,
    why: "Stack speed, garbage reads, and targeting choices create a surprisingly dense skill profile.",
  },
  {
    id: "fall-guys",
    title: "Fall Guys",
    type: "Party Platformer",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    tags: ["Party", "Platformer", "PvP", "Chaos"],
    micro: 69,
    meso: 72,
    macro: 32,
    why: "Movement and timing count, while player chaos and level reads break plenty of rounds wide open.",
  },
  {
    id: "gang-beasts",
    title: "Gang Beasts",
    type: "Physics Brawler",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    tags: ["Party", "Physics", "PvP", "Brawler"],
    micro: 67,
    meso: 78,
    macro: 24,
    why: "Grabbing and letting go can turn wild fast; stage chaos depends heavily on what opponents try next.",
  },
  {
    id: "pokemon-vgc",
    title: "Pokemon VGC",
    type: "Competitive Battler",
    platforms: ["Switch"],
    tags: ["Turn-Based", "RNG", "Draft", "PvP"],
    micro: 3,
    meso: 84,
    macro: 89,
    why: "Team building and leads collide with damage ranges, reads, RNG, and hidden sets.",
  },
  {
    id: "battleship",
    title: "Battleship",
    type: "Deduction Game",
    platforms: ["Board", "PC", "Mobile"],
    tags: ["Hidden Info", "Deduction", "PvP", "Probability"],
    micro: 1,
    meso: 82,
    macro: 66,
    why: "Probability fields and opponent patterns set the hit chances, then search strategy follows.",
  },
  {
    id: "balatro",
    title: "Balatro",
    type: "Poker Roguelike",
    platforms: ["PC", "Console", "Mobile"],
    tags: ["Cards", "RNG", "Roguelike", "Optimization"],
    micro: 5,
    meso: 74,
    macro: 90,
    why: "Joker synergies and economy are deeply systemic, while draw luck and probability stay close to the wheel.",
  },
  {
    id: "phasmophobia",
    title: "Phasmophobia",
    type: "Co-op Horror",
    platforms: ["PC", "Console"],
    tags: ["Co-op", "Deduction", "Hidden Info", "Horror"],
    micro: 24,
    meso: 80,
    macro: 70,
    why: "Deduction, ghost RNG, and team decisions carry more weight than raw execution.",
  },
  {
    id: "marvel-rivals",
    title: "Marvel Rivals",
    type: "Hero Shooter",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["PvP", "Team", "Aim", "Cooldowns"],
    micro: 84,
    meso: 82,
    macro: 76,
    why: "Hero mechanics, cooldown reads, and teamfight plans sit together inside the Tri-Core.",
  },
  {
    id: "world-of-warcraft",
    title: "World of Warcraft",
    type: "MMORPG",
    platforms: ["PC"],
    tags: ["MMO", "PvE", "PvP", "Systems"],
    micro: 72,
    meso: 74,
    macro: 88,
    why: "Rotations and encounter reads rest on gear, builds, timing, and group planning.",
  },
  {
    id: "liars-bar",
    title: "Liar's Bar",
    type: "Social Bluffing",
    platforms: ["PC"],
    tags: ["Social", "Bluff", "Hidden Info", "PvP"],
    micro: 8,
    meso: 96,
    macro: 48,
    why: "Bluffs, timing, and reading people form the core; execution barely raises its hand.",
  },
];

const steamAppIds: Record<string, number> = {
  "counter-strike-2": 730,
  "rocket-league": 252950,
  "tekken-8": 1778820,
  "age-of-empires-iv": 1466860,
  celeste: 504230,
  "elden-ring": 1245620,
  "dark-souls-iii": 374320,
  "overwatch-2": 2357570,
  "dota-2": 570,
  "civilization-vi": 289070,
  "slay-the-spire": 646570,
  hades: 1145360,
  "dead-cells": 588650,
  trackmania: 2225070,
  terraria: 105600,
  factorio: 427520,
  "oxygen-not-included": 457140,
  rimworld: 294100,
  "among-us": 945360,
  "rainbow-six-siege": 359550,
  "apex-legends": 1172470,
  "tetris-effect": 1003590,
  "beat-saber": 620980,
  "monster-hunter-world": 582010,
  "baldurs-gate-3": 1086940,
  "street-fighter-6": 1364780,
  "geometry-dash": 322170,
  "aim-lab": 714010,
  "poly-bridge": 367450,
  "jump-king": 1061090,
  "getting-over-it": 240720,
  brawlhalla: 291550,
  "fall-guys": 1097150,
  "gang-beasts": 285900,
  balatro: 2379780,
  phasmophobia: 739630,
  "marvel-rivals": 2767030,
  "liars-bar": 3097560,
};

const officialUrls: Record<string, string> = {
  "league-of-legends": "https://www.leagueoflegends.com/",
  hearthstone: "https://hearthstone.blizzard.com/",
  "teamfight-tactics": "https://teamfighttactics.leagueoflegends.com/",
  "starcraft-ii": "https://starcraft2.blizzard.com/",
  valorant: "https://playvalorant.com/",
  "super-smash-bros-ultimate": "https://www.smashbros.com/",
  "mario-kart-8-deluxe": "https://mariokart8.nintendo.com/",
  fortnite: "https://www.fortnite.com/",
  osu: "https://osu.ppy.sh/",
  "escape-from-tarkov": "https://www.escapefromtarkov.com/",
  "mario-maker-2": "https://supermariomaker.nintendo.com/",
  "8-ball-pool": "https://8ballpool.com/",
  "tetris-99": "https://tetris99.nintendo.com/",
  "pokemon-vgc": "https://www.pokemon.com/us/play-pokemon/",
  "world-of-warcraft": "https://worldofwarcraft.blizzard.com/",
};

function categoryFor(game: Pick<Game, "micro" | "meso" | "macro">): Game["category"] {
  const high = {
    micro: game.micro >= 62,
    meso: game.meso >= 62,
    macro: game.macro >= 62,
  };

  if (high.micro && high.meso && high.macro) return "tri-core";
  if (high.micro && high.meso) return "micro-meso";
  if (high.micro && high.macro) return "micro-macro";
  if (high.meso && high.macro) return "meso-macro";
  return "pure";
}

function dominantDimension(game: Pick<Game, "micro" | "meso" | "macro">): Dimension {
  if (game.micro >= game.meso && game.micro >= game.macro) return "micro";
  if (game.meso >= game.macro) return "meso";
  return "macro";
}

function cheatFor(game: Pick<Game, "micro" | "meso" | "macro">, category: Game["category"]) {
  if (category === "tri-core") return "An aimbot changes the fight; wallhacks and perfect coaching can flip the rest.";
  if (category === "micro-meso") return "Perfect inputs plus hidden opponent info crack the core.";
  if (category === "micro-macro") return "Perfect execution paired with an optimal route or build makes the pressure evaporate.";
  if (category === "meso-macro") return "Insider info plus engine-level planning cuts straight through the decisions.";

  const dominant = dominantDimension(game);
  if (dominant === "micro") return "An aimbot or perfect inputs dissolve the main pressure.";
  if (dominant === "meso") return "Stream-sniping or hidden information drains the tension.";
  return "An engine coach solves the system layer.";
}

function enrichGame(seed: GameSeed): Game {
  const appId = steamAppIds[seed.id];
  const category = seed.category ?? categoryFor(seed);
  const imageUrl = seed.imageUrl ?? (appId ? `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg` : undefined);

  return {
    ...seed,
    storeUrl: seed.storeUrl ?? (appId ? `https://store.steampowered.com/app/${appId}` : undefined),
    officialUrl: seed.officialUrl ?? officialUrls[seed.id],
    imageUrl,
    imageSource: seed.imageSource ?? (imageUrl ? "steam" : "none"),
    category,
    cheat: seed.cheat ?? cheatFor(seed, category),
  };
}

export const games: Game[] = gameSeeds.map(enrichGame);

export function gameImage(game: Game) {
  return game.imageUrl;
}

export function gameIcon(game: Game) {
  const appId = steamAppIds[game.id];
  if (appId) return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_231x87.jpg`;
  return game.imageUrl;
}

export function averageScores(items: Game[]): Scores {
  if (!items.length) return { micro: 65, meso: 65, macro: 65 };
  return normalizeScores({
    micro: items.reduce((sum, game) => sum + game.micro, 0) / items.length,
    meso: items.reduce((sum, game) => sum + game.meso, 0) / items.length,
    macro: items.reduce((sum, game) => sum + game.macro, 0) / items.length,
  });
}

export function gameScores(game: Pick<Game, "micro" | "meso" | "macro">): Scores {
  return {
    micro: game.micro,
    meso: game.meso,
    macro: game.macro,
  };
}

export function distance(a: Scores, b: Scores) {
  return Math.sqrt(
    (a.micro - b.micro) ** 2 + (a.meso - b.meso) ** 2 + (a.macro - b.macro) ** 2,
  );
}

export function recommendGames(target: Scores, pool: Game[] = games, excludeIds: string[] = []) {
  return pool
    .filter((game) => !excludeIds.includes(game.id))
    .map((game) => ({ game, distance: distance(target, gameScores(game)) }))
    .sort((a, b) => a.distance - b.distance);
}

export function dominantProfile(scores: Scores) {
  const active = dimensions
    .filter((dimension) => scores[dimension.id] >= 62)
    .map((dimension) => dimension.label);

  if (active.length === 0) return "Low-pressure Explorer";
  if (active.length === 3) return "Tri-Core Competitor";
  return `${active.join(" + ")} Specialist`;
}

export function normalizeScores(scores: Scores): Scores {
  return {
    micro: Math.max(0, Math.min(100, Math.round(scores.micro))),
    meso: Math.max(0, Math.min(100, Math.round(scores.meso))),
    macro: Math.max(0, Math.min(100, Math.round(scores.macro))),
  };
}
