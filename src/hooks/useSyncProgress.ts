"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/stores/progress";
import { createClient } from "@/lib/supabase";

export function useSyncProgress() {
  const { lessonProgress, xp, level, earnedBadges } = useProgressStore();

  useEffect(() => {
    const supabase = createClient();

    async function syncToSupabase() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const completedLessons = Object.entries(lessonProgress).filter(
        ([, p]) => p.completed
      );

      for (const [lessonId, progress] of completedLessons) {
        await supabase.from("user_lesson_progress").upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: progress.completed,
            completed_at: progress.completedAt,
            quiz_score: progress.quizScore,
            quiz_total: progress.quizTotal,
          },
          { onConflict: "user_id,lesson_id" }
        );
      }

      await supabase
        .from("profiles")
        .update({ xp, current_level: level })
        .eq("id", user.id);

      for (const badgeId of earnedBadges) {
        await supabase
          .from("user_badges")
          .upsert(
            { user_id: user.id, badge_id: badgeId },
            { onConflict: "user_id,badge_id" }
          );
      }
    }

    syncToSupabase();
  }, [lessonProgress, xp, level, earnedBadges]);
}

export function useLoadProgress() {
  const store = useProgressStore();

  useEffect(() => {
    const supabase = createClient();

    async function loadFromSupabase() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("xp, current_level, streak_days")
        .eq("id", user.id)
        .single();

      if (profile) {
        useProgressStore.setState({
          xp: profile.xp,
          level: profile.current_level,
          streak: profile.streak_days,
        });
      }

      const { data: progress } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);

      if (progress && progress.length > 0) {
        const lessonProgress: Record<string, { completed: boolean; completedAt: string | null; quizScore: number | null; quizTotal: number | null }> = {};
        for (const p of progress) {
          lessonProgress[p.lesson_id] = {
            completed: p.completed,
            completedAt: p.completed_at,
            quizScore: p.quiz_score,
            quizTotal: p.quiz_total,
          };
        }
        useProgressStore.setState({ lessonProgress });
      }

      const { data: badges } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      if (badges && badges.length > 0) {
        useProgressStore.setState({
          earnedBadges: badges.map((b) => b.badge_id),
        });
      }
    }

    loadFromSupabase();
  }, []);
}
