import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Admin | AI Fluency Academy",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          🔧 Administration
        </h2>
        <nav className="space-y-1">
          {[
            { href: "/admin", label: "Vue d'ensemble", icon: "📊" },
            { href: "/admin/courses", label: "Cours", icon: "📚" },
            { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
            { href: "/admin/audit", label: "Journal d'audit", icon: "📋" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-card-hover hover:text-foreground"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
