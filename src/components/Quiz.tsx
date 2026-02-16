"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/data/courses";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentIndex];

  function handleSelect(optionIndex: number) {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  }

  function handleSubmit() {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScore =
        score + (selectedOption === question.correctIndex ? 0 : 0);
      setIsComplete(true);
      onComplete?.(finalScore, questions.length);
    }
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mb-4 text-5xl">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "📚"}
        </div>
        <h3 className="mb-2 text-2xl font-bold">Quiz terminé !</h3>
        <p className="mb-4 text-zinc-400">
          Vous avez obtenu{" "}
          <span className="font-bold text-primary-light">
            {score}/{questions.length}
          </span>{" "}
          bonnes réponses ({percentage}%)
        </p>
        <div className="mx-auto mb-6 h-3 w-64 overflow-hidden rounded-full bg-background">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 80
                ? "bg-success"
                : percentage >= 50
                  ? "bg-warning"
                  : "bg-error"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-zinc-500">
          {percentage >= 80
            ? "Excellent ! Vous maîtrisez bien ce sujet."
            : percentage >= 50
              ? "Pas mal ! Revoyez les points que vous avez manqués."
              : "Continuez à apprendre, vous progresserez !"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          Question {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-primary"
                  : i === currentIndex
                    ? "bg-primary-light"
                    : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="mb-6 text-lg font-bold text-foreground">
        {question.question}
      </h3>

      {/* Options */}
      <div className="mb-6 space-y-3">
        {question.options.map((option, i) => {
          let optionStyle = "border-border bg-background hover:border-primary/30 hover:bg-card-hover";
          if (isAnswered) {
            if (i === question.correctIndex) {
              optionStyle = "border-success bg-success/10";
            } else if (i === selectedOption) {
              optionStyle = "border-error bg-error/10";
            } else {
              optionStyle = "border-border bg-background opacity-50";
            }
          } else if (i === selectedOption) {
            optionStyle = "border-primary bg-primary/10";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                    isAnswered && i === question.correctIndex
                      ? "border-success text-success"
                      : isAnswered && i === selectedOption
                        ? "border-error text-error"
                        : i === selectedOption
                          ? "border-primary text-primary-light"
                          : "border-zinc-600 text-zinc-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-foreground">{option}</span>
                {isAnswered && i === question.correctIndex && (
                  <span className="ml-auto text-success">✓</span>
                )}
                {isAnswered &&
                  i === selectedOption &&
                  i !== question.correctIndex && (
                    <span className="ml-auto text-error">✗</span>
                  )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-in">
          <p className="text-sm font-medium text-primary-light mb-1">
            Explication
          </p>
          <p className="text-sm text-zinc-400">{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-light"
          >
            {currentIndex < questions.length - 1 ? "Question suivante" : "Voir les résultats"}
          </button>
        )}
      </div>
    </div>
  );
}
