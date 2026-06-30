"use client";

import { useState } from "react";
import { Plus, Tag, Percent, Trash2, Copy } from "lucide-react";

const promos = [
  { id: 1, code: "BIENVENUE10", type: "Pourcentage", value: "10%", uses: 23, limit: 100, expires: "31 Jul 2026", active: true },
  { id: 2, code: "ETE2026", type: "Pourcentage", value: "15%", uses: 8, limit: 50, expires: "31 Aoû 2026", active: true },
  { id: 3, code: "FIDELITE5", type: "Montant fixe", value: "5 €", uses: 41, limit: null, expires: null, active: true },
  { id: 4, code: "NOEL2025", type: "Pourcentage", value: "20%", uses: 88, limit: 100, expires: "31 Déc 2025", active: false },
];

export default function MarketingPage() {
  const [codes] = useState(promos);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Marketing</h1>
          <p className="text-sm text-gray-400 mt-0.5">Codes promo et campagnes</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          Créer un code promo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#fdf5e8" }}>
            <Tag size={18} style={{ color: "#b08a4a" }} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{codes.filter((c) => c.active).length}</p>
            <p className="text-xs text-gray-400">Codes actifs</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#ECFDF5" }}>
            <Percent size={18} style={{ color: "#059669" }} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{codes.reduce((s, c) => s + c.uses, 0)}</p>
            <p className="text-xs text-gray-400">Utilisations totales</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FEF3C7" }}>
            <Tag size={18} style={{ color: "#D97706" }} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{codes.length}</p>
            <p className="text-xs text-gray-400">Codes créés</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Code", "Type", "Valeur", "Utilisations", "Expiration", "Statut", "Action"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {codes.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code
                      className="text-sm font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: "#fdf5e8", color: "#b08a4a" }}
                    >
                      {promo.code}
                    </code>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Copy size={12} className="text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{promo.type}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">{promo.value}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {promo.uses}{promo.limit ? ` / ${promo.limit}` : ""}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{promo.expires ?? "Sans limite"}</td>
                <td className="px-6 py-4">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={
                      promo.active
                        ? { background: "#ECFDF5", color: "#059669" }
                        : { background: "#F3F4F6", color: "#9CA3AF" }
                    }
                  >
                    {promo.active ? "Actif" : "Expiré"}
                  </span>
                </td>
                <td className="px-6 py-4">
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
  );
}
