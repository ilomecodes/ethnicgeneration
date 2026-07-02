"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { myOrders, statusColors } from "@/lib/client-data";
import { useOrders } from "@/context/OrdersContext";

export default function MesCommandesPage() {
  const { details } = useOrders();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#14110d" }}>Mes commandes</h1>
        <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
          {myOrders.length} commande{myOrders.length > 1 ? "s" : ""} au total
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y" style={{ borderColor: "#f0ebe0" }}>
          {myOrders.map((o) => {
            const liveDetail = details[o.id];
            const liveStatus = liveDetail?.status ?? o.status;
            const liveTimeline = liveDetail?.timeline ?? o.timeline;
            const sc = statusColors[liveStatus] ?? { bg: "#f3f4f6", color: "#6B7280" };
            const done = liveTimeline.filter((t) => t.done).length;
            const total = liveTimeline.length;
            const lastDoneLabel = [...liveTimeline].reverse().find((t) => t.done)?.label ?? "";
            return (
              <Link
                key={o.id}
                href={`/compte/commandes/${o.id}`}
                className="flex items-center gap-5 px-6 py-5 hover:bg-[#fdf9f4] transition-colors group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
                  <img src={o.image} alt={o.product} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "#14110d" }}>{o.product}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>
                    #{o.id} · Taille {o.size} · Qté {o.qty} · {o.date}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {liveTimeline.map((step, i) => (
                      <div
                        key={i}
                        title={step.label}
                        className="flex-1 h-1 rounded-full"
                        style={{ background: step.done ? "#b08a4a" : "#e8d9bd" }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: "#b08a4a99" }}>
                    {done}/{total} étapes · {lastDoneLabel}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-bold text-sm" style={{ color: "#14110d" }}>{o.amount}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                    {liveStatus}
                  </span>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 text-gray-300 group-hover:text-[#b08a4a] transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
