"use client";

import { useProgressStore } from "@/stores/progress";
import { BADGE_DEFINITIONS, type BadgeId } from "@/constants/badges";

export function BadgeShelf() {
  const { earnedBadges } = useProgressStore();

  const allBadges = Object.entries(BADGE_DEFINITIONS) as [
    BadgeId,
    (typeof BADGE_DEFINITIONS)[BadgeId],
  ][];

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-bold">Badges</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {allBadges.map(([id, badge]) => {
          const earned = earnedBadges.includes(id);
          return (
            <div
              key={id}
              className={`rounded-2xl border p-4 text-center transition-all ${
                earned
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card opacity-40"
              }`}
            >
              <div className="mb-2 text-3xl">{badge.icon}</div>
              <p className="text-xs font-medium text-foreground">
                {badge.title}
              </p>
              <p className="mt-1 text-[10px] text-zinc-500">
                {badge.description}
              </p>
              {earned && (
                <span className="mt-2 inline-block rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">
                  Obtenu ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
