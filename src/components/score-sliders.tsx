"use client";

import { Slider } from "@/components/ui/slider";
import { type Dimension, type Scores, dimensions } from "@/lib/games";

export function ScoreSliders({
  scores,
  onChange,
  prefix = "score",
}: {
  scores: Scores;
  onChange: (dimension: Dimension, value: number) => void;
  prefix?: string;
}) {
  return (
    <div className="slider-panel">
      {dimensions.map((dimension) => (
        <div className="slider-line" key={dimension.id}>
          <label htmlFor={`${prefix}-${dimension.id}`}>
            {dimension.label}
            <strong style={{ color: dimension.color }}>{scores[dimension.id]}</strong>
          </label>
          <Slider
            id={`${prefix}-${dimension.id}`}
            min={0}
            max={100}
            step={1}
            value={[scores[dimension.id]]}
            onValueChange={([value]) => onChange(dimension.id, value)}
            aria-label={`${dimension.label} Score`}
          />
        </div>
      ))}
    </div>
  );
}
