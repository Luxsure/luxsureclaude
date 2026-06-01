import Link from "next/link";
import { getCategoryConfig, priceLabel } from "@/lib/guide";
import type { Place } from "@/types/guide";

interface Props {
  place: Place;
  index?: number;
}

export function PlaceCard({ place, index = 0 }: Props) {
  const config = getCategoryConfig(place.category);

  return (
    <Link
      href={`/guide/${place.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-card transition-all duration-300 hover:border-gold/30 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      {/* Gradient banner */}
      <div className={`relative h-16 bg-gradient-to-br ${config.gradient} flex items-end px-4 pb-3`}>
        <span className="text-xl opacity-60">{config.icon}</span>
        <span
          className="ml-auto text-xs font-medium tracking-widest uppercase opacity-80"
          style={{ color: config.accent }}
        >
          {place.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-base font-semibold leading-snug text-foreground group-hover:text-gold transition-colors line-clamp-2">
            {place.name}
          </h3>
          {place.subcategory && (
            <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
              {place.subcategory}
            </p>
          )}
        </div>

        <div className="flex-1">
          {(place.address || place.city) && (
            <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
              {[place.address, place.city, place.country !== "France" ? place.country : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-xs tracking-widest" style={{ color: "#C9A84C", opacity: 0.7 }}>
            {priceLabel(place.price_range)}
          </span>
          <span className="text-xs text-zinc-600 transition-colors group-hover:text-gold">
            Découvrir →
          </span>
        </div>
      </div>
    </Link>
  );
}
