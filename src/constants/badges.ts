export const BADGE_DEFINITIONS = {
  "first-lesson": {
    slug: "first-lesson",
    title: "Premier pas",
    description: "Terminer votre première leçon",
    icon: "🎯",
    category: "course",
    requirementType: "lessons_completed",
    requirementValue: 1,
  },
  "five-lessons": {
    slug: "five-lessons",
    title: "Étudiant assidu",
    description: "Terminer 5 leçons",
    icon: "📚",
    category: "course",
    requirementType: "lessons_completed",
    requirementValue: 5,
  },
  "ten-lessons": {
    slug: "ten-lessons",
    title: "Expert en herbe",
    description: "Terminer 10 leçons",
    icon: "🎓",
    category: "course",
    requirementType: "lessons_completed",
    requirementValue: 10,
  },
  "first-course": {
    slug: "first-course",
    title: "Diplômé",
    description: "Terminer un cours complet",
    icon: "🏆",
    category: "course",
    requirementType: "courses_completed",
    requirementValue: 1,
  },
  "perfect-quiz": {
    slug: "perfect-quiz",
    title: "Sans faute",
    description: "Obtenir 100% à un quiz",
    icon: "💯",
    category: "quiz",
    requirementType: "perfect_quiz",
    requirementValue: 1,
  },
  "five-quizzes": {
    slug: "five-quizzes",
    title: "Quizmaster",
    description: "Réussir 5 quiz",
    icon: "🧪",
    category: "quiz",
    requirementType: "quizzes_passed",
    requirementValue: 5,
  },
  "streak-3": {
    slug: "streak-3",
    title: "Régulier",
    description: "3 jours consécutifs d'apprentissage",
    icon: "🔥",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 3,
  },
  "streak-7": {
    slug: "streak-7",
    title: "Marathonien",
    description: "7 jours consécutifs d'apprentissage",
    icon: "⚡",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 7,
  },
  "streak-30": {
    slug: "streak-30",
    title: "Légende",
    description: "30 jours consécutifs d'apprentissage",
    icon: "👑",
    category: "streak",
    requirementType: "streak_days",
    requirementValue: 30,
  },
  "ai-fluent": {
    slug: "ai-fluent",
    title: "AI Fluent",
    description: "Terminer tous les cours",
    icon: "🤖",
    category: "special",
    requirementType: "all_courses_completed",
    requirementValue: 1,
  },
} as const;

export type BadgeId = keyof typeof BADGE_DEFINITIONS;

export function getBadgesForCategory(category: string) {
  return Object.values(BADGE_DEFINITIONS).filter(
    (b) => b.category === category
  );
}

export function checkBadgeEligibility(
  badgeId: BadgeId,
  stats: { lessonsCompleted: number; coursesCompleted: number; quizzesPassed: number; perfectQuizzes: number; streakDays: number; allCoursesCompleted: boolean }
): boolean {
  const badge = BADGE_DEFINITIONS[badgeId];
  switch (badge.requirementType) {
    case "lessons_completed":
      return stats.lessonsCompleted >= badge.requirementValue;
    case "courses_completed":
      return stats.coursesCompleted >= badge.requirementValue;
    case "perfect_quiz":
      return stats.perfectQuizzes >= badge.requirementValue;
    case "quizzes_passed":
      return stats.quizzesPassed >= badge.requirementValue;
    case "streak_days":
      return stats.streakDays >= badge.requirementValue;
    case "all_courses_completed":
      return stats.allCoursesCompleted;
    default:
      return false;
  }
}
