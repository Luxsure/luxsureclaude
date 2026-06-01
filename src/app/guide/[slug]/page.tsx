import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPlace, getCategoryConfig, priceLabel } from "@/lib/guide";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await fetchPlace(slug);
  if (!place) return { title: "Adresse introuvable" };
  return {
    title: `${place.name} — Guide Luxsure`,
    description: place.description ?? `${place.subcategory ?? place.category} · ${place.city ?? ""}`,
  };
}

export default async function PlacePage({ params }: PageProps) {
  const { slug } = await params;
  const place = await fetchPlace(slug);
  if (!place) notFound();

  const config = getCategoryConfig(place.category);
  const mapsUrl = place.address && place.city
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address} ${place.city}`)}`
    : null;

  const websiteDisplay = place.website
    ? place.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className={`h-32 bg-gradient-to-br ${config.gradient}`} />

      <div className="mx-auto max-w-4xl px-6 pb-20">
        {/* Back */}
        <div className="py-6">
          <Link href="/guide" className="text-sm text-zinc-500 transition hover:text-gold">
            ← Retour au guide
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="rounded-full border px-3 py-1 text-xs font-medium tracking-wide"
              style={{ borderColor: `${config.accent}40`, color: config.accent, backgroundColor: `${config.accent}10` }}
            >
              {place.category}
            </span>
            {place.price_range && (
              <span className="text-sm tracking-widest" style={{ color: "#C9A84C", opacity: 0.7 }}>
                {priceLabel(place.price_range)}
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl font-light leading-tight text-foreground md:text-5xl">
            {place.name}
          </h1>

          {place.subcategory && (
            <p className="mt-2 text-lg text-zinc-500">{place.subcategory}</p>
          )}

          {(place.city || place.country) && (
            <p className="mt-1 text-sm text-zinc-600">
              {[place.city, place.country !== "France" ? place.country : null].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* Grid: description + contact */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Description */}
          <div className="md:col-span-2">
            {place.description ? (
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h2 className="font-serif text-sm font-medium uppercase tracking-widest text-zinc-500 mb-4">
                  À propos
                </h2>
                <p className="text-zinc-300 leading-relaxed">{place.description}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
                <p className="text-zinc-600 text-sm">Aucune description disponible.</p>
              </div>
            )}
          </div>

          {/* Contact card */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/5 bg-card p-6 space-y-4">
              <h2 className="font-serif text-sm font-medium uppercase tracking-widest text-zinc-500">
                Coordonnées
              </h2>

              {place.address && (
                <ContactRow icon="📍" label="Adresse">
                  <span className="text-zinc-300 text-sm leading-relaxed">
                    {place.address}
                    {place.zip ? `, ${place.zip}` : ""}
                    {place.city ? ` ${place.city}` : ""}
                  </span>
                </ContactRow>
              )}

              {place.phone && (
                <ContactRow icon="☎" label="Téléphone">
                  <a href={`tel:${place.phone}`} className="text-sm text-zinc-300 hover:text-gold transition">
                    {place.phone}
                  </a>
                </ContactRow>
              )}

              {place.website && (
                <ContactRow icon="🌐" label="Site web">
                  <a
                    href={place.website.startsWith("http") ? place.website : `https://${place.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold hover:text-gold-light transition truncate block"
                  >
                    {websiteDisplay}
                  </a>
                </ContactRow>
              )}

              {place.email && (
                <ContactRow icon="✉" label="Email">
                  <a href={`mailto:${place.email}`} className="text-sm text-zinc-300 hover:text-gold transition truncate block">
                    {place.email}
                  </a>
                </ContactRow>
              )}

              {place.instagram && (
                <ContactRow icon="◈" label="Instagram">
                  <a
                    href={`https://instagram.com/${place.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-300 hover:text-gold transition"
                  >
                    {place.instagram}
                  </a>
                </ContactRow>
              )}
            </div>

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/5 py-3 text-sm font-medium text-gold transition hover:bg-gold/10 hover:border-gold/40"
              >
                Voir sur Google Maps →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, children }: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-base opacity-50 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-zinc-600 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}
