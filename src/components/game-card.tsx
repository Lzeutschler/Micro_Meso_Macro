"use client";
/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { type Game, dimensions, gameImage } from "@/lib/games";

const categoryLabels: Record<Game["category"], string> = {
  pure: "Pure",
  "micro-macro": "Micro + Macro",
  "micro-meso": "Micro + Meso",
  "meso-macro": "Meso + Macro",
  "tri-core": "Tri-Core",
};

export function GameCard({
  game,
  compact = false,
  distance,
}: {
  game: Game;
  compact?: boolean;
  distance?: number;
}) {
  const imageSrc = gameImage(game);
  const [failedImageSrc, setFailedImageSrc] = useState<string>();
  const gameUrl = game.storeUrl ?? game.officialUrl;
  const gameUrlLabel = game.storeUrl ? "Store" : "Official";
  const showImage = Boolean(imageSrc && failedImageSrc !== imageSrc);

  return (
    <article className="game-card">
      <div className={`game-art ${showImage ? "" : "title-fallback"}`}>
        {showImage ? (
          <img
            src={imageSrc}
            alt={`${game.title} key art`}
            width="616"
            height="353"
            loading="lazy"
            onError={() => setFailedImageSrc(imageSrc)}
          />
        ) : (
          <div className={`game-title-art ${game.category}`}>
            <span>{categoryLabels[game.category]}</span>
            <strong>{game.title}</strong>
          </div>
        )}
        <div className="game-type">{game.type}</div>
      </div>
      <div className="game-card-body">
        <div className="game-title-row">
          <h3>{game.title}</h3>
          <div className="game-actions">
            {typeof distance === "number" ? <Badge>{Math.max(0, Math.round(100 - distance))}%</Badge> : null}
            {gameUrl ? (
              <a className="game-link" href={gameUrl} target="_blank" rel="noreferrer">
                {gameUrlLabel}
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </div>
        </div>
        <div className="score-bars" aria-label={`Scores for ${game.title}`}>
          {dimensions.map((dimension) => (
            <div key={dimension.id} className="mini-score">
              <span>{dimension.label}</span>
              <strong>{game[dimension.id]}</strong>
              <i style={{ inlineSize: `${game[dimension.id]}%`, background: dimension.color }} />
            </div>
          ))}
        </div>
        {!compact ? (
          <p>
            {game.why} <strong>{game.cheat}</strong>
          </p>
        ) : null}
        <div className="tag-row">
          {game.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
