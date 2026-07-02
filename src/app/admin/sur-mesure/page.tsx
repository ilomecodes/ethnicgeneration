"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Scissors } from "lucide-react";
import { surMesureRequests } from "@/lib/admin-data";
import { useSurMesure, PIPELINE_STEPS } from "@/context/SurMesureContext";

const STATUS_PIPELINE = PIPELINE_STEPS;

const statusColor: Record<string, { bg: string; text: string }> = {
  "Demande reçue":   { bg: "#F4F3FF", text: "#6B7280" },
  "Devis envoyé":    { bg: "#fdf5e8", text: "#b08a4a" },
  "Acompte reçu":    { bg: "#FEF3C7", text: "#D97706" },
  "En production":   { bg: "#ECFDF5", text: "#059669" },
  "Prêt à expédier": { bg: "#F0F9FF", text: "#0EA5E9" },
  "Livré":           { bg: "#f0ebe0", text: "#3f2417" },
  "Annulée":         { bg: "#FEF2F2", text: "#DC2626" },
};

export default function SurMesureAdminPage() {
  const router = useRouter();
  const { liveData } = useSurMesure();
  const [filter, setFilter] = useState("Tous");

  const filtered = surMesureRequests.filter((r) => {
    const liveStatus = liveData[r.id]?.status ?? r.status;
    return filter === "Tous" || liveStatus === filter;
  });

  const counts = STATUS_PIPELINE.reduce<Record<string, number>>((acc, s) => {
    acc[s] = surMesureRequests.filter((r) => (liveData[r.id]?.status ?? r.status) === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold" style={{ color: "#14110d" }}>Sur Mesure</h1>
        <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
          {surMesureRequests.length} demandes au total
        </p>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
        {STATUS_PIPELINE.map((status) => {
          const sc = statusColor[status] ?? { bg: "#F3F4F6", text: "#6B7280" };
          return (
            <div key={status} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm">
              <p className="text-xl md:text-2xl font-bold" style={{ color: "#14110d" }}>{counts[status] ?? 0}</p>
              <span
                className="inline-block mt-1.5 text-[9px] md:text-[10px] font-semibold px-1.5 md:px-2 py-0.5 rounded-full leading-tight"
                style={{ background: sc.bg, color: sc.text }}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {["Tous", ...STATUS_PIPELINE].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={
              filter === s
                ? { background: "#14110d", color: "#f6f1e6" }
                : { background: "#fff", color: "#6B7280" }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-50">
                {["Réf.", "Cliente", "Pièce", "Tissu", "Date", "Devis", "Statut", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 md:px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((req) => {
                const liveStatus = liveData[req.id]?.status ?? req.status;
                const liveDevis = liveData[req.id]?.devis ?? req.devis;
                const sc = statusColor[liveStatus] ?? { bg: "#F3F4F6", text: "#6B7280" };
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/sur-mesure/${req.id}`)}
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#fdf5e8" }}>
                          <Scissors size={12} style={{ color: "#b08a4a" }} />
                        </div>
                        <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "#14110d" }}>#{req.id}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0" style={{ background: "#b08a4a" }}>
                          {req.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap" style={{ color: "#14110d" }}>{req.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{req.piece}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{req.wax}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{req.date}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-semibold whitespace-nowrap" style={{ color: "#b08a4a" }}>
                      {liveDevis ?? <span className="text-gray-300 font-normal">—</span>}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: sc.bg, color: sc.text }}>
                        {liveStatus}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/sur-mesure/${req.id}`); }}
                      >
                        <Eye size={15} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">Aucune demande dans cette catégorie</div>
        )}
      </div>
    </div>
  );
}
