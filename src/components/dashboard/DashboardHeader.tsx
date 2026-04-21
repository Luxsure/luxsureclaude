"use client";

import { useProgressStore } from "@/stores/progress";

export function DashboardHeader() {
  const { xp, level, streak } = useProgressStore();
  const xpForNextLevel = (level) * 300;
  const xpInCurrentLevel = xp - (level - 1) * 300;
  const xpPercentage = Math.min((xpInCurrentLevel / 300) * 100, 100);

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-extrabold">
        Bonjour,{" "}
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Apprenant
        </span>{" "}
        👋
      </h1>
      <p className="text-zinc-400 mb-6">
        Suivez votre progression et continuez votre apprentissage.
      </p>

      {/* Level progress */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">
              Niveau {level}
            </span>
            <span className="ml-2 text-xs text-zinc-500">
              — {xpInCurrentLevel} / 300 XP
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>🔥 {streak} jour{streak > 1 ? "s" : ""}</span>
            <span>⭐ {xp} XP total</span>
          </div>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
