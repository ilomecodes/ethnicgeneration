"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Eye } from "lucide-react";
import { orders } from "@/lib/admin-data";

const statusColors: Record<string, { bg: string; text: string }> = {
  Livré:     { bg: "#ECFDF5", text: "#059669" },
  "En cours": { bg: "#fdf5e8", text: "#b08a4a" },
  Expédié:   { bg: "#F0F9FF", text: "#0EA5E9" },
  Annulé:    { bg: "#FEF2F2", text: "#DC2626" },
};

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");

  const statuses = ["Tous", "En cours", "Expédié", "Livré", "Annulé"];

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Commandes</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders.length} commandes au total</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm flex-1 max-w-xs">
          <Search size={15} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande..."
            className="text-sm text-gray-700 placeholder-gray-400 outline-none flex-1 bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={
                filter === s
                  ? { background: "#b08a4a", color: "#fff" }
                  : { background: "#fff", color: "#6B7280" }
              }
            >
              {s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm text-sm text-gray-500 ml-auto">
          <Filter size={14} />
          Filtres avancés
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Commande", "Client", "Produit", "Date", "Montant", "Statut", "Action"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-400 px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order) => {
              const sc = statusColors[order.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[160px] truncate">{order.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders/${order.id}`); }}
                    >
                      <Eye size={15} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">Aucune commande trouvée</div>
        )}
      </div>
    </div>
  );
}
