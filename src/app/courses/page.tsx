import Link from "next/link";
import { courses } from "@/data/courses";

export const metadata = {
  title: "Cours | AI Fluency Academy",
  description: "Explorez tous nos cours d'IA interactifs",
};

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-extrabold">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Catalogue des cours
          </span>
        </h1>
        <p className="text-lg text-zinc-400">
          Explorez nos parcours de formation et choisissez celui qui correspond à
          vos objectifs.
        </p>
      </div>

      {/* Level filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {["Tous", "Débutant", "Intermédiaire", "Avancé"].map((level) => (
          <span
            key={level}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
              level === "Tous"
                ? "bg-primary text-white"
                : "border border-border bg-card text-zinc-400 hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {level}
          </span>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course, index) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:bg-card-hover animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient top bar */}
            <div
              className={`h-2 bg-gradient-to-r ${course.color}`}
            />

            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl">{course.icon}</span>
                <div className="flex items-center gap-2">
                  {course.levelNumber != null && (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      Niveau {course.levelNumber}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
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
              </div>

              <h2 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary-light transition-colors">
                {course.title}
              </h2>
              <p className="mb-4 text-sm text-zinc-500 leading-relaxed">
                {course.longDescription}
              </p>

              <div className="mb-4 flex items-center gap-6 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  ⏱️ {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  📚 {course.lessonsCount} leçons
                </span>
                <span className="flex items-center gap-1.5">
                  📦 {course.modules.length} modules
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-background px-2.5 py-1 text-xs text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-primary-light group-hover:text-accent transition-colors">
                  Commencer le cours →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
