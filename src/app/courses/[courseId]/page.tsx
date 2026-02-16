import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/data/courses";

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) return { title: "Cours introuvable" };
  return {
    title: `${course.title} | AI Fluency Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );
  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/courses" className="hover:text-foreground transition-colors">
          Cours
        </Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-12 rounded-2xl border border-border bg-card p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-5xl">{course.icon}</span>
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

            <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
              {course.title}
            </h1>
            <p className="mb-6 text-lg text-zinc-400 leading-relaxed">
              {course.longDescription}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-background px-3 py-1 text-sm text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <span>⏱️ {course.duration}</span>
              <span>📚 {totalLessons} leçons</span>
              <span>📦 {course.modules.length} modules</span>
            </div>
          </div>

          {firstLesson && (
            <div className="shrink-0">
              <Link
                href={`/courses/${course.id}/lessons/${firstLesson.id}`}
                className="inline-block rounded-xl bg-primary px-8 py-3.5 font-semibold text-white transition-all hover:bg-primary-light hover:shadow-xl hover:shadow-primary/25"
              >
                Commencer le cours
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modules & Lessons */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Programme du cours</h2>

        <div className="space-y-6">
          {course.modules.map((mod, modIndex) => (
            <div
              key={mod.id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="bg-card-hover p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary-light">
                    {modIndex + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground">{mod.title}</h3>
                    <p className="text-xs text-zinc-500">
                      {mod.lessons.length} leçon
                      {mod.lessons.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {mod.lessons.map((lesson, lessonIndex) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-card-hover group"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs text-zinc-500 group-hover:border-primary/50 group-hover:text-primary-light transition-colors">
                      {lessonIndex + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary-light transition-colors truncate">
                        {lesson.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.quiz && (
                        <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">
                          Quiz
                        </span>
                      )}
                      <span className="text-xs text-zinc-600">
                        {lesson.duration}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
