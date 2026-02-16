import Link from "next/link";
import { courses } from "@/data/courses";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-light">
              <span className="animate-float inline-block">🚀</span>
              Nouvelle plateforme d&apos;apprentissage IA
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Maîtrisez l&apos;
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intelligence Artificielle
              </span>
            </h1>

            <p className="mb-10 text-lg text-zinc-400 md:text-xl">
              Des cours interactifs, des quiz pratiques et des parcours
              personnalisés pour devenir fluent en IA. Du débutant à
              l&apos;expert, à votre rythme.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/courses"
                className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-light hover:shadow-xl hover:shadow-primary/25"
              >
                Explorer les cours
              </Link>
              <Link
                href="/courses/fundamentals-of-ai"
                className="rounded-xl border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-card"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {[
            { value: "4", label: "Cours disponibles" },
            { value: "36+", label: "Leçons interactives" },
            { value: "50+", label: "Quiz pratiques" },
            { value: "100%", label: "Gratuit" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Preview */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Nos parcours de formation</h2>
          <p className="text-zinc-400">
            Choisissez votre niveau et progressez à votre rythme
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl">{course.icon}</span>
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

              <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary-light transition-colors">
                {course.title}
              </h3>
              <p className="mb-4 text-sm text-zinc-500">{course.description}</p>

              <div className="flex items-center gap-4 text-xs text-zinc-600">
                <span className="flex items-center gap-1">
                  ⏱️ {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  📚 {course.lessonsCount} leçons
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-background px-2 py-0.5 text-xs text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-primary-light hover:text-accent transition-colors"
          >
            Voir tous les cours →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Comment ça marche ?</h2>
            <p className="text-zinc-400">
              Un parcours simple et efficace pour monter en compétence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choisissez un cours",
                description:
                  "Parcourez notre catalogue et trouvez le sujet qui vous intéresse selon votre niveau.",
                icon: "📖",
              },
              {
                step: "02",
                title: "Apprenez à votre rythme",
                description:
                  "Lisez les leçons interactives avec des exemples concrets et du contenu structuré.",
                icon: "🎯",
              },
              {
                step: "03",
                title: "Testez vos connaissances",
                description:
                  "Validez chaque leçon avec des quiz interactifs et suivez votre progression.",
                icon: "✅",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border bg-card p-8 text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  {item.step}
                </div>
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Prêt à devenir fluent en IA ?
          </h2>
          <p className="mb-8 text-zinc-400">
            Commencez gratuitement dès maintenant. Aucune carte bancaire
            requise.
          </p>
          <Link
            href="/courses"
            className="inline-block rounded-xl bg-primary px-8 py-3.5 font-semibold text-white transition-all hover:bg-primary-light hover:shadow-xl hover:shadow-primary/25"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
