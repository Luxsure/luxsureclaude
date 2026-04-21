"use client";

import { useProgressStore } from "@/stores/progress";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";

export function StatsCards() {
  const { xp, streak, getCompletedLessonsCount, earnedBadges } = useProgressStore();
  const { getQuizzesPassedCount } = useLessonCompletion();

  const stats = [
    {
      label: "Jours consécutifs",
      value: `${streak} 🔥`,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Leçons terminées",
      value: getCompletedLessonsCount().toString(),
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Quiz réussis",
      value: getQuizzesPassedCount().toString(),
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Points XP",
      value: xp.toString(),
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div
            className={`mb-1 text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
          >
            {stat.value}
          </div>
          <div className="text-xs text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
