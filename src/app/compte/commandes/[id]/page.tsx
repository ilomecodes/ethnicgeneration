"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle, Package, Truck, MapPin } from "lucide-react";
import { myOrders, statusColors } from "@/lib/client-data";

export default function CommandeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const order = myOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-sm" style={{ color: "#b08a4a99" }}>Commande introuvable.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm font-medium" style={{ color: "#b08a4a" }}>
          Retour
        </button>
      </div>
    );
  }

  const sc = statusColors[order.status] ?? { bg: "#f3f4f6", color: "#6B7280" };
  const lastDone = [...order.timeline].reverse().find((t) => t.done);

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#b08a4a" }}>
          <ArrowLeft size={15} /> Retour
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#14110d" }}>#{order.id}</h1>
          <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>Passée le {order.date}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
          {order.status}
        </span>
      </div>

      {/* Product */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
          <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-semibold" style={{ color: "#14110d" }}>{order.product}</p>
          <p className="text-sm mt-1" style={{ color: "#b08a4a99" }}>Taille : {order.size} · Qté : {order.qty}</p>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#b08a4a99" }}>
            <span>Sous-total : <strong style={{ color: "#14110d" }}>{order.subtotal}</strong></span>
            <span>Livraison : <strong style={{ color: "#14110d" }}>{order.shippingCost}</strong></span>
          </div>
        </div>
        <p className="text-xl font-bold flex-shrink-0" style={{ color: "#14110d" }}>{order.amount}</p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-sm mb-5" style={{ color: "#14110d" }}>Suivi de commande</h2>
        <div className="space-y-0">
          {order.timeline.map((step, i) => {
            const isLast = i === order.timeline.length - 1;
            const isDone = step.done;
            const isActive = isDone && (isLast || !order.timeline[i + 1]?.done);
            return (
              <div key={i} className="flex gap-4">
                {/* Icon + line */}
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 mt-0.5">
                    {isDone
                      ? <CheckCircle size={20} style={{ color: "#b08a4a" }} />
                      : <Circle size={20} style={{ color: "#e8d9bd" }} />
                    }
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 my-1" style={{ background: isDone && order.timeline[i + 1]?.done ? "#b08a4a" : "#e8d9bd", minHeight: "24px" }} />
                  )}
                </div>
                {/* Text */}
                <div className="pb-5 flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: isDone ? "#14110d" : "#9CA3AF" }}
                  >
                    {step.label}
                    {isActive && (
                      <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fdf5e8", color: "#b08a4a" }}>
                        En cours
                      </span>
                    )}
                  </p>
                  {step.date && (
                    <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>{step.date}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Informations de livraison</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#fdf5e8" }}>
              <Truck size={16} style={{ color: "#b08a4a" }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#14110d" }}>{order.shipping.carrier}</p>
              <p className="text-xs" style={{ color: "#b08a4a99" }}>N° de suivi : {order.shipping.tracking}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#fdf5e8" }}>
              <MapPin size={16} style={{ color: "#b08a4a" }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#14110d" }}>Adresse de livraison</p>
              <p className="text-xs" style={{ color: "#b08a4a99" }}>{order.shipping.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#fdf5e8" }}>
              <Package size={16} style={{ color: "#b08a4a" }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#14110d" }}>Statut actuel</p>
              <p className="text-xs" style={{ color: "#b08a4a99" }}>{lastDone?.label} — {lastDone?.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
