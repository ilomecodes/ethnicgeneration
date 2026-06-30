"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Users,
  Truck,
  BarChart2,
  Scissors,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  {
    href: "/admin/catalog",
    label: "Catalogue",
    icon: Layers,
    children: [
      { href: "/admin/catalog", label: "Méga-catégories" },
      { href: "/admin/catalog/subcategories", label: "Sous-catégories" },
      { href: "/admin/catalog/products", label: "Produits" },
    ],
  },
  { href: "/admin/customers", label: "Clients", icon: Users },
  {
    href: "/admin/sur-mesure",
    label: "Sur Mesure",
    icon: Scissors,
    children: [
      { href: "/admin/sur-mesure", label: "Demandes" },
      { href: "/admin/sur-mesure/materiaux", label: "Matières & Tissus" },
      { href: "/admin/sur-mesure/options", label: "Options de finition" },
    ],
  },
  { href: "/admin/rates", label: "Tarifs livraison", icon: Truck },
  { href: "/admin/reports", label: "Rapports", icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(() => {
    const open: string[] = [];
    if (pathname.startsWith("/admin/catalog")) open.push("/admin/catalog");
    if (pathname.startsWith("/admin/sur-mesure")) open.push("/admin/sur-mesure");
    return open;
  });

  const toggleSection = (href: string) =>
    setOpenSections((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "#1a0e07" }}>
      {/* Logo */}
      <div className="px-6 py-7 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          EG
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">
          Ethnicgeneration
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-6 space-y-0.5">
        {nav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const isOpen = openSections.includes(item.href);

          if (item.children) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => toggleSection(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  }}
                >
                  <item.icon size={18} />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {isOpen && (
                  <div className="ml-9 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 rounded-lg text-xs transition-all"
                          style={{
                            color: childActive ? "#fff" : "rgba(255,255,255,0.55)",
                            background: childActive ? "rgba(255,255,255,0.12)" : "transparent",
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              }}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          Admin Panel v1.0
        </p>
      </div>
    </aside>
  );
}
