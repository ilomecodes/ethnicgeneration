"use client";

import Link from "next/link";
import { ShoppingBag, Scissors, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { myOrders, mySurMesure, statusColors } from "@/lib/client-data";

export default function ComptePage() {
  const { user } = useAuth();
  if (!user) return null;

  const recentOrders = myOrders.slice(0, 2);
  const recentSM = mySurMesure.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#b08a4a" }}>
          Bonjour
        </p>
        <h1 className="font-[family-name:var(--font-display)] italic text-3xl font-light" style={{ color: "#14110d" }}>
          {user.name}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#b08a4a99" }}>
          Voici un aperçu de vos commandes et créations en cours.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#fdf5e8" }}>
            <ShoppingBag size={20} style={{ color: "#b08a4a" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#14110d" }}>{myOrders.length}</p>
            <p className="text-xs" style={{ color: "#b08a4a99" }}>Commandes</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#fdf5e8" }}>
            <Scissors size={20} style={{ color: "#b08a4a" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#14110d" }}>{mySurMesure.length}</p>
            <p className="text-xs" style={{ color: "#b08a4a99" }}>Sur Mesure</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#f0ebe0" }}>
          <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Commandes récentes</h2>
          <Link href="/compte/commandes" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#b08a4a" }}>
            Tout voir <ChevronRight size={13} />
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: "#f0ebe0" }}>
          {recentOrders.map((o) => {
            const sc = statusColors[o.status] ?? { bg: "#f3f4f6", color: "#6B7280" };
            return (
              <Link
                key={o.id}
                href={`/compte/commandes/${o.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#fdf9f4] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
                  <img src={o.image} alt={o.product} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#14110d" }}>{o.product}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>#{o.id} · {o.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-semibold" style={{ color: "#14110d" }}>{o.amount}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                    {o.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent sur mesure */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#f0ebe0" }}>
          <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Sur Mesure en cours</h2>
          <Link href="/compte/sur-mesure" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#b08a4a" }}>
            Tout voir <ChevronRight size={13} />
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: "#f0ebe0" }}>
          {recentSM.map((sm) => {
            const sc = statusColors[sm.status] ?? { bg: "#f3f4f6", color: "#6B7280" };
            const doneCount = sm.pipeline.filter((p) => p.done).length;
            return (
              <Link
                key={sm.id}
                href={`/compte/sur-mesure/${sm.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#fdf9f4] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fdf5e8" }}>
                  <Scissors size={18} style={{ color: "#b08a4a" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#14110d" }}>{sm.piece} — {sm.wax}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>
                    #{sm.id} · Livraison prévue {sm.deadline}
                  </p>
                  {/* Mini progress */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {sm.pipeline.map((step, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full"
                        style={{ background: step.done ? "#b08a4a" : "#e8d9bd" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                    {sm.status}
                  </span>
                  <span className="text-xs" style={{ color: "#b08a4a99" }}>
                    {doneCount}/{sm.pipeline.length} étapes
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
