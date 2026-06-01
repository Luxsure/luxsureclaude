import type { Place, GuidePage, GuideFiltersState } from "@/types/guide";
import { createClient } from "@/lib/supabase-server";

export const PER_PAGE = 24;

// ── Category config ────────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, {
  label: string;
  gradient: string;
  accent: string;
  icon: string;
}> = {
  "Gastronomie":             { label: "Gastronomie",             gradient: "from-amber-900/60 to-orange-950/40",   accent: "#D97706", icon: "🍽" },
  "Hôtels & Séjours":        { label: "Hôtels & Séjours",        gradient: "from-indigo-900/60 to-slate-950/40",   accent: "#6366F1", icon: "🏨" },
  "Shopping":                { label: "Shopping",                gradient: "from-rose-900/60 to-pink-950/40",      accent: "#F43F5E", icon: "🛍" },
  "Joaillerie & Horlogerie": { label: "Joaillerie & Horlogerie", gradient: "from-yellow-800/60 to-amber-950/40",   accent: "#C9A84C", icon: "💎" },
  "Wellness & Beauté":       { label: "Wellness & Beauté",       gradient: "from-teal-900/60 to-emerald-950/40",  accent: "#14B8A6", icon: "✦" },
  "Parfumerie & Beauté":     { label: "Parfumerie & Beauté",     gradient: "from-fuchsia-900/60 to-pink-950/40",  accent: "#D946EF", icon: "🌸" },
  "Bars & Cocktails":        { label: "Bars & Cocktails",        gradient: "from-purple-900/60 to-violet-950/40", accent: "#A855F7", icon: "🥂" },
  "Art & Culture":           { label: "Art & Culture",           gradient: "from-violet-900/60 to-purple-950/40", accent: "#8B5CF6", icon: "🎨" },
  "Vins & Art de Vivre":     { label: "Vins & Art de Vivre",     gradient: "from-red-900/60 to-rose-950/40",      accent: "#EF4444", icon: "🍷" },
  "Nightlife & Clubs":       { label: "Nightlife & Clubs",       gradient: "from-zinc-800/60 to-slate-950/40",    accent: "#71717A", icon: "✦" },
  "Sport & Loisirs":         { label: "Sport & Loisirs",         gradient: "from-green-900/60 to-emerald-950/40", accent: "#22C55E", icon: "⛳" },
  "Services & Expériences":  { label: "Services & Expériences",  gradient: "from-sky-900/60 to-blue-950/40",      accent: "#0EA5E9", icon: "✈" },
  "Éducation & Lifestyle":   { label: "Éducation & Lifestyle",   gradient: "from-amber-900/60 to-yellow-950/40",  accent: "#F59E0B", icon: "🎓" },
  "À découvrir":             { label: "À découvrir",             gradient: "from-zinc-800/60 to-neutral-950/40",  accent: "#A1A1AA", icon: "◎" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);

export function getCategoryConfig(category: string) {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["À découvrir"];
}

// ── Price range helper ────────────────────────────────────────────────────────

export function priceLabel(range: number | null): string {
  if (!range) return "";
  return "◆".repeat(range) + "◇".repeat(4 - range);
}

// ── Supabase queries ──────────────────────────────────────────────────────────

export async function fetchPlaces(filters: GuideFiltersState): Promise<GuidePage> {
  const supabase = await createClient();
  const page    = filters.page ?? 1;
  const from    = (page - 1) * PER_PAGE;
  const to      = from + PER_PAGE - 1;

  let query = supabase
    .from("places")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("name");

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.city)     query = query.ilike("city", `%${filters.city}%`);
  if (filters.country)  query = query.eq("country", filters.country);
  if (filters.search) {
    query = query.textSearch("fts", filters.search, { config: "french" });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) throw new Error(error.message);

  return {
    places: (data ?? []) as Place[],
    total:   count ?? 0,
    page,
    perPage: PER_PAGE,
  };
}

export async function fetchPlace(slug: string): Promise<Place | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as Place | null;
}

export async function fetchCities(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("places")
    .select("city")
    .eq("is_published", true)
    .not("city", "is", null)
    .order("city");

  const cities = [...new Set((data ?? []).map((r: { city: string }) => r.city).filter(Boolean))];
  return cities as string[];
}

export async function fetchCountries(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("places")
    .select("country")
    .eq("is_published", true)
    .not("country", "is", null)
    .order("country");

  const countries = [...new Set((data ?? []).map((r: { country: string }) => r.country).filter(Boolean))];
  return countries as string[];
}
