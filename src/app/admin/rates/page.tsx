"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Truck } from "lucide-react";
import { deliveryRates } from "@/lib/admin-data";

const zoneColors: Record<string, { bg: string; text: string }> = {
  "France métropolitaine": { bg: "#fdf5e8", text: "#b08a4a" },
  "Europe":                { bg: "#ECFDF5", text: "#059669" },
  "International":         { bg: "#FEF3C7", text: "#D97706" },
};

export default function RatesPage() {
  const [rates] = useState(deliveryRates);
  const zones = [...new Set(rates.map((r) => r.zone))];

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Tarifs de livraison</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configurez vos zones et tarifs de livraison</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Ajouter un tarif</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Zone cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        {zones.map((zone) => {
          const zr = rates.filter((r) => r.zone === zone);
          const sc = zoneColors[zone] ?? { bg: "#F3F4F6", text: "#6B7280" };
          return (
            <div key={zone} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: sc.bg }}
                >
                  <Truck size={17} style={{ color: sc.text }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{zone}</p>
                  <p className="text-xs text-gray-400">{zr.length} tarifs</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                De {zr[0]?.price} à {zr[zr.length - 1]?.price}
              </p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-50">
                {["Zone", "Transporteur", "Poids min (kg)", "Poids max (kg)", "Prix", "Délai", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 md:px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rates.map((rate) => {
                const sc = zoneColors[rate.zone] ?? { bg: "#F3F4F6", text: "#6B7280" };
                return (
                  <tr key={rate.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ background: sc.bg, color: sc.text }}
                      >
                        {rate.zone}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-700 font-medium whitespace-nowrap">{rate.carrier}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{rate.minWeight}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{rate.maxWeight}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-bold text-gray-800">{rate.price}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{rate.delay}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Edit2 size={14} className="text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
