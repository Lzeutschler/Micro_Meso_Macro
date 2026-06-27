import Link from "next/link";
import { ArrowRight, Cpu, Crosshair, Database, Eye, Play, Trophy, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { SiteShell } from "@/components/site-shell";
import { games } from "@/lib/games";

const featured = ["counter-strike-2", "rocket-league", "hearthstone", "factorio"]
  .map((id) => games.find((game) => game.id === id))
  .filter(Boolean);

const cheatExamples = [
  { label: "Pure", games: ["Osu!", "Factorio", "Among Us", "Tic-Tac-Toe"] },
  { label: "Micro + Macro", games: ["Jump King", "Getting Over It", "Elden Ring", "8 Ball Pool"] },
  { label: "Micro + Meso", games: ["Tekken 8", "Street Fighter 6", "Brawlhalla", "Fall Guys"] },
  { label: "Meso + Macro", games: ["Hearthstone", "TFT", "Balatro", "Phasmophobia"] },
  { label: "Tri-Core", games: ["League of Legends", "CS2", "Valorant", "Rocket League"] },
];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero-grid">
        <div className="hero-copy">
          <Badge>Skill profiler v2</Badge>
          <h1>Gaming skill is stranger than genre.</h1>
          <p>
            Micro / Meso / Macro looks at what a game actually asks from you. Fast hands.
            Sharp reads. A feel for systems. The idea comes from the original video; here,
            it turns into something you can play with.
          </p>
          <div className="cta-row">
            <Button asChild size="lg">
              <Link href="/test">
                <Play className="size-4" />
                Start the test
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/database">
                <Database className="size-4" />
                Open database
              </Link>
            </Button>
          </div>
        </div>

        <aside className="video-cabinet" aria-label="YouTube video about the model">
          <div className="cabinet-top">
            <Video className="size-5" />
            <span>Original signal</span>
          </div>
          <iframe
            src="https://www.youtube-nocookie.com/embed/NgHvdCcmQ4o"
            title="YouTube video about the Micro Meso Macro model"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </aside>
      </section>

      <section className="front-band">
        <div className="section-title">
          <Crosshair className="size-6" />
          <h2>The Cheat Test</h2>
        </div>
        <div className="cheat-router">
          <div className="cheat-question">
            <span>Thought experiment</span>
            <h3>Which cheat would make the whole game collapse?</h3>
            <p>
              The answer gives the skill pressure away. Maybe the game lives in your
              fingers. Maybe in hidden information. Maybe in the plan forming five turns
              before anyone notices.
            </p>
          </div>

          <div className="cheat-lanes" aria-label="Cheat lanes for Micro Meso Macro">
            <article className="cheat-lane micro">
              <Crosshair className="size-7" />
              <span>Micro</span>
              <h3>Aimbot</h3>
              <p>Clean inputs. Brutal timing. The tiny execution windows that decide a run.</p>
            </article>
            <article className="cheat-lane meso">
              <Eye className="size-7" />
              <span>Meso</span>
              <h3>Stream-Snipe</h3>
              <p>Private information, cooldown memory, the small lie inside a movement.</p>
            </article>
            <article className="cheat-lane macro">
              <Cpu className="size-7" />
              <span>Macro</span>
              <h3>Engine-Coach</h3>
              <p>Resources bend. Routes tighten. The win condition arrives early.</p>
            </article>
          </div>

          <div className="cheat-example-board">
            {cheatExamples.map((group) => (
              <div className="cheat-example-row" key={group.label}>
                <strong>{group.label}</strong>
                <div>
                  {group.games.map((game) => (
                    <span key={game}>{game}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="front-band alt">
        <div className="section-title">
          <Trophy className="size-6" />
          <h2>Where to go next</h2>
        </div>
        <div className="flow-cards">
          <Link href="/test" className="flow-card">
            <span>01</span>
            <h3>Take the test</h3>
            <p>Answer one question at a time, then see where your taste lands on the map.</p>
            <ArrowRight className="size-5" />
          </Link>
          <Link href="/database" className="flow-card yellow">
            <span>02</span>
            <h3>Find games</h3>
            <p>Start from a favorite game, or drag the sliders until the profile feels right.</p>
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      <section className="front-band">
        <div className="section-title">
          <Database className="size-6" />
          <h2>More games, better links</h2>
        </div>
        <div className="featured-grid">
          {featured.map((game) => (game ? <GameCard key={game.id} game={game} compact /> : null))}
        </div>
      </section>
    </SiteShell>
  );
}
