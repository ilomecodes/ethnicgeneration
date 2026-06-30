"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, ShoppingBag, Scissors, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const accountNav = [
  { href: "/compte",              label: "Mon profil",       icon: User },
  { href: "/compte/commandes",    label: "Mes commandes",    icon: ShoppingBag },
  { href: "/compte/sur-mesure",   label: "Sur Mesure",       icon: Scissors },
];

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
    if (!user) router.replace("/connexion");
  }, [user, router]);

  if (!checked || !user) return null;

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-10 h-18 border-b" style={{ borderColor: "rgba(20,17,13,.1)", background: "#f6f1e6" }}>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium py-5" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>
          <ArrowLeft size={15} strokeWidth={2} />
          Boutique
        </Link>
        <span className="font-[family-name:var(--font-display)] italic text-xl" style={{ color: "#14110d" }}>
          Ethnicgeneration
        </span>
        <div className="flex items-center gap-3 py-5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "#b08a4a" }}
          >
            {user.initials}
          </div>
          <span className="text-sm font-medium hidden sm:block" style={{ color: "#14110d" }}>{user.name}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-8">
            {/* Avatar */}
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

            {/* Nav */}
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

            {/* Logout */}
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
