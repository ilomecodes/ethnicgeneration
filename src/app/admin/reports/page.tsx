"use client";

import { TrendingUp, TrendingDown, Package, Users, Truck, Eye } from "lucide-react";
import { salesData, salesDataPrev, months, visitData, days } from "@/lib/admin-data";

function MiniLineChart({
  data,
  color,
  height = 60,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const w = 200;
  const h = height;
  const pad = 4;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const toX = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const toY = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2);

  const path = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <path
        d={`${path} L${toX(data.length - 1)},${h} L${toX(0)},${h} Z`}
        fill={color}
        opacity="0.1"
      />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const reportCards = [
  { label: "Chiffre d'affaires", value: "12 890 €", change: "+6.9%", positive: true, icon: TrendingUp, color: "#b08a4a", data: salesData },
  { label: "Commandes livrées", value: "1 243", change: "+3.1%", positive: true, icon: Truck, color: "#059669", data: visitData.map(v => Math.floor(v / 20)) },
  { label: "Nouveaux clients", value: "318", change: "-2.4%", positive: false, icon: Users, color: "#DC2626", data: [28, 32, 25, 30, 27, 35, 22] },
  { label: "Produits vendus", value: "2 847", change: "+11.2%", positive: true, icon: Package, color: "#D97706", data: salesData.map(v => v * 3) },
  { label: "Visites uniques", value: "23 789", change: "+4.7%", positive: true, icon: Eye, color: "#0EA5E9", data: visitData },
  { label: "Taux conversion", value: "3.2%", change: "+0.4%", positive: true, icon: TrendingUp, color: "#7C3AED", data: [2.1, 2.4, 2.8, 2.6, 3.0, 3.1, 3.2] },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Rapports</h1>
        <p className="text-sm text-gray-400 mt-0.5">Performances globales — Juin 2026</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-5">
        {reportCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <card.icon size={15} style={{ color: card.color }} />
                <span className="text-xs text-gray-400">{card.label}</span>
              </div>
              <span
                className="text-xs font-medium flex items-center gap-0.5"
                style={{ color: card.positive ? "#059669" : "#DC2626" }}
              >
                {card.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-3">{card.value}</p>
            <MiniLineChart data={card.data} color={card.color} />
          </div>
        ))}
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-5">Ventes mensuelles — comparaison annuelle</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-xs font-medium text-gray-400 py-3">Mois</th>
                {months.map((m) => (
                  <th key={m} className="text-center text-xs font-medium text-gray-400 py-3">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-3 text-xs font-medium" style={{ color: "#b08a4a" }}>2026</td>
                {salesData.map((v, i) => (
                  <td key={i} className="py-3 text-center text-xs text-gray-600">{v}K€</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs font-medium text-gray-400">2025</td>
                {salesDataPrev.map((v, i) => (
                  <td key={i} className="py-3 text-center text-xs text-gray-400">{v}K€</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-xs font-medium text-green-600">Δ</td>
                {salesData.map((v, i) => {
                  const delta = v - salesDataPrev[i];
                  const pct = Math.round((delta / salesDataPrev[i]) * 100);
                  return (
                    <td key={i} className="py-3 text-center">
                      <span
                        className="text-xs font-medium"
                        style={{ color: delta >= 0 ? "#059669" : "#DC2626" }}
                      >
                        {delta >= 0 ? "+" : ""}{pct}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
