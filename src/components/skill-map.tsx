import { Cpu, Crosshair, Eye, type LucideIcon } from "lucide-react";

import { type Dimension, type Game, type Scores, dimensions, dominantProfile } from "@/lib/games";

const dimensionIcons: Record<Dimension, LucideIcon> = {
  micro: Crosshair,
  meso: Eye,
  macro: Cpu,
};

export function SkillMap({ scores }: { scores: Scores; games: Game[] }) {
  return (
    <section className="map-panel" aria-label="Micro Meso Macro score breakdown">
      <div className="panel-kicker">Profile unlocked</div>
      <h2>{dominantProfile(scores)}</h2>
      <div className="result-bars" aria-label="Your Micro Meso Macro scores">
        {dimensions.map((dimension) => {
          const Icon = dimensionIcons[dimension.id];

          return (
            <div className="result-bar" key={dimension.id} style={{ borderColor: dimension.color }}>
              <div className="result-bar-label">
                <span className="result-bar-icon" style={{ background: dimension.color }}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>{dimension.label}</span>
                <strong>{scores[dimension.id]}</strong>
              </div>
              <div className="result-bar-track">
                <i style={{ inlineSize: `${scores[dimension.id]}%`, background: dimension.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
