import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, getAllLessons } from "@/data/courses";
import { LessonContent } from "@/components/LessonContent";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { courseId, lessonId } = await params;
  const result = getLesson(courseId, lessonId);
  if (!result) return { title: "Leçon introuvable" };
  return {
    title: `${result.lesson.title} | ${result.course.title} | AI Fluency Academy`,
    description: `Leçon : ${result.lesson.title}`,
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const result = getLesson(courseId, lessonId);
  if (!result) notFound();

  const { course, lesson, moduleTitle } = result;
  const allLessons = getAllLessons(courseId);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Link
          href="/courses"
          className="hover:text-foreground transition-colors"
        >
          Cours
        </Link>
        <span>/</span>
        <Link
          href={`/courses/${course.id}`}
          className="hover:text-foreground transition-colors"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </nav>

      {/* Lesson header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light">
            {moduleTitle}
          </span>
          <span className="text-xs text-zinc-600">⏱️ {lesson.duration}</span>
          <span className="text-xs text-zinc-600">
            Leçon {currentIndex + 1} / {allLessons.length}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {lesson.title}
          </span>
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{
              width: `${((currentIndex + 1) / allLessons.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Lesson content + Quiz with persistence */}
      <LessonContent lesson={lesson} course={course} />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/courses/${course.id}/lessons/${prevLesson.id}`}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm transition-all hover:border-primary/30 hover:bg-card-hover"
          >
            <span className="text-zinc-500">←</span>
            <div className="text-left">
              <div className="text-xs text-zinc-600">Précédent</div>
              <div className="font-medium text-foreground">
                {prevLesson.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/courses/${course.id}/lessons/${nextLesson.id}`}
            className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3 text-sm transition-all hover:bg-primary/10"
          >
            <div className="text-right">
              <div className="text-xs text-primary-light/60">Suivant</div>
              <div className="font-medium text-primary-light">
                {nextLesson.title}
              </div>
            </div>
            <span className="text-primary-light">→</span>
          </Link>
        ) : (
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/30 px-5 py-3 text-sm transition-all hover:bg-success/20"
          >
            <div className="text-right">
              <div className="text-xs text-success/60">Terminé</div>
              <div className="font-medium text-success">Retour au cours</div>
            </div>
            <span className="text-success">✓</span>
          </Link>
        )}
      </div>
    </div>
  );
}
