"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle, Circle, Printer, ChevronDown } from "lucide-react";
import { orderDetails, orders } from "@/lib/admin-data";

const statusColors: Record<string, { bg: string; text: string }> = {
  Livré:      { bg: "#ECFDF5", text: "#059669" },
  "En cours": { bg: "#fdf5e8", text: "#b08a4a" },
  Expédié:    { bg: "#F0F9FF", text: "#0EA5E9" },
  Annulé:     { bg: "#FEF2F2", text: "#DC2626" },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const order = orders.find((o) => o.id === id);
  const detail = orderDetails[id];

  if (!order || !detail) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-400">Commande introuvable.</p>
        <button onClick={() => router.back()} className="text-sm font-medium" style={{ color: "#b08a4a" }}>
          ← Retour aux commandes
        </button>
      </div>
    );
  }

  const sc = statusColors[detail.status] ?? { bg: "#F3F4F6", text: "#6B7280" };

  return (
    <div className="space-y-5 md:space-y-6 max-w-5xl mx-auto">
      {/* Back + header */}
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold" style={{ color: "#14110d" }}>
              #{order.id}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>{detail.date}</p>
          </div>
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: sc.bg, color: sc.text }}
          >
            {detail.status}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white shadow-sm text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer size={14} />
            <span className="hidden sm:inline">Imprimer</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "#b08a4a" }}
          >
            <span className="hidden sm:inline">Changer le statut</span>
            <span className="sm:hidden">Statut</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Left column — items + summary */}
        <div className="lg:col-span-2 space-y-4 md:space-y-5">

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Articles commandés</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {detail.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
                    <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "#14110d" }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>
                      Taille : {item.size} · Qté : {item.qty}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm" style={{ color: "#14110d" }}>{item.total}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>
                      {item.qty > 1 ? `${item.unitPrice} / unité` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-4 md:px-6 py-4 border-t" style={{ borderColor: "#f0ebe0" }}>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Sous-total</span>
                  <span>{detail.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Livraison</span>
                  <span>{detail.shipping}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: "#f0ebe0", color: "#14110d" }}>
                  <span>Total</span>
                  <span style={{ color: "#b08a4a" }}>{detail.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h2 className="font-semibold text-sm mb-5" style={{ color: "#14110d" }}>Suivi de la commande</h2>
            <div className="space-y-0">
              {detail.timeline.map((step, i) => {
                const isLast = i === detail.timeline.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {step.done ? (
                        <CheckCircle size={20} style={{ color: "#b08a4a" }} className="flex-shrink-0" />
                      ) : (
                        <Circle size={20} className="text-gray-200 flex-shrink-0" />
                      )}
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 my-1"
                          style={{ background: step.done ? "#b08a4a" : "#e8d9bd", minHeight: "24px" }}
                        />
                      )}
                    </div>
                    <div className="pb-5">
                      <p
                        className="text-sm font-medium"
                        style={{ color: step.done ? "#14110d" : "#9CA3AF" }}
                      >
                        {step.label}
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

          {detail.note && (
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
              <h2 className="font-semibold text-sm mb-2" style={{ color: "#14110d" }}>Note client</h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>{detail.note}</p>
            </div>
          )}
        </div>

        {/* Right column — customer info */}
        <div className="space-y-4 md:space-y-5">
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Informations client</h2>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{ background: "#b08a4a" }}
              >
                {detail.customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: "#14110d" }}>{detail.customer.name}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#b08a4a" }} />
                <span className="break-all" style={{ color: "#6B7280" }}>{detail.customer.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#b08a4a" }} />
                <span style={{ color: "#6B7280" }}>{detail.customer.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#b08a4a" }} />
                <span style={{ color: "#6B7280" }}>{detail.customer.address}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 md:p-5" style={{ background: "#fdf5e8" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#b08a4a" }}>
              Résumé
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#6B7280" }}>Référence</span>
                <span className="font-medium" style={{ color: "#14110d" }}>#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#6B7280" }}>Date</span>
                <span className="font-medium" style={{ color: "#14110d" }}>{detail.date}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#6B7280" }}>Statut</span>
                <span className="font-medium px-2 py-0.5 rounded-full text-xs" style={{ background: sc.bg, color: sc.text }}>
                  {detail.status}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#e8d9bd" }}>
                <span className="font-semibold" style={{ color: "#14110d" }}>Total</span>
                <span className="font-bold" style={{ color: "#b08a4a" }}>{detail.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
