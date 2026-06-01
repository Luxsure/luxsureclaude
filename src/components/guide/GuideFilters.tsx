"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ALL_CATEGORIES } from "@/lib/guide";

interface Props {
  activeCat?: string;
  activeCity?: string;
  search?: string;
}

export function GuideFilters({ activeCat, activeCity, search }: Props) {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();
  const [, startTransition] = useTransition();

  const push = useCallback((updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }, [params, pathname, router]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un lieu, une ville…"
          defaultValue={search}
          onChange={(e) => push({ search: e.target.value || undefined })}
          className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 pr-10 text-sm text-foreground placeholder-zinc-600 outline-none transition focus:border-gold/40 focus:ring-1 focus:ring-gold/20"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">⌕</span>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => push({ category: undefined, city: undefined })}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
            !activeCat
              ? "border-gold/60 bg-gold/10 text-gold"
              : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
          }`}
        >
          Tout voir
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => push({ category: activeCat === cat ? undefined : cat })}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
              activeCat === cat
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* City filter (shown if a city is active) */}
      {activeCity && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Ville :</span>
          <span className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-gold">
            {activeCity}
            <button onClick={() => push({ city: undefined })} className="opacity-60 hover:opacity-100">×</button>
          </span>
        </div>
      )}
    </div>
  );
}
