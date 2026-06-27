import { type Scores, normalizeScores } from "@/lib/games";

export const quizQuestions: Array<{
  prompt: string;
  axis: string;
  reward: string;
  weights: Scores;
}> = [
  {
    prompt: "When a game pushes back, cleaner inputs are where I want to answer.",
    axis: "Execution",
    reward: "Micro rises. Control belongs in the fingers.",
    weights: { micro: 1, meso: 0.05, macro: 0.05 },
  },
  {
    prompt: "Reading opponents feels great, especially when I can feed them the wrong signal.",
    axis: "Mindgame",
    reward: "Meso rises. The person behind the play matters.",
    weights: { micro: 0.1, meso: 1, macro: 0.1 },
  },
  {
    prompt: "Thinking ten minutes ahead feels natural, even when the fight starts in ten seconds.",
    axis: "Planning",
    reward: "Macro rises. A better plan is part of the fun.",
    weights: { micro: 0.05, meso: 0.15, macro: 1 },
  },
  {
    prompt: "Randomness is welcome when I can read the odds better than the table.",
    axis: "Variance",
    reward: "Meso and Macro rise. Risk feels better with structure underneath it.",
    weights: { micro: 0, meso: 0.75, macro: 0.45 },
  },
  {
    prompt: "I can drill the same motion a hundred times, just to make it stay.",
    axis: "Training",
    reward: "Micro rises. Repetition does not scare you off.",
    weights: { micro: 1, meso: 0, macro: 0.25 },
  },
  {
    prompt: "Preparation should steal half the fight before it begins.",
    axis: "Prep",
    reward: "Macro rises. Loadouts, routes, economy: they carry weight.",
    weights: { micro: 0.1, meso: 0.25, macro: 0.9 },
  },
  {
    prompt: "Sound cues, cooldowns, position tells, tiny scraps of info. That is the good stuff.",
    axis: "Info",
    reward: "Meso rises. Hidden data wants to be read.",
    weights: { micro: 0.2, meso: 0.85, macro: 0.55 },
  },
  {
    prompt: "I want clutch moments where mechanics fire first and instinct catches up.",
    axis: "Clutch",
    reward: "Micro and Meso rise. Pressure at the edge suits you.",
    weights: { micro: 0.75, meso: 0.75, macro: 0.15 },
  },
];

export const answerLabels = ["Never", "Rarely", "Neutral", "Often", "Always"];

export function scoreFromAnswers(answers: number[]): Scores {
  const max = quizQuestions.reduce(
    (acc, question) => ({
      micro: acc.micro + question.weights.micro * 4,
      meso: acc.meso + question.weights.meso * 4,
      macro: acc.macro + question.weights.macro * 4,
    }),
    { micro: 0, meso: 0, macro: 0 },
  );

  const raw = quizQuestions.reduce(
    (acc, question, index) => ({
      micro: acc.micro + question.weights.micro * (answers[index] ?? 0),
      meso: acc.meso + question.weights.meso * (answers[index] ?? 0),
      macro: acc.macro + question.weights.macro * (answers[index] ?? 0),
    }),
    { micro: 0, meso: 0, macro: 0 },
  );

  return normalizeScores({
    micro: (raw.micro / max.micro) * 100,
    meso: (raw.meso / max.meso) * 100,
    macro: (raw.macro / max.macro) * 100,
  });
}
