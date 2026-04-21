import { courses } from "@/data/courses";

export default function AdminDashboard() {
  const totalLessons = courses.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
    0
  );
  const totalQuizzes = courses.reduce(
    (sum, c) =>
      sum +
      c.modules.reduce(
        (s, m) => s + m.lessons.filter((l) => l.quiz && l.quiz.length > 0).length,
        0
      ),
    0
  );

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Vue d&apos;ensemble</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Cours", value: courses.length, icon: "📚" },
          { label: "Leçons", value: totalLessons, icon: "📖" },
          { label: "Quiz", value: totalQuizzes, icon: "🧪" },
          { label: "Utilisateurs", value: "—", icon: "👥" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-2 text-2xl">{stat.icon}</div>
            <div className="text-3xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold">Accès rapide</h2>
        <p className="text-sm text-zinc-400">
          Cette section admin sera protégée par le rôle{" "}
          <code className="rounded bg-primary/15 px-1.5 py-0.5 text-primary-light">
            admin
          </code>{" "}
          via Supabase RLS. Connectez Supabase pour activer l&apos;authentification
          et la gestion des utilisateurs.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="text-sm font-medium text-foreground">
              📋 Gestion des cours
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Ajouter, modifier, supprimer des cours et leçons. Recherche
              full-text et pagination serveur prêtes dans le schéma SQL.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="text-sm font-medium text-foreground">
              👥 Gestion des utilisateurs
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Voir les profils, gérer les rôles (user/editor/admin),
              suivre les abonnements Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
