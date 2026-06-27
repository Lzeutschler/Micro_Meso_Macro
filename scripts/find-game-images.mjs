import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const root = process.cwd();
const gamesPath = path.join(root, "src", "lib", "games.ts");
const importedPath = path.join(root, "src", "lib", "imported-games.json");
const overridesPath = path.join(root, "src", "lib", "game-image-overrides.json");

const wikimediaTitles = {
  battleship: "Battleship (game)",
  chess: "Chess",
  "connect-4": "Connect Four",
  go: "Go (game)",
  osu: "Osu!",
  poker: "Poker",
  "rubiks-cube": "Rubik's Cube",
  speedrunning: "Speedrunning",
  "tic-tac-toe": "Tic-tac-toe",
};

function getArg(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function astValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
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

async function readGamesModuleData() {
  const sourceText = await readFile(gamesPath, "utf8");
  const sourceFile = ts.createSourceFile(gamesPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const data = {
    curated: [],
    steamAppIds: {},
    officialUrls: {},
  };

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      if (node.name.text === "curatedGameSeeds" && ts.isArrayLiteralExpression(node.initializer)) {
        data.curated = node.initializer.elements
          .filter(ts.isObjectLiteralExpression)
          .map((element) => objectFromLiteral(element));
      }
      if (node.name.text === "steamAppIds" && ts.isObjectLiteralExpression(node.initializer)) {
        data.steamAppIds = objectFromLiteral(node.initializer);
      }
      if (node.name.text === "officialUrls" && ts.isObjectLiteralExpression(node.initializer)) {
        data.officialUrls = objectFromLiteral(node.initializer);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return data;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function normalizeGame(game, sourceKind) {
  return {
    id: game.id,
    title: game.title,
    imageUrl: game.imageUrl,
    imageSource: game.imageSource,
    officialUrl: game.officialUrl,
    storeUrl: game.storeUrl,
    sourceKind,
  };
}

function resolveUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function htmlDecode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function metaContent(html, names) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return htmlDecode(match[1].trim());
    }
  }
  return undefined;
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "MicroMesoMacro/0.1 image metadata finder",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function imageExists(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "user-agent": "MicroMesoMacro/0.1 image metadata finder" },
    });
    if (response.ok) return true;

    const getResponse = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        range: "bytes=0-16",
        "user-agent": "MicroMesoMacro/0.1 image metadata finder",
      },
    });
    return getResponse.ok;
  } catch {
    return false;
  }
}

async function findOfficialImage(game) {
  const sourceUrl = game.officialUrl;
  if (!sourceUrl) return undefined;

  const html = await fetchText(sourceUrl);
  const image = metaContent(html, ["og:image", "twitter:image", "twitter:image:src"]);
  const imageUrl = image ? resolveUrl(image, sourceUrl) : undefined;
  if (!imageUrl) return undefined;
  if (!(await imageExists(imageUrl))) return undefined;

  return {
    id: game.id,
    imageUrl,
    imageSource: "official",
    sourceUrl,
    foundAt: new Date().toISOString(),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "MicroMesoMacro/0.1 image metadata finder",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function findWikimediaImage(game) {
  if (!wikimediaTitles[game.id]) return undefined;
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", wikimediaTitles[game.id]);
  url.searchParams.set("prop", "pageimages|info");
  url.searchParams.set("piprop", "thumbnail|original");
  url.searchParams.set("pithumbsize", "1200");
  url.searchParams.set("inprop", "url");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const payload = await fetchJson(url.toString());
  const pages = Object.values(payload.query?.pages ?? {}).sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  const hit = pages.find((page) => page.thumbnail?.source || page.original?.source);
  const imageUrl = hit?.thumbnail?.source ?? hit?.original?.source;
  if (!hit || !imageUrl) return undefined;

  return {
    id: game.id,
    imageUrl,
    imageSource: "wikimedia",
    sourceUrl: hit.fullurl,
    foundAt: new Date().toISOString(),
  };
}

async function loadGames() {
  const { curated, steamAppIds, officialUrls } = await readGamesModuleData();
  const imported = await readJson(importedPath, []);
  const overrides = await readJson(overridesPath, []);
  const overrideIds = new Set(overrides.map((override) => override.id));
  const importedById = new Map(imported.map((game) => [game.id, normalizeGame(game, "steam-import")]));

  for (const game of curated) {
    const existing = importedById.get(game.id) ?? {};
    importedById.set(game.id, {
      ...existing,
      ...normalizeGame(game, "curated"),
      officialUrl: game.officialUrl ?? officialUrls[game.id] ?? existing.officialUrl,
      storeUrl: game.storeUrl ?? existing.storeUrl,
      hasSteamImageFallback: Boolean(steamAppIds[game.id]),
      hasOverride: overrideIds.has(game.id),
    });
  }

  return {
    games: Array.from(importedById.values()),
    overrides,
  };
}

function gameNeedsImage(game) {
  return !game.imageUrl && !game.hasSteamImageFallback && !game.hasOverride;
}

async function main() {
  const dryRun = hasFlag("dry-run");
  const includeExisting = hasFlag("include-existing");
  const ids = getArg("ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  const limitArg = getArg("limit");
  const limit = limitArg === "all" ? Number.POSITIVE_INFINITY : Number.parseInt(limitArg ?? "all", 10);
  const { games, overrides } = await loadGames();
  const overridesById = new Map(overrides.map((override) => [override.id, override]));

  let selected = games.filter((game) => (includeExisting ? !game.imageUrl : gameNeedsImage(game)));
  if (ids?.length) selected = selected.filter((game) => ids.includes(game.id));
  selected = selected.slice(0, Number.isFinite(limit) ? limit : undefined);

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          totalGames: games.length,
          existingOverrides: overrides.length,
          gamesWithoutImage: games.filter(gameNeedsImage).length,
          selected: selected.map((game) => ({
            id: game.id,
            title: game.title,
            officialUrl: game.officialUrl,
            sourceKind: game.sourceKind,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  const found = [];
  const missed = [];

  for (const game of selected) {
    try {
      let override;
      try {
        override = await findOfficialImage(game);
      } catch (error) {
        console.warn(`Official metadata failed for ${game.title}: ${error.message}`);
      }
      override ??= await findWikimediaImage(game);
      if (override) {
        overridesById.set(game.id, override);
        found.push(override);
        await writeFile(overridesPath, `${JSON.stringify(Array.from(overridesById.values()), null, 2)}\n`, "utf8");
        console.log(`Found ${game.title}: ${override.imageUrl}`);
      } else {
        missed.push(game);
        console.warn(`No image metadata for ${game.title}`);
      }
    } catch (error) {
      missed.push(game);
      console.warn(`No image for ${game.title}: ${error.message}`);
    }
  }

  console.log(`Found ${found.length}, missed ${missed.length}. Overrides: ${overridesById.size}`);
  if (missed.length) {
    console.log("Still missing:");
    for (const game of missed) console.log(`- ${game.id} (${game.title})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
