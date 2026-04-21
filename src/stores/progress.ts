import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LessonProgress {
  completed: boolean;
  completedAt: string | null;
  quizScore: number | null;
  quizTotal: number | null;
}

interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  xp: number;
  streak: number;
  level: number;
  earnedBadges: string[];

  completeLesson: (lessonId: string) => void;
  saveQuizScore: (lessonId: string, score: number, total: number) => void;
  addXp: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getCompletedLessonsCount: () => number;
  getQuizScore: (lessonId: string) => { score: number; total: number } | null;
}

const XP_PER_LESSON = 50;
const XP_PER_QUIZ_POINT = 20;
const XP_PER_LEVEL = 300;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessonProgress: {},
      xp: 0,
      streak: 1,
      level: 1,
      earnedBadges: [],

      completeLesson: (lessonId: string) => {
        const state = get();
        if (state.lessonProgress[lessonId]?.completed) return;

        const newXp = state.xp + XP_PER_LESSON;
        set({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              completed: true,
              completedAt: new Date().toISOString(),
              quizScore: state.lessonProgress[lessonId]?.quizScore ?? null,
              quizTotal: state.lessonProgress[lessonId]?.quizTotal ?? null,
            },
          },
          xp: newXp,
          level: Math.floor(newXp / XP_PER_LEVEL) + 1,
        });
      },

      saveQuizScore: (lessonId: string, score: number, total: number) => {
        const state = get();
        const bonusXp = score * XP_PER_QUIZ_POINT;
        const newXp = state.xp + bonusXp;
        set({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              completed: state.lessonProgress[lessonId]?.completed ?? false,
              completedAt: state.lessonProgress[lessonId]?.completedAt ?? null,
              quizScore: score,
              quizTotal: total,
            },
          },
          xp: newXp,
          level: Math.floor(newXp / XP_PER_LEVEL) + 1,
        });
      },

      addXp: (amount: number) => {
        const state = get();
        const newXp = state.xp + amount;
        set({
          xp: newXp,
          level: Math.floor(newXp / XP_PER_LEVEL) + 1,
        });
      },

      awardBadge: (badgeId: string) => {
        const state = get();
        if (state.earnedBadges.includes(badgeId)) return;
        set({ earnedBadges: [...state.earnedBadges, badgeId] });
      },

      isLessonCompleted: (lessonId: string) => {
        return get().lessonProgress[lessonId]?.completed ?? false;
      },

      getCompletedLessonsCount: () => {
        return Object.values(get().lessonProgress).filter((p) => p.completed).length;
      },

      getQuizScore: (lessonId: string) => {
        const p = get().lessonProgress[lessonId];
        if (p?.quizScore == null || p?.quizTotal == null) return null;
        return { score: p.quizScore, total: p.quizTotal };
      },
    }),
    { name: "ai-fluency-progress" }
  )
);
