"use client";

import { useEffect } from "react";
import type { Lesson, Course } from "@/data/courses";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Quiz from "@/components/Quiz";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";
import { useProgressStore } from "@/stores/progress";

interface LessonContentProps {
  lesson: Lesson;
  course: Course;
}

export function LessonContent({ lesson, course }: LessonContentProps) {
  const { handleLessonComplete, handleQuizComplete } = useLessonCompletion();
  const { isLessonCompleted } = useProgressStore();
  const completed = isLessonCompleted(lesson.id);

  useEffect(() => {
    if (!completed) {
      handleLessonComplete(lesson.id);
    }
  }, [lesson.id, completed, handleLessonComplete]);

  return (
    <>
      <article className="mb-12 rounded-2xl border border-border bg-card p-6 md:p-10">
        {completed && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-4 py-2">
            <span className="text-success">✓</span>
            <span className="text-sm text-success">Leçon terminée — +50 XP</span>
          </div>
        )}
        <MarkdownRenderer content={lesson.content} />
      </article>

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            🧪 Testez vos connaissances
          </h2>
          <Quiz
            questions={lesson.quiz}
            lessonId={lesson.id}
            onComplete={(score, total) =>
              handleQuizComplete(lesson.id, score, total)
            }
          />
        </section>
      )}
    </>
  );
}
