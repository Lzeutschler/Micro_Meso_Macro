import { type Scores, normalizeScores } from "@/lib/games";

export const quizQuestions: Array<{
  prompt: string;
  axis: string;
  reward: string;
  weights: Scores;
}> = [
  {
    prompt: "I enjoy games where precise inputs, timing, or aim decide the outcome.",
    axis: "Execution",
    reward: "Micro rises. You value execution and control.",
    weights: { micro: 1, meso: 0.05, macro: 0.05 },
  },
  {
    prompt: "I enjoy predicting what another player will do next.",
    axis: "Mindgame",
    reward: "Meso rises. You value reads, bluffing, and hidden information.",
    weights: { micro: 0.1, meso: 1, macro: 0.1 },
  },
  {
    prompt: "I enjoy games where an early plan can decide the match later.",
    axis: "Planning",
    reward: "Macro rises. You value planning and long-term choices.",
    weights: { micro: 0.05, meso: 0.15, macro: 1 },
  },
  {
    prompt: "I enjoy managing odds, risk, and uncertain outcomes.",
    axis: "Variance",
    reward: "Meso and Macro rise. You value probability and structured risk.",
    weights: { micro: 0, meso: 0.75, macro: 0.45 },
  },
  {
    prompt: "I enjoy practicing the same mechanic until it becomes reliable.",
    axis: "Training",
    reward: "Micro rises. You value practice and consistency.",
    weights: { micro: 1, meso: 0, macro: 0.25 },
  },
  {
    prompt: "I enjoy preparing builds, routes, loadouts, or economy before the action starts.",
    axis: "Prep",
    reward: "Macro rises. You value preparation and optimization.",
    weights: { micro: 0.1, meso: 0.25, macro: 0.9 },
  },
  {
    prompt: "I enjoy using small clues like sound, cooldowns, position, or behavior.",
    axis: "Info",
    reward: "Meso rises. You value information gathering and reads.",
    weights: { micro: 0.2, meso: 0.85, macro: 0.55 },
  },
  {
    prompt: "I enjoy tense moments that require fast inputs and quick decisions.",
    axis: "Clutch",
    reward: "Micro and Meso rise. You value execution under pressure.",
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
