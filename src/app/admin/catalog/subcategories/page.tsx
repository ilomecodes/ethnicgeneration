"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { megaCategories } from "@/lib/admin-data";

const allSubs = megaCategories.flatMap((cat) =>
  cat.subcategories.map((sub) => ({ ...sub, megaCat: cat.name, megaCatId: cat.id }))
);

export default function SubcategoriesPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Tous");

  const catOptions = ["Tous", ...megaCategories.map((c) => c.name)];

  const filtered = allSubs.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Tous" || s.megaCat === filterCat;
    return matchSearch && matchCat;
  });

  const catColors: Record<string, string> = {
    Femmes: "#b08a4a",
    Hommes: "#059669",
    Enfants: "#D97706",
    Accessoires: "#DB2777",
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Sous-catégories</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allSubs.length} sous-catégories au total</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nouvelle sous-catégorie</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm flex-1 min-w-[160px] max-w-sm">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="text-sm text-gray-700 placeholder-gray-400 outline-none flex-1 bg-transparent min-w-0"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {catOptions.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={
                filterCat === c
                  ? { background: "#b08a4a", color: "#fff" }
                  : { background: "#fff", color: "#6B7280" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filtered.map((sub) => {
          const color = catColors[sub.megaCat] ?? "#6B7280";
          return (
            <div key={sub.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm group">
              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: `${color}18`, color }}
                >
                  {sub.megaCat}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100">
                    <Edit2 size={13} className="text-gray-400" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-gray-800">{sub.name}</p>
              <p className="text-xs text-gray-400 mt-1">{sub.productCount} produits</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
