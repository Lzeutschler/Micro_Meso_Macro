import { type Game, type Scores, dimensions, dominantProfile, gameScores } from "@/lib/games";

function pointForScores(scores: Scores) {
  const total = Math.max(1, scores.micro + scores.meso + scores.macro);
  const vertices = {
    micro: { x: 92, y: 70 },
    meso: { x: 50, y: 142 },
    macro: { x: 158, y: 70 },
  };
  return {
    x:
      (vertices.micro.x * scores.micro + vertices.meso.x * scores.meso + vertices.macro.x * scores.macro) /
      total,
    y:
      (vertices.micro.y * scores.micro + vertices.meso.y * scores.meso + vertices.macro.y * scores.macro) /
      total,
  };
}

export function SkillMap({ scores, games }: { scores: Scores; games: Game[] }) {
  const target = pointForScores(scores);

  return (
    <section className="map-panel" aria-label="Interactive Micro Meso Macro map">
      <div className="panel-kicker">Reward unlocked</div>
      <h2>{dominantProfile(scores)}</h2>
      <svg viewBox="0 0 210 170" role="img" aria-label="Your skill profile in the Micro Meso Macro Venn diagram">
        <rect width="210" height="170" fill="#f8f2e8" />
        <circle cx="92" cy="70" r="56" fill="#ff3b30" fillOpacity="0.22" stroke="#ff3b30" strokeWidth="2.5" />
        <circle cx="50" cy="142" r="56" fill="#7a5cff" fillOpacity="0.24" stroke="#7a5cff" strokeWidth="2.5" />
        <circle cx="158" cy="70" r="56" fill="#00d084" fillOpacity="0.24" stroke="#00d084" strokeWidth="2.5" />
        <text x="20" y="24" fill="#0b0d14" fontSize="11" fontWeight="900">
          MICRO
        </text>
        <text x="16" y="164" fill="#0b0d14" fontSize="11" fontWeight="900">
          MESO
        </text>
        <text x="150" y="24" fill="#0b0d14" fontSize="11" fontWeight="900">
          MACRO
        </text>
        {games.slice(0, 18).map((game) => {
          const point = pointForScores(gameScores(game));
          const color =
            game.micro >= game.meso && game.micro >= game.macro
              ? "var(--micro)"
              : game.meso >= game.macro
                ? "var(--meso)"
                : "var(--macro)";
          return (
            <circle key={game.id} cx={point.x} cy={point.y} r="2.8" fill={color}>
              <title>{game.title}</title>
            </circle>
          );
        })}
        <path d={`M ${target.x} ${target.y - 14} L ${target.x + 13} ${target.y + 11} L ${target.x - 13} ${target.y + 11} Z`} fill="#0b0d14" />
        <circle cx={target.x} cy={target.y} r="20" fill="none" stroke="#0b0d14" strokeWidth="2" />
      </svg>
      <div className="map-scores">
        {dimensions.map((dimension) => (
          <span key={dimension.id} style={{ borderColor: dimension.color }}>
            {dimension.label} <strong>{scores[dimension.id]}</strong>
          </span>
        ))}
      </div>
    </section>
  );
}
