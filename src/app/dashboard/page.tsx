"use client";

import Link from "next/link";
import { courses } from "@/data/courses";

// Simulated user progress data (in a real app, this would come from a database)
const userProgress = {
  name: "Apprenant",
  streak: 3,
  totalLessonsCompleted: 4,
  totalQuizzesPassed: 2,
  xp: 450,
  level: 2,
  courseProgress: [
    {
      courseId: "fundamentals-of-ai",
      lessonsCompleted: ["what-is-ai", "history-of-ai", "ml-basics"],
      quizScores: { "what-is-ai": 100, "ml-basics": 75 },
    },
    {
      courseId: "ai-for-business",
      lessonsCompleted: ["ai-use-cases"],
      quizScores: {},
    },
  ],
};

export default function DashboardPage() {
  const xpForNextLevel = 600;
  const xpPercentage = (userProgress.xp / xpForNextLevel) * 100;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold">
          Bonjour,{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {userProgress.name}
          </span>{" "}
          👋
        </h1>
        <p className="text-zinc-400">
          Suivez votre progression et continuez votre apprentissage.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Jours consécutifs",
            value: `${userProgress.streak} 🔥`,
            color: "from-orange-500 to-red-500",
          },
          {
            label: "Leçons terminées",
            value: userProgress.totalLessonsCompleted.toString(),
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Quiz réussis",
            value: userProgress.totalQuizzesPassed.toString(),
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Points XP",
            value: userProgress.xp.toString(),
            color: "from-purple-500 to-pink-500",
          },
        ].map((stat) => (
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

      {/* Level progress */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">
              Niveau {userProgress.level}
            </span>
            <span className="ml-2 text-xs text-zinc-500">
              — {userProgress.xp} / {xpForNextLevel} XP
            </span>
          </div>
          <span className="text-sm text-zinc-500">
            Niveau {userProgress.level + 1}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Course progress */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Ma progression</h2>

        <div className="space-y-4">
          {courses.map((course) => {
            const progress = userProgress.courseProgress.find(
              (p) => p.courseId === course.id
            );
            const totalLessons = course.modules.reduce(
              (sum, m) => sum + m.lessons.length,
              0
            );
            const completedCount = progress?.lessonsCompleted.length ?? 0;
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
                      {completedCount}/{totalLessons} leçons ({progressPercent}%)
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

      {/* Recent activity */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Activité récente</h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {[
            {
              action: "Leçon terminée",
              detail: "Les bases du Machine Learning",
              time: "Aujourd'hui",
              icon: "📖",
            },
            {
              action: "Quiz réussi",
              detail: "Qu'est-ce que l'IA ? — 100%",
              time: "Hier",
              icon: "🧪",
            },
            {
              action: "Cours commencé",
              detail: "L'IA pour le Business",
              time: "Il y a 2 jours",
              icon: "🚀",
            },
            {
              action: "Leçon terminée",
              detail: "Brève histoire de l'IA",
              time: "Il y a 3 jours",
              icon: "📖",
            },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.action}
                </p>
                <p className="text-xs text-zinc-500">{activity.detail}</p>
              </div>
              <span className="text-xs text-zinc-600">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
