"use client";

import { Database, Filter, RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { GameCard } from "@/components/game-card";
import { ScoreSliders } from "@/components/score-sliders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Dimension, type Scores, averageScores, dimensions, games, recommendGames } from "@/lib/games";

const profileOptions = ["All", "Micro", "Meso", "Macro", "Micro + Meso", "Micro + Macro", "Meso + Macro", "Tri-Core"];

function matchesProfile(game: (typeof games)[number], profile: string) {
  const high = {
    micro: game.micro >= 62,
    meso: game.meso >= 62,
    macro: game.macro >= 62,
  };
  if (profile === "All") return true;
  if (profile === "Tri-Core") return high.micro && high.meso && high.macro;
  if (profile.includes("+")) {
    return (profile.toLowerCase().split(" + ") as Dimension[]).every((dimension) => high[dimension]);
  }
  return high[profile.toLowerCase() as Dimension];
}

export function DatabaseBrowser() {
  const defaultLikedGame = games.find((game) => game.id === "rocket-league") ?? games[0];
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState("All");
  const [minimums, setMinimums] = useState<Scores>({ micro: 0, meso: 0, macro: 0 });
  const [targetScores, setTargetScores] = useState<Scores>(averageScores(defaultLikedGame ? [defaultLikedGame] : []));
  const [likedId, setLikedId] = useState("rocket-league");

  const likedGame = games.find((game) => game.id === likedId) ?? games[0];
  const similar = useMemo(() => recommendGames(targetScores, games, likedGame ? [likedGame.id] : []).slice(0, 6), [targetScores, likedGame]);

  const tags = useMemo(() => Array.from(new Set(games.flatMap((game) => game.tags))).sort((a, b) => a.localeCompare(b)).slice(0, 28), []);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filteredGames = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return games.filter((game) => {
      const textMatch =
        !lower ||
        game.title.toLowerCase().includes(lower) ||
        game.type.toLowerCase().includes(lower) ||
        game.tags.some((tag) => tag.toLowerCase().includes(lower));
      const scoreMatch = dimensions.every((dimension) => game[dimension.id] >= minimums[dimension.id]);
      const tagMatch = activeTags.length === 0 || activeTags.every((tag) => game.tags.includes(tag));
      return textMatch && scoreMatch && tagMatch && matchesProfile(game, profile);
    });
  }, [activeTags, minimums, profile, query]);

  const updateTarget = (dimension: Dimension, value: number) => {
    setTargetScores((current) => ({ ...current, [dimension]: value }));
  };

  const updateMinimum = (dimension: Dimension, value: number) => {
    setMinimums((current) => ({ ...current, [dimension]: value }));
  };

  return (
    <section className="database-page">
      <div className="database-hero">
        <div>
          <div className="panel-kicker">Database</div>
          <h1>Search by skill feel, then let genre catch up.</h1>
          <p>
            Pick a game you already like. Or tune the sliders by hand. Recommendations move
            toward the same pressure pattern in Micro/Meso/Macro space.
          </p>
        </div>
        <Database className="hero-glyph" />
      </div>

      <div className="database-layout">
        <aside className="finder-console">
          <div className="console-header">
            <Sparkles className="size-5" />
            <h2>Find nearby games</h2>
          </div>
          <label htmlFor="liked-game">A game you like</label>
          <Select
            value={likedId}
            onValueChange={(id) => {
              setLikedId(id);
              const selected = games.find((game) => game.id === id);
              setTargetScores(averageScores(selected ? [selected] : []));
            }}
          >
            <SelectTrigger id="liked-game" aria-label="Choose a favorite game">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {likedGame ? <GameCard game={likedGame} compact /> : null}

          <ScoreSliders scores={targetScores} onChange={updateTarget} prefix="target" />

          <div className="similar-strip">
            {similar.map(({ game, distance }) => (
              <GameCard key={game.id} game={game} compact distance={distance} />
            ))}
          </div>
        </aside>

        <div className="database-results">
          <div className="filter-console">
            <div className="filter-row">
              <div className="search-field">
                <Search className="size-4" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  name="game-search"
                  autoComplete="off"
                  placeholder="Game, tag, or type..."
                  aria-label="Search the database"
                />
              </div>
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger aria-label="Profile filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profileOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setProfile("All");
                  setMinimums({ micro: 0, meso: 0, macro: 0 });
                  setActiveTags([]);
                }}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>

            <div className="minimum-grid">
              {dimensions.map((dimension) => (
                <div key={dimension.id}>
                  <label htmlFor={`min-${dimension.id}`}>
                    Min {dimension.label}
                    <strong style={{ color: dimension.color }}>{minimums[dimension.id]}</strong>
                  </label>
                  <input
                    id={`min-${dimension.id}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={minimums[dimension.id]}
                    onChange={(event) => updateMinimum(dimension.id, Number(event.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className="tag-filter" aria-label="Tag filter">
              <Filter className="size-4" />
              {tags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    className={active ? "active" : ""}
                    onClick={() =>
                      setActiveTags((current) =>
                        active ? current.filter((entry) => entry !== tag) : [...current, tag],
                      )
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="result-count">{filteredGames.length} games</div>
          <div className="card-grid">
            {filteredGames.length ? (
              filteredGames.map((game) => <GameCard key={game.id} game={game} />)
            ) : (
              <div className="empty-state">
                <h2>No match</h2>
                <p>Lower the minimums or clear a tag. The list will come back.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
