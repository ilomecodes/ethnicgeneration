"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, ShoppingBag, Scissors, LogOut, ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const accountNav = [
  { href: "/compte",            label: "Mon profil",    icon: User },
  { href: "/compte/commandes",  label: "Mes commandes", icon: ShoppingBag },
  { href: "/compte/sur-mesure", label: "Sur Mesure",    icon: Scissors },
];

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/connexion");
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }}>
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-5 md:px-10 h-16 border-b sticky top-0 z-20"
        style={{ borderColor: "rgba(20,17,13,.1)", background: "#f6f1e6" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
        >
          <ArrowLeft size={15} strokeWidth={2} />
          <span className="hidden sm:inline">Boutique</span>
        </Link>

        <span
          className="font-[family-name:var(--font-display)] italic text-xl"
          style={{ color: "#14110d" }}
        >
          Ethnicgeneration
        </span>

        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "#b08a4a" }}
          >
            {user.initials}
          </div>
          <span className="text-sm font-medium hidden sm:block" style={{ color: "#14110d" }}>
            {user.name}
          </span>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg ml-1"
            style={{ background: "rgba(20,17,13,.06)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} style={{ color: "#14110d" }} />
          </button>
        </div>
      </header>

      {/* ── Mobile: bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t"
        style={{ background: "#f6f1e6", borderColor: "rgba(20,17,13,.1)" }}
      >
        {accountNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
              style={{ color: isActive ? "#b08a4a" : "#9CA3AF" }}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span
                className="text-[10px] tracking-wide font-semibold"
                style={{ fontFamily: "var(--font-nav)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
          style={{ color: "#9CA3AF" }}
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-[10px] tracking-wide font-semibold" style={{ fontFamily: "var(--font-nav)" }}>
            Quitter
          </span>
        </button>
      </nav>

      {/* ── Mobile: slide-in sidebar overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            style={{ background: "rgba(20,17,13,.4)", backdropFilter: "blur(2px)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col"
            style={{ background: "#fff" }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: "#f0ebe0" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "#b08a4a" }}
                >
                  {user.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#14110d" }}>{user.name}</p>
                  <p className="text-xs" style={{ color: "#b08a4a99" }}>Membre depuis {user.memberSince}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(20,17,13,.06)" }}
              >
                <X size={15} style={{ color: "#6B7280" }} />
              </button>
            </div>
            <nav className="flex-1 px-4 pt-4 space-y-1">
              {accountNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                    style={{
                      background: isActive ? "#fdf5e8" : "transparent",
                      color: isActive ? "#b08a4a" : "#6B7280",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pb-8 pt-4 border-t" style={{ borderColor: "#f0ebe0" }}>
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full transition-all hover:bg-red-50"
                style={{ color: "#9CA3AF" }}
              >
                <LogOut size={17} />
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Desktop: sidebar + content ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 md:flex gap-8 pb-24 md:pb-10">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
            <div className="flex flex-col items-center py-4 mb-2 border-b" style={{ borderColor: "#f0ebe0" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2"
                style={{ background: "#b08a4a" }}
              >
                {user.initials}
              </div>
              <p className="font-semibold text-sm text-center" style={{ color: "#14110d" }}>{user.name}</p>
              <p className="text-xs mt-0.5 text-center" style={{ color: "#b08a4a99" }}>Membre depuis {user.memberSince}</p>
            </div>
            <nav className="space-y-0.5 mt-3">
              {accountNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: isActive ? "#fdf5e8" : "transparent",
                      color: isActive ? "#b08a4a" : "#6B7280",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#f0ebe0" }}>
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all hover:bg-red-50"
                style={{ color: "#9CA3AF" }}
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
