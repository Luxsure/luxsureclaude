import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Fluency Academy | Maîtrisez l'IA",
  description:
    "Apprenez à maîtriser l'intelligence artificielle avec des cours interactifs, des quiz et des parcours personnalisés.",
};

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-foreground">
                AI Fluency Academy
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              La plateforme francophone pour maîtriser l&apos;intelligence
              artificielle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/courses"
                className="text-sm text-zinc-500 hover:text-foreground"
              >
                Tous les cours
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-500 hover:text-foreground"
              >
                Tableau de bord
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Ressources</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-zinc-500">Blog (bientôt)</span>
              <span className="text-sm text-zinc-500">
                Communauté (bientôt)
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-zinc-600">
          &copy; 2026 AI Fluency Academy. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
