import { Suspense } from "react";
import { fetchPlaces } from "@/lib/guide";
import { PlaceCard } from "@/components/guide/PlaceCard";
import { GuideFilters } from "@/components/guide/GuideFilters";
import { GuidePagination } from "@/components/guide/GuidePagination";
import { PER_PAGE } from "@/lib/guide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Guide Luxsure — Adresses d'exception",
  description: "La sélection Luxsure : restaurants étoilés, palaces, boutiques de luxe et adresses rares à travers le monde.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    city?: string;
    country?: string;
    search?: string;
    page?: string;
  }>;
}

async function PlacesGrid({ searchParams }: PageProps) {
  const sp       = await searchParams;
  const page     = parseInt(sp.page ?? "1", 10);
  const { places, total } = await fetchPlaces({
    category: sp.category,
    city:     sp.city,
    country:  sp.country,
    search:   sp.search,
    page,
  });

  if (places.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl mb-3">◎</p>
        <p className="text-zinc-400">Aucune adresse ne correspond à votre recherche.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          <span className="text-foreground font-medium">{total.toLocaleString("fr-FR")}</span> adresses
          {sp.category ? ` · ${sp.category}` : ""}
          {sp.city ? ` · ${sp.city}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {places.map((place, i) => (
          <PlaceCard key={place.id} place={place} index={i} />
        ))}
      </div>

      <GuidePagination total={total} page={page} perPage={PER_PAGE} />
    </>
  );
}

export default async function GuidePage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 py-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,168,76,0.08),transparent)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-gold/60">
            Sélection Luxsure
          </p>
          <h1 className="font-serif text-5xl font-light tracking-tight text-foreground md:text-7xl">
            Le Guide
            <span className="block bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Luxsure
            </span>
          </h1>
          <p className="mt-6 text-base text-zinc-500 max-w-xl mx-auto">
            Restaurants étoilés, palaces, boutiques rares — 2 072 adresses d&apos;exception à travers le monde.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Suspense>
          <GuideFilters
            activeCat={sp.category}
            activeCity={sp.city}
            search={sp.search}
          />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={<PlacesGridSkeleton />}>
            <PlacesGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function PlacesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-2xl bg-card" />
      ))}
    </div>
  );
}
