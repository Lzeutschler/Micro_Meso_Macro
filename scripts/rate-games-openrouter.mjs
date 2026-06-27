import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const root = process.cwd();
const gamesPath = path.join(root, "src", "lib", "games.ts");
const importedPath = path.join(root, "src", "lib", "imported-games.json");
const defaultOutPath = path.join(root, "src", "lib", "llm-game-assessments.json");
const methodVersion = "cheat-check-v1";
const defaultModel = "google/gemini-3.1-flash-lite";

const categoryValues = ["pure", "micro-macro", "micro-meso", "meso-macro", "tri-core"];
const dimensionValues = ["micro", "meso", "macro"];

const anchorCalibrations = {
  "counter-strike-2": {
    category: "tri-core",
    ordering: "micro > meso > macro",
    note: "Aimbot is the strongest single cheat; wallhacks are also enormous; economy/strategy matters but is clearly lower.",
  },
  "apex-legends": {
    category: "tri-core",
    ordering: "micro ~= meso ~= macro",
    note: "Aimbot, wallhacks, and perfect ring/rotation knowledge should all be similarly powerful. Keep the scores close.",
  },
  "rocket-league": {
    category: "tri-core",
    ordering: "micro > macro > meso",
    note: "Perfect mechanics dominate. Rotations/boost/pathing are second. Meso is lowest because nearly all information is visible.",
  },
  "overwatch-2": {
    category: "tri-core",
    ordering: "role-dependent: DPS micro, tank meso, support macro",
    note: "Overall tri-core because the best cheat depends strongly on role.",
  },
};

function getArg(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function astValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(astValue);
  if (ts.isObjectLiteralExpression(node)) return objectFromLiteral(node);
  return undefined;
}

function objectFromLiteral(node) {
  const result = {};
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = property.name;
    const key = ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : undefined;
    if (!key) continue;
    result[key] = astValue(property.initializer);
  }
  return result;
}

async function readCuratedGames() {
  const sourceText = await readFile(gamesPath, "utf8");
  const sourceFile = ts.createSourceFile(gamesPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const games = [];

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "curatedGameSeeds" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const element of node.initializer.elements) {
        if (ts.isObjectLiteralExpression(element)) games.push(objectFromLiteral(element));
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return games;
}

async function readImportedGames() {
  try {
    return JSON.parse(await readFile(importedPath, "utf8"));
  } catch {
    return [];
  }
}

async function readExistingAssessments(outPath) {
  try {
    return JSON.parse(await readFile(outPath, "utf8"));
  } catch {
    return [];
  }
}

function normalizeGame(game, sourceKind) {
  return {
    id: game.id,
    title: game.title,
    type: game.type,
    platforms: asArray(game.platforms),
    tags: asArray(game.tags),
    description: game.description,
    storeUrl: game.storeUrl,
    officialUrl: game.officialUrl,
    currentScores: {
      micro: game.micro,
      meso: game.meso,
      macro: game.macro,
      category: game.category,
      why: game.why,
    },
    sourceKind,
    popularity: game.source
      ? {
          rank: game.source.rank,
          currentPlayers: game.source.currentPlayers,
          peakPlayers: game.source.peakPlayers,
          playerHours: game.source.playerHours,
        }
      : undefined,
  };
}

async function loadGames() {
  const curated = (await readCuratedGames()).map((game) => normalizeGame(game, "curated"));
  const imported = (await readImportedGames()).map((game) => normalizeGame(game, "steam-import"));
  const byId = new Map();

  for (const game of imported) byId.set(game.id, game);
  for (const game of curated) byId.set(game.id, game);
  return Array.from(byId.values()).filter((game) => game.id && game.title);
}

function buildSystemPrompt() {
  return `You are classifying games with the Cheat-Check method for the Micro/Meso/Macro model.

Core method:
Ask: "Which cheat would most completely break this game and make it trivial?"
Do not trust genre labels by themselves. Infer the actual player skill pressure.

Dimensions:
Micro = execution layer. Reflexes, timing, aiming, movement precision, input discipline, muscle memory.
Micro-breaking cheats: aimbot, perfect inputs, perfect dodges, perfect timing, flawless mechanical control.

Meso = probability, psychology, hidden information, opponent reads, randomness management.
Meso-breaking cheats: stream-sniping, wallhacks, seeing cooldowns/hands/intent, knowing hidden info or RNG outcomes early.

Macro = systems layer. Strategy, resources, build orders, long-term planning, optimization, win-condition understanding.
Macro-breaking cheats: chess engine, perfect coach, economy automation, solver, optimal build/route planner.

Anchor examples from the source video. Match these strongly when a game is equivalent:
Pure Micro: osu!, Geometry Dash, Aim Lab / aim trainers, Tetris.
Pure Meso: Rock Paper Scissors, Among Us, Liar's Bar, stock market.
Pure Macro: Factorio, Poly Bridge, Connect 4, Tic-Tac-Toe.
Micro + Macro: Rubik's Cube, speedrunning such as Mario 64, Jump King, Getting Over It, Elden Ring, 8-Ball Pool.
Micro + Meso: fighting games such as Street Fighter, Tekken, Smash Bros, Brawlhalla; Mario Kart; Tetris 99; Fall Guys; Gang Beasts.
Meso + Macro: Hearthstone, Teamfight Tactics, Pokemon VGC, Battleship, human-level Chess, Balatro, Phasmophobia.
Tri-Core: League of Legends, Dota 2, Counter-Strike 2, Valorant, Overwatch, Marvel Rivals, Rocket League, Apex Legends, Rainbow Six Siege, World of Warcraft.

Important weighting notes:
Counter-Strike 2 is Tri-Core but Micro-dominant: aimbot is the strongest single cheat, wallhacks are also huge, macro/economy is lower.
Overwatch role varies: DPS micro, tank meso/cooldowns, support macro/coach. Overall Tri-Core.
Apex Legends is unusually balanced: aimbot, wallhacks, and perfect ring/rotation knowledge can all compete.
Rocket League is Tri-Core or near Tri-Core but heavily Micro-dominant; Meso is lower because most info is visible.

Hard calibration for exact anchor titles:
If the game is Counter-Strike 2, preserve the ordering Micro > Meso > Macro.
If the game is Apex Legends, keep Micro, Meso, and Macro close because the three cheat types are similarly powerful.
If the game is Rocket League, preserve the ordering Micro > Macro > Meso. Do not put Meso above Macro for Rocket League.
If the game is Overwatch 2, keep it Tri-Core and explain role dependence.

Scoring:
Return 0-100 scores. Use 0-20 for nearly absent, 21-45 for supporting, 46-65 for meaningful, 66-84 for major, 85-100 for core/dominant.
Category is based on which dimensions are central, not merely nonzero:
- pure: only one dimension is central.
- micro-macro, micro-meso, meso-macro: exactly two dimensions are central.
- tri-core: all three dimensions are central.

Be conservative with tri-core. Use tri-core only when all three cheats would significantly change outcomes at skilled play.
For single-player games, Meso can still exist through RNG, uncertainty, deduction, or imperfect information, but not through ordinary enemy pattern recognition alone.
Output only valid JSON matching the schema.`;
}

function buildUserPrompt(game) {
  const anchorCalibration = anchorCalibrations[game.id];
  return `Classify this game using the Cheat-Check method.

Game:
${JSON.stringify(
  {
    id: game.id,
    title: game.title,
    type: game.type,
    platforms: game.platforms,
    tags: game.tags,
    description: game.description,
    popularity: game.popularity,
    currentDemoScoresToIgnoreUnlessTheyMatchTheCheatCheck: game.currentScores,
  },
  null,
  2,
)}
${anchorCalibration ? `\nExact anchor calibration from the source video:\n${JSON.stringify(anchorCalibration, null, 2)}\n` : ""}

Reasoning requirements:
1. Identify the best Micro cheat and how much it breaks the game.
2. Identify the best Meso cheat and how much it breaks the game.
3. Identify the best Macro cheat and how much it breaks the game.
4. Compare those cheats against the anchor examples.
5. Produce final scores, category, a short cheat summary, and a concise why text for a game card.`;
}

function responseSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "micro",
      "meso",
      "macro",
      "category",
      "dominantDimension",
      "cheat",
      "why",
      "confidence",
      "rationale",
      "dimensionEvidence",
      "anchorMatches",
      "reviewFlags",
    ],
    properties: {
      micro: { type: "integer", minimum: 0, maximum: 100 },
      meso: { type: "integer", minimum: 0, maximum: 100 },
      macro: { type: "integer", minimum: 0, maximum: 100 },
      category: { type: "string", enum: categoryValues },
      dominantDimension: { type: "string", enum: dimensionValues },
      cheat: { type: "string", minLength: 12, maxLength: 180 },
      why: { type: "string", minLength: 20, maxLength: 240 },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      rationale: { type: "string", minLength: 40, maxLength: 800 },
      dimensionEvidence: {
        type: "object",
        additionalProperties: false,
        required: ["micro", "meso", "macro"],
        properties: {
          micro: { type: "string", minLength: 10, maxLength: 240 },
          meso: { type: "string", minLength: 10, maxLength: 240 },
          macro: { type: "string", minLength: 10, maxLength: 240 },
        },
      },
      anchorMatches: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
      },
      reviewFlags: {
        type: "array",
        items: { type: "string" },
        maxItems: 8,
      },
    },
  };
}

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Model did not return JSON. Raw content: ${content.slice(0, 400)}`);
    return JSON.parse(match[0]);
  }
}

function validateAssessment(game, raw, model) {
  const category = categoryValues.includes(raw.category) ? raw.category : undefined;
  const dominantDimension = dimensionValues.includes(raw.dominantDimension) ? raw.dominantDimension : undefined;
  if (!category || !dominantDimension) throw new Error(`Invalid category/dominantDimension for ${game.id}`);

  return {
    id: game.id,
    title: game.title,
    micro: clampScore(raw.micro),
    meso: clampScore(raw.meso),
    macro: clampScore(raw.macro),
    category,
    dominantDimension,
    cheat: String(raw.cheat ?? "").slice(0, 240),
    why: String(raw.why ?? "").slice(0, 280),
    confidence: Math.max(0, Math.min(1, Number(raw.confidence) || 0)),
    rationale: String(raw.rationale ?? "").slice(0, 1000),
    dimensionEvidence: raw.dimensionEvidence,
    anchorMatches: asArray(raw.anchorMatches).map(String).slice(0, 5),
    reviewFlags: asArray(raw.reviewFlags).map(String).slice(0, 8),
    model,
    methodVersion,
    assessedAt: new Date().toISOString(),
    reviewStatus: "llm-assessed",
  };
}

async function callOpenRouterOnce({ game, model, apiKey, retry = false }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
      "http-referer": "https://github.com/",
      "x-title": "Micro Meso Macro Cheat Check",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 2200,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cheat_check_game_assessment",
          strict: true,
          schema: responseSchema(),
        },
      },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        {
          role: "user",
          content: retry
            ? `${buildUserPrompt(game)}\n\nYour previous attempt did not parse as JSON. Return exactly one JSON object and no prose.`
            : buildUserPrompt(game),
        },
      ],
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `OpenRouter request failed with ${response.status}`);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter response has no message content.");
  return parseModelJson(content);
}

async function callOpenRouter({ game, model, apiKey }) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await callOpenRouterOnce({ game, model, apiKey, retry: attempt > 0 });
    } catch (error) {
      lastError = error;
      console.warn(`Retrying ${game.id} (${attempt + 1}/3): ${error.message}`);
    }
  }
  throw lastError;
}

function selectGames(games, existingById) {
  const ids = getArg("ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  const includeExisting = hasFlag("include-existing");
  const onlyNeedsReview = hasFlag("needs-review");
  const limitArg = getArg("limit");
  const limit = limitArg === "all" ? Number.POSITIVE_INFINITY : Number.parseInt(limitArg ?? "10", 10);

  let selected = games;
  if (ids?.length) selected = selected.filter((game) => ids.includes(game.id));
  if (!includeExisting) selected = selected.filter((game) => !existingById.has(game.id));
  if (onlyNeedsReview) {
    selected = selected.filter((game) => game.sourceKind === "steam-import" || !game.currentScores.category);
  }
  return selected.slice(0, Number.isFinite(limit) ? limit : undefined);
}

async function main() {
  const outPath = path.resolve(root, getArg("out") ?? defaultOutPath);
  const model = getArg("model") ?? process.env.OPENROUTER_MODEL ?? defaultModel;
  const dryRun = hasFlag("dry-run");
  const printPrompt = hasFlag("print-prompt");
  const apiKey = process.env.OPENROUTER_API_KEY;

  const games = await loadGames();
  const existing = await readExistingAssessments(outPath);
  const existingById = new Map(existing.map((assessment) => [assessment.id, assessment]));
  const selected = selectGames(games, existingById);

  if (printPrompt) {
    const game = selected[0] ?? games[0];
    console.log(buildSystemPrompt());
    console.log("\n--- USER PROMPT ---\n");
    console.log(buildUserPrompt(game));
    return;
  }

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          model,
          output: outPath,
          availableGames: games.length,
          alreadyAssessed: existing.length,
          selected: selected.map((game) => ({ id: game.id, title: game.title, sourceKind: game.sourceKind })),
          schema: responseSchema(),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required. Use --dry-run or --print-prompt to inspect without calling the API.");
  }

  const assessmentsById = new Map(existing.map((assessment) => [assessment.id, assessment]));
  for (const game of selected) {
    console.log(`Assessing ${game.title} (${game.id}) with ${model}`);
    const raw = await callOpenRouter({ game, model, apiKey });
    const assessment = validateAssessment(game, raw, model);
    assessmentsById.set(game.id, assessment);
    await writeFile(outPath, `${JSON.stringify(Array.from(assessmentsById.values()), null, 2)}\n`, "utf8");
  }

  console.log(`Wrote ${assessmentsById.size} assessments -> ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
