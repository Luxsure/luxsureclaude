"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Fluency Academy
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/courses"
            className="text-sm text-zinc-400 transition-colors hover:text-foreground"
          >
            Cours
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-zinc-400 transition-colors hover:text-foreground"
                  >
                    Tableau de bord
                  </Link>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary-light"
                    >
                      {(
                        user.user_metadata?.display_name?.[0] ??
                        user.email?.[0] ??
                        "?"
                      ).toUpperCase()}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm text-zinc-500 transition-colors hover:text-foreground"
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm text-zinc-400 transition-colors hover:text-foreground"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25"
                  >
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
