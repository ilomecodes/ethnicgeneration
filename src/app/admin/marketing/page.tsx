"use client";

import { useState } from "react";
import { Plus, Tag, Percent, Trash2, Copy } from "lucide-react";

const promos = [
  { id: 1, code: "BIENVENUE10", type: "Pourcentage", value: "10%", uses: 23, limit: 100, expires: "31 Jul 2026", active: true },
  { id: 2, code: "ETE2026", type: "Pourcentage", value: "15%", uses: 8, limit: 50, expires: "31 Aoû 2026", active: true },
  { id: 3, code: "FIDELITE5", type: "Montant fixe", value: "3 000 FCFA", uses: 41, limit: null, expires: null, active: true },
  { id: 4, code: "NOEL2025", type: "Pourcentage", value: "20%", uses: 88, limit: 100, expires: "31 Déc 2025", active: false },
];

export default function MarketingPage() {
  const [codes] = useState(promos);

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Marketing</h1>
          <p className="text-sm text-gray-400 mt-0.5">Codes promo et campagnes</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Créer un code promo</span>
          <span className="sm:hidden">Créer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fdf5e8" }}>
            <Tag size={16} style={{ color: "#b08a4a" }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg md:text-xl font-bold text-gray-800">{codes.filter((c) => c.active).length}</p>
            <p className="text-xs text-gray-400 truncate">Codes actifs</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#ECFDF5" }}>
            <Percent size={16} style={{ color: "#059669" }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg md:text-xl font-bold text-gray-800">{codes.reduce((s, c) => s + c.uses, 0)}</p>
            <p className="text-xs text-gray-400 truncate">Utilisations</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FEF3C7" }}>
            <Tag size={16} style={{ color: "#D97706" }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg md:text-xl font-bold text-gray-800">{codes.length}</p>
            <p className="text-xs text-gray-400 truncate">Codes créés</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-50">
                {["Code", "Type", "Valeur", "Utilisations", "Expiration", "Statut", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 md:px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {codes.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code
                        className="text-sm font-bold px-2 py-0.5 rounded-lg whitespace-nowrap"
                        style={{ background: "#fdf5e8", color: "#b08a4a" }}
                      >
                        {promo.code}
                      </code>
                      <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                        <Copy size={12} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{promo.type}</td>
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-gray-700">{promo.value}</td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-500">
                    {promo.uses}{promo.limit ? ` / ${promo.limit}` : ""}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{promo.expires ?? "Sans limite"}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={
                        promo.active
                          ? { background: "#ECFDF5", color: "#059669" }
                          : { background: "#F3F4F6", color: "#9CA3AF" }
                      }
                    >
                      {promo.active ? "Actif" : "Expiré"}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
