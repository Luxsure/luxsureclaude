"use client";

import Link from "next/link";
import { courses } from "@/data/courses";
import { useProgressStore } from "@/stores/progress";

export function CourseProgressList() {
  const { lessonProgress } = useProgressStore();

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-bold">Ma progression</h2>

      <div className="space-y-4">
        {courses.map((course) => {
          const allLessons = course.modules.flatMap((m) => m.lessons);
          const totalLessons = allLessons.length;
          const completedCount = allLessons.filter(
            (l) => lessonProgress[l.id]?.completed
          ).length;
          const progressPercent =
            totalLessons > 0
              ? Math.round((completedCount / totalLessons) * 100)
              : 0;
          const started = completedCount > 0;

          return (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-card-hover"
            >
              <span className="text-3xl">{course.icon}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground group-hover:text-primary-light transition-colors truncate">
                    {course.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      course.level === "Débutant"
                        ? "bg-green-500/10 text-green-400"
                        : course.level === "Intermédiaire"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressPercent === 100
                          ? "bg-success"
                          : "bg-gradient-to-r from-primary to-accent"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {completedCount}/{totalLessons} ({progressPercent}%)
                  </span>
                </div>
              </div>

              <span className="text-sm font-medium text-primary-light opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {started ? "Continuer →" : "Commencer →"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
