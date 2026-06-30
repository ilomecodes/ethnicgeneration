"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, Package } from "lucide-react";
import { megaCategories } from "@/lib/admin-data";
import Image from "next/image";

export default function CatalogPage() {
  const [expanded, setExpanded] = useState<number[]>([1]);
  const [categories] = useState(megaCategories);

  const toggle = (id: number) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Catalogue</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gérez vos méga-catégories et sous-catégories</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          Nouvelle méga-catégorie
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
              <Image src={cat.image} alt={cat.name} width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.productCount} produits</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const isOpen = expanded.includes(cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Mega category row */}
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggle(cat.id)}
              >
                {isOpen ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
                  <Image src={cat.image} alt={cat.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-400">
                    {cat.subcategories.length} sous-catégories · {cat.productCount} produits
                  </p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit2 size={14} className="text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: "#fdf5e8", color: "#b08a4a" }}
                  >
                    <Plus size={12} />
                    Sous-catégorie
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {isOpen && (
                <div className="border-t border-gray-50 divide-y divide-gray-50">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-4 px-6 py-3 ml-10 hover:bg-gray-50/30 transition-colors">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#b08a4a" }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{sub.name}</p>
                        <p className="text-xs text-gray-400">{sub.productCount} produits</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href="/admin/catalog/products"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          <Package size={12} />
                          Produits
                        </a>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Edit2 size={13} className="text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
