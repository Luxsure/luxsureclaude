"use client";

import { useCallback } from "react";
import { useProgressStore } from "@/stores/progress";
import { BADGE_DEFINITIONS, checkBadgeEligibility, type BadgeId } from "@/constants/badges";
import { courses } from "@/data/courses";

export function useLessonCompletion() {
  const {
    completeLesson,
    saveQuizScore,
    awardBadge,
    getCompletedLessonsCount,
    earnedBadges,
    lessonProgress,
    streak,
  } = useProgressStore();

  const totalCourses = courses.length;

  const getCompletedCoursesCount = useCallback(() => {
    let count = 0;
    for (const course of courses) {
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const allCompleted = allLessons.every((l) => lessonProgress[l.id]?.completed);
      if (allCompleted && allLessons.length > 0) count++;
    }
    return count;
  }, [lessonProgress]);

  const getQuizzesPassedCount = useCallback(() => {
    return Object.values(lessonProgress).filter(
      (p) => p.quizScore != null && p.quizTotal != null && p.quizScore >= p.quizTotal * 0.5
    ).length;
  }, [lessonProgress]);

  const getPerfectQuizzesCount = useCallback(() => {
    return Object.values(lessonProgress).filter(
      (p) => p.quizScore != null && p.quizTotal != null && p.quizScore === p.quizTotal
    ).length;
  }, [lessonProgress]);

  const checkAndAwardBadges = useCallback(() => {
    const stats = {
      lessonsCompleted: getCompletedLessonsCount(),
      coursesCompleted: getCompletedCoursesCount(),
      quizzesPassed: getQuizzesPassedCount(),
      perfectQuizzes: getPerfectQuizzesCount(),
      streakDays: streak,
      allCoursesCompleted: getCompletedCoursesCount() === totalCourses,
    };

    for (const badgeId of Object.keys(BADGE_DEFINITIONS) as BadgeId[]) {
      if (earnedBadges.includes(badgeId)) continue;
      if (checkBadgeEligibility(badgeId, stats)) {
        awardBadge(badgeId);
      }
    }
  }, [
    getCompletedLessonsCount,
    getCompletedCoursesCount,
    getQuizzesPassedCount,
    getPerfectQuizzesCount,
    streak,
    totalCourses,
    earnedBadges,
    awardBadge,
  ]);

  const handleLessonComplete = useCallback(
    (lessonId: string) => {
      completeLesson(lessonId);
      checkAndAwardBadges();
    },
    [completeLesson, checkAndAwardBadges]
  );

  const handleQuizComplete = useCallback(
    (lessonId: string, score: number, total: number) => {
      saveQuizScore(lessonId, score, total);
      checkAndAwardBadges();
    },
    [saveQuizScore, checkAndAwardBadges]
  );

  return {
    handleLessonComplete,
    handleQuizComplete,
    getCompletedCoursesCount,
    getQuizzesPassedCount,
    getPerfectQuizzesCount,
  };
}
