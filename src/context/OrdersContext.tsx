"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { orderDetails, orderMeta, orders as seedOrders, OrderFulfillment } from "@/lib/admin-data";

type BaseDetail = typeof orderDetails[string];

export type EnhancedDetail = BaseDetail & {
  paymentMethod: string;
  fulfillmentType: OrderFulfillment;
};

type OrderSummary = {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: string;
  status: string;
};

interface OrdersContextType {
  details: Record<string, EnhancedDetail>;
  orderList: OrderSummary[];
  advanceStep: (orderId: string, stepIndex: number) => void;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

function buildSeed(): Record<string, EnhancedDetail> {
  return Object.fromEntries(
    Object.entries(orderDetails).map(([id, d]) => [
      id,
      {
        ...d,
        paymentMethod: orderMeta[id]?.paymentMethod ?? "Non renseigné",
        fulfillmentType: orderMeta[id]?.fulfillmentType ?? "livraison",
      },
    ])
  );
}

function formatNow(): string {
  const now = new Date();
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  return `${now.getDate()} ${months[now.getMonth()]} · ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
}

function deriveStatus(timeline: { label: string; date: string; done: boolean }[]): string {
  const lastDone = [...timeline].reverse().find((s) => s.done);
  if (!lastDone) return "En cours";
  const l = lastDone.label.toLowerCase();
  if (l.includes("livré") || l.includes("récupéré")) return "Livré";
  if (l.includes("expédié") || l.includes("prêt à")) return "Expédié";
  if (l.includes("annulé")) return "Annulé";
  return "En cours";
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<Record<string, EnhancedDetail>>(buildSeed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eg_orders");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, EnhancedDetail>;
        // merge any seed entries missing from localStorage
        const seedData = buildSeed();
        const merged = { ...seedData, ...parsed };
        setDetails(merged);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const persist = (next: Record<string, EnhancedDetail>) => {
    if (hydrated) localStorage.setItem("eg_orders", JSON.stringify(next));
    setDetails(next);
  };

  const advanceStep = (orderId: string, stepIndex: number) => {
    const detail = details[orderId];
    if (!detail) return;
    const newTimeline = detail.timeline.map((s, i) =>
      i === stepIndex ? { ...s, done: true, date: formatNow() } : s
    );
    const newStatus = deriveStatus(newTimeline);
    persist({ ...details, [orderId]: { ...detail, timeline: newTimeline, status: newStatus } });
  };

  const orderList: OrderSummary[] = seedOrders.map((o) => ({
    ...o,
    status: details[o.id]?.status ?? o.status,
  }));

  return (
    <OrdersContext.Provider value={{ details, orderList, advanceStep }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider");
  return ctx;
}
