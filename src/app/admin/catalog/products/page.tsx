"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { megaCategories, topProducts } from "@/lib/admin-data";
import Image from "next/image";

const allProducts = [
  ...topProducts,
  { id: 5, name: "Kaba Africain Brodé", price: "109,99 €", image: "/plate-women.png", sales: 65 },
  { id: 6, name: "Chemise Wax Homme", price: "69,99 €", image: "/plate-men.png", sales: 53 },
  { id: 7, name: "Ensemble Festif Enfant", price: "59,99 €", image: "/plate-kids.png", sales: 44 },
  { id: 8, name: "Foulard Wax Maxi", price: "29,99 €", image: "/plate-women.png", sales: 38 },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");

  const catOptions = ["Tous", ...megaCategories.map((c) => c.name)];

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Produits</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allProducts.length} produits dans le catalogue</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          Ajouter un produit
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm flex-1 max-w-sm">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="text-sm text-gray-700 placeholder-gray-400 outline-none flex-1 bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          {catOptions.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={
                catFilter === c
                  ? { background: "#b08a4a", color: "#fff" }
                  : { background: "#fff", color: "#6B7280" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
            <div className="relative h-44 overflow-hidden" style={{ background: "#f0ebe0" }}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Edit2 size={13} className="text-gray-500" />
                </button>
                <button className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-bold" style={{ color: "#b08a4a" }}>{p.price}</p>
                <p className="text-xs text-gray-400">{p.sales} ventes</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
