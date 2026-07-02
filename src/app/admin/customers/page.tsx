"use client";

import { useState } from "react";
import { Search, Eye, MapPin, ShoppingBag } from "lucide-react";
import { customers } from "@/lib/admin-data";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = customers.reduce(
    (sum, c) => sum + parseInt(c.spent.replace(/[^\d]/g, ""), 10),
    0
  );
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Clients</h1>
        <p className="text-sm text-gray-400 mt-0.5">Tous les clients ayant effectué un achat</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-gray-800">{customers.length}</p>
          <p className="text-xs text-gray-400 mt-1">Clients enregistrés</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-gray-800">{totalOrders}</p>
          <p className="text-xs text-gray-400 mt-1">Commandes passées</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{totalSpent.toLocaleString("fr-FR")} FCFA</p>
          <p className="text-xs text-gray-400 mt-1">Chiffre d&apos;affaires total</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm max-w-sm">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="text-sm text-gray-700 placeholder-gray-400 outline-none flex-1 bg-transparent min-w-0"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-50">
                {["Client", "Email", "Commandes", "Total dépensé", "Pays", "Membre depuis", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 md:px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                        style={{ background: "#b08a4a" }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{c.email}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <ShoppingBag size={13} className="text-gray-400" />
                      {c.orders}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-gray-700">{c.spent}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                      {c.country}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-400">{c.joined}</td>
                  <td className="px-4 md:px-6 py-4">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Eye size={15} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">Aucun client trouvé</div>
        )}
      </div>
    </div>
  );
}
