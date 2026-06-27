import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "src", "lib", "imported-games.json");
const now = new Date().toISOString();
const limit = Number.parseInt(getArg("limit") ?? "100", 10);

const chartUrl = "https://steamcharts.com/top";
const chartPageUrl = (page) => (page <= 1 ? chartUrl : `${chartUrl}/p.${page}`);

function getArg(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function htmlToText(value = "") {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function slugify(value) {
  return value
    .replace(/[™®©]/g, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function numberFromCell(value = "") {
  return Number.parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "MicroMesoMacro/0.1 data importer",
    },
  });
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "MicroMesoMacro/0.1 data importer",
    },
  });
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  return response.json();
}

function parseChart(html) {
  const rows = html.match(/<tr[\s\S]*?<\/tr>/g) ?? [];
  return rows
    .map((row) => {
      const appMatch = row.match(/<a href="\/app\/(\d+)">\s*([\s\S]*?)\s*<\/a>/);
      if (!appMatch) return null;
      const rankMatch = row.match(/<td>(\d+)\.<\/td>/);
      const cells = Array.from(row.matchAll(/<td class="num(?: [^"]*)?">([\s\S]*?)<\/td>/g)).map((match) =>
        numberFromCell(match[1]),
      );
      return {
        rank: rankMatch ? Number.parseInt(rankMatch[1], 10) : 0,
        appId: Number.parseInt(appMatch[1], 10),
        title: decodeHtml(appMatch[2].replace(/\s+/g, " ").trim()),
        currentPlayers: cells[0] ?? 0,
        peakPlayers: cells[1] ?? 0,
        playerHours: cells[2] ?? 0,
      };
    })
    .filter(Boolean)
    .filter((entry) => entry.rank > 0);
}

function platformList(platforms = {}) {
  const result = [];
  if (platforms.windows) result.push("PC");
  if (platforms.mac) result.push("Mac");
  if (platforms.linux) result.push("Linux");
  return result.length ? result : ["PC"];
}

function deriveScores({ genres, categories, description }) {
  const text = [...genres, ...categories, description].join(" ").toLowerCase();
  let micro = 35;
  let meso = 28;
  let macro = 36;

  const has = (...words) => words.some((word) => text.includes(word));

  if (has("action", "shooter", "fps", "fighting", "platformer", "racing", "sports", "rhythm", "hack and slash")) {
    micro += 34;
  }
  if (has("precision", "fast-paced", "combat", "aim", "bullet", "parkour")) micro += 18;
  if (has("multiplayer", "pvp", "online pvp", "co-op", "competitive", "battle royale", "moba")) meso += 34;
  if (has("hidden", "deduction", "social", "bluff", "survival", "extraction")) meso += 18;
  if (has("strategy", "simulation", "rpg", "role-playing", "card", "deck", "turn-based", "4x", "city", "colony")) {
    macro += 34;
  }
  if (has("building", "crafting", "economy", "management", "automation", "base", "sandbox", "resource")) macro += 18;
  if (has("single-player") && !has("multiplayer", "pvp")) meso -= 12;
  if (has("casual", "idler", "clicker")) {
    micro -= 10;
    meso -= 8;
  }

  return {
    micro: clamp(micro),
    meso: clamp(meso),
    macro: clamp(macro),
  };
}

function buildWhy(scores, sourceName) {
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const lead = ordered[0][0];
  const labels = {
    micro: "execution pressure",
    meso: "reads, opponents, or uncertainty",
    macro: "systems, builds, or long-form planning",
  };
  return `Imported from ${sourceName}; first-pass scoring leans on Steam genres/categories, with ${labels[lead]} currently weighted highest. Needs human MMM review.`;
}

async function toGameSeed(chartEntry) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${chartEntry.appId}&cc=us&l=english`;
  const payload = await fetchJson(url);
  const entry = payload[String(chartEntry.appId)];
  if (!entry?.success || entry.data?.type !== "game") return null;

  const data = entry.data;
  const genres = (data.genres ?? []).map((genre) => genre.description);
  const categories = (data.categories ?? []).map((category) => category.description);
  const tags = uniq([...genres, ...categories]).slice(0, 8);
  const description = htmlToText(data.short_description || data.about_the_game || data.detailed_description);
  const scores = deriveScores({ genres, categories, description });
  const type = genres[0] ?? "Game";

  return {
    id: slugify(data.name || chartEntry.title),
    title: data.name || chartEntry.title,
    type,
    platforms: platformList(data.platforms),
    tags,
    storeUrl: `https://store.steampowered.com/app/${chartEntry.appId}`,
    officialUrl: data.website || undefined,
    imageUrl: data.header_image,
    imageSource: "steam",
    description,
    ...scores,
    why: buildWhy(scores, "SteamCharts Top Games"),
    source: {
      name: "SteamCharts Top Games",
      url: chartUrl,
      importedAt: now,
      rank: chartEntry.rank,
      steamAppId: chartEntry.appId,
      currentPlayers: chartEntry.currentPlayers,
      peakPlayers: chartEntry.peakPlayers,
      playerHours: chartEntry.playerHours,
      reviewStatus: "needs-score-review",
    },
  };
}

async function main() {
  const pageCount = Math.max(1, Math.ceil(limit / 25));
  const chart = [];

  for (let page = 1; page <= pageCount; page += 1) {
    const pageHtml = await fetchText(chartPageUrl(page));
    chart.push(...parseChart(pageHtml));
  }

  const chartEntries = Array.from(new Map(chart.map((entry) => [entry.appId, entry])).values()).slice(0, limit);
  const games = [];

  for (const entry of chartEntries) {
    try {
      const game = await toGameSeed(entry);
      if (game) games.push(game);
    } catch (error) {
      console.warn(`Skipping ${entry.title} (${entry.appId}): ${error.message}`);
    }
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(games, null, 2)}\n`, "utf8");
  console.log(`Imported ${games.length} games from ${chartUrl} -> ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
