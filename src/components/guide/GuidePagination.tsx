"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  total: number;
  page: number;
  perPage: number;
}

export function GuidePagination({ total, page, perPage }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();
  const pages    = Math.ceil(total / perPage);

  if (pages <= 1) return null;

  const go = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    router.push(`${pathname}?${next.toString()}`);
  };

  const visible = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-2 pt-12">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-500 transition hover:border-gold/30 hover:text-gold disabled:opacity-30"
      >
        ←
      </button>

      {visible.map((p, i) => (
        <span key={p}>
          {i > 0 && visible[i - 1] !== p - 1 && (
            <span className="px-1 text-zinc-700">…</span>
          )}
          <button
            onClick={() => go(p)}
            className={`min-w-[2.25rem] rounded-lg border px-3 py-2 text-sm transition ${
              p === page
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-white/10 text-zinc-500 hover:border-gold/30 hover:text-gold"
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => go(page + 1)}
        disabled={page >= pages}
        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-500 transition hover:border-gold/30 hover:text-gold disabled:opacity-30"
      >
        →
      </button>
    </div>
  );
}
