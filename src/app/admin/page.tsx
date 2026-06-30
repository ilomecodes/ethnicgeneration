"use client";

import Image from "next/image";
import { TrendingUp, Truck, Eye, Star } from "lucide-react";
import {
  stats,
  salesData,
  salesDataPrev,
  months,
  visitData,
  days,
  topProducts,
} from "@/lib/admin-data";

function LineChart({
  data,
  data2,
  labels,
  height = 120,
  color = "#b08a4a",
  color2,
}: {
  data: number[];
  data2?: number[];
  labels: string[];
  height?: number;
  color?: string;
  color2?: string;
}) {
  const w = 500;
  const h = height;
  const pad = 8;
  const max = Math.max(...data, ...(data2 ?? []));

  const toX = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const toY = (v: number) => h - pad - (v / max) * (h - pad * 2);

  const path = (d: number[]) =>
    d.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad} x2={w - pad}
            y1={toY(max * t).toFixed(1)} y2={toY(max * t).toFixed(1)}
            stroke="#e8d9bd" strokeWidth="1"
          />
        ))}
        <path
          d={`${path(data)} L${toX(data.length - 1)},${h - pad} L${toX(0)},${h - pad} Z`}
          fill={color} opacity="0.1"
        />
        {data2 && (
          <path d={path(data2)} fill="none" stroke={color2 ?? "#d9b89a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
        <path d={path(data)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {labels.map((l) => (
          <span key={l} className="text-xs" style={{ color: "#b08a4a99" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

const statCards = [
  {
    label: "Ventes",
    value: stats.sales.value,
    change: stats.sales.change,
    positive: stats.sales.positive,
    icon: TrendingUp,
    color: "#b08a4a",
    bg: "#fdf5e8",
  },
  {
    label: "Livraisons",
    value: stats.deliveries.value,
    change: stats.deliveries.change,
    positive: stats.deliveries.positive,
    icon: Truck,
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    label: "Visites site",
    value: stats.visits.value,
    change: stats.visits.change,
    positive: stats.visits.positive,
    icon: Eye,
    color: "#3f2417",
    bg: "#f0ebe0",
  },
  {
    label: "Top produit",
    value: stats.topProduct.name,
    change: `${stats.topProduct.sales} ventes`,
    positive: true,
    icon: Star,
    color: "#b08a4a",
    bg: "#fdf5e8",
    small: true,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#14110d" }}>
          Bonjour, <span style={{ color: "#b08a4a" }}>Admin</span>
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
          Voici un aperçu de votre boutique aujourd&apos;hui.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: card.positive ? "#059669" : "#DC2626",
                  background: card.positive ? "#ECFDF5" : "#FEF2F2",
                }}
              >
                {card.change}
              </span>
            </div>
            <p className={`font-bold leading-tight ${card.small ? "text-sm" : "text-2xl"}`} style={{ color: "#14110d" }}>
              {card.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#b08a4a99" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#14110d" }}>Statistiques des ventes</h2>
            <div className="flex items-center gap-4 text-xs" style={{ color: "#b08a4a99" }}>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 rounded" style={{ background: "#b08a4a" }} />
                Cette année
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 rounded" style={{ background: "#d9b89a" }} />
                Année précédente
              </span>
            </div>
          </div>
          <LineChart data={salesData} data2={salesDataPrev} labels={months} height={140} color="#b08a4a" color2="#d9b89a" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#14110d" }}>Meilleures ventes</h2>
            <a href="/admin/catalog/products" className="text-xs font-medium" style={{ color: "#b08a4a" }}>
              Voir tout →
            </a>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs w-4 font-medium" style={{ color: "#e8d9bd" }}>{i + 1}</span>
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
                  <Image src={p.image} alt={p.name} width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#14110d" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "#b08a4a" }}>{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visitors chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: "#14110d" }}>Visiteurs uniques</h2>
          <span className="text-xs px-3 py-1 rounded-lg" style={{ background: "#f0ebe0", color: "#b08a4a" }}>Hebdomadaire</span>
        </div>
        <LineChart data={visitData} labels={days} height={110} color="#3f2417" />
      </div>
    </div>
  );
}
