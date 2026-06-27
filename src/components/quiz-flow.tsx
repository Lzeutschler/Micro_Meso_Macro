"use client";

import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { SkillMap } from "@/components/skill-map";
import { answerLabels, quizQuestions, scoreFromAnswers } from "@/lib/quiz";
import { recommendGames } from "@/lib/games";

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(quizQuestions.length).fill(2));
  const finished = step >= quizQuestions.length;
  const scores = useMemo(() => scoreFromAnswers(answers), [answers]);
  const recommendations = useMemo(() => recommendGames(scores).slice(0, 6), [scores]);
  const question = quizQuestions[Math.min(step, quizQuestions.length - 1)];
  const progress = Math.round((Math.min(step, quizQuestions.length) / quizQuestions.length) * 100);

  const answer = (value: number) => {
    setAnswers((current) => current.map((entry, index) => (index === step ? value : entry)));
  };

  const reset = () => {
    setStep(0);
    setAnswers(Array(quizQuestions.length).fill(2));
  };

  if (finished) {
    return (
      <section className="quiz-result">
        <div className="quiz-copy">
          <div className="panel-kicker">Profile unlocked</div>
          <h1>Your skill profile just lit up.</h1>
          <p>
            The marker drops into Micro/Meso/Macro space. Around it, games with a similar
            kind of pressure start to cluster.
          </p>
          <Button type="button" variant="secondary" onClick={reset}>
            <RotateCcw className="size-4" />
            Restart test
          </Button>
        </div>
        <SkillMap scores={scores} games={recommendations.map((item) => item.game)} />
        <div className="result-recs">
          {recommendations.map(({ game, distance }) => (
            <GameCard key={game.id} game={game} distance={distance} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-stage">
      <div className="quiz-hud">
        <span>
          Question {step + 1}/{quizQuestions.length}
        </span>
        <strong>{progress}%</strong>
        <i style={{ inlineSize: `${progress}%` }} />
      </div>

      <article className="question-card">
        <div className="panel-kicker">{question.axis}</div>
        <h1>{question.prompt}</h1>
        <p>{question.reward}</p>

        <div className="answer-grid" role="radiogroup" aria-label={question.prompt}>
          {answerLabels.map((label, value) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={answers[step] === value}
              onClick={() => answer(value)}
              className={answers[step] === value ? "selected" : ""}
            >
              <span>{value + 1}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="quiz-controls">
          <Button type="button" variant="outline" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button type="button" onClick={() => setStep((current) => current + 1)}>
            {step === quizQuestions.length - 1 ? (
              <>
                <Sparkles className="size-4" />
                Show result
              </>
            ) : (
              <>
                Next
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </article>

      <aside className="quiz-preview" aria-label="Live preview">
        <h2>Live Score</h2>
        {(["micro", "meso", "macro"] as const).map((dimension) => (
          <div className="preview-bar" key={dimension}>
            <span>{dimension.toUpperCase()}</span>
            <strong>{scores[dimension]}</strong>
            <i style={{ inlineSize: `${scores[dimension]}%` }} />
          </div>
        ))}
      </aside>
    </section>
  );
}
