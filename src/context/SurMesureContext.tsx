"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { surMesureRequests } from "@/lib/admin-data";

const LS_KEY = "eg_sur_mesure";

export interface SMStep {
  label: string;
  date: string;
  done: boolean;
}

export interface SMLive {
  status: string;
  pipeline: SMStep[];
  acomptePaid: boolean;
  soldePaid: boolean;
  devis: string | null;
  acompte: string | null;
  invoiceGenerated: boolean;
  invoiceDate: string | null;
}

export type SMLiveMap = Record<string, SMLive>;

interface SurMesureCtx {
  liveData: SMLiveMap;
  advanceStep: (id: string, stepIndex: number) => void;
  markPayment: (id: string, type: "acompte" | "solde") => void;
  setDevis: (id: string, amount: string) => void;
  markInvoiceGenerated: (id: string) => void;
}

const Ctx = createContext<SurMesureCtx | null>(null);

export const PIPELINE_STEPS = [
  "Demande reçue",
  "Devis envoyé",
  "Acompte reçu",
  "En production",
  "Essayage / Retouche",
  "Livré",
];

function statusToDoneCount(status: string): number {
  const map: Record<string, number> = {
    "Demande reçue":   1,
    "Devis envoyé":    2,
    "Acompte reçu":    3,
    "En production":   4,
    "Prêt à expédier": 5,
    "Livré":           6,
    "Annulée":         0,
  };
  return map[status] ?? 1;
}

function deriveStatus(pipeline: SMStep[]): string {
  const lastDone = [...pipeline].reverse().find((s) => s.done);
  return lastDone?.label ?? "Demande reçue";
}

function formatNow(): string {
  const d = new Date();
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} · ${h}:${m}`;
}

function buildSeed(): SMLiveMap {
  const map: SMLiveMap = {};
  for (const req of surMesureRequests) {
    const doneCount = statusToDoneCount(req.status);
    const pipeline: SMStep[] = PIPELINE_STEPS.map((label, i) => ({
      label,
      date: i < doneCount ? req.date : "",
      done: i < doneCount,
    }));
    map[req.id] = {
      status: deriveStatus(pipeline),
      pipeline,
      acomptePaid: req.acomptePaid,
      soldePaid: req.status === "Livré",
      devis: req.devis ?? null,
      acompte: req.acompte ?? null,
      invoiceGenerated: false,
      invoiceDate: null,
    };
  }
  return map;
}

export function SurMesureProvider({ children }: { children: ReactNode }) {
  const [liveData, setLiveData] = useState<SMLiveMap>({});

  useEffect(() => {
    const seed = buildSeed();
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SMLiveMap;
        setLiveData({ ...seed, ...parsed });
      } else {
        setLiveData(seed);
      }
    } catch {
      setLiveData(seed);
    }
  }, []);

  const persist = useCallback((next: SMLiveMap) => {
    setLiveData(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const advanceStep = useCallback((id: string, stepIndex: number) => {
    setLiveData((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      const pipeline = entry.pipeline.map((s, i) =>
        i === stepIndex ? { ...s, done: true, date: formatNow() } : s
      );
      const acomptePaid = entry.acomptePaid || stepIndex === 2;
      const next: SMLiveMap = { ...prev, [id]: { ...entry, pipeline, status: deriveStatus(pipeline), acomptePaid } };
      persist(next);
      return next;
    });
  }, [persist]);

  const markPayment = useCallback((id: string, type: "acompte" | "solde") => {
    setLiveData((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      if (type === "acompte") {
        const pipeline = entry.pipeline.map((s, i) =>
          i === 2 && !s.done ? { ...s, done: true, date: formatNow() } : s
        );
        const next: SMLiveMap = { ...prev, [id]: { ...entry, pipeline, status: deriveStatus(pipeline), acomptePaid: true } };
        persist(next);
        return next;
      } else {
        const next: SMLiveMap = { ...prev, [id]: { ...entry, soldePaid: true } };
        persist(next);
        return next;
      }
    });
  }, [persist]);

  const setDevis = useCallback((id: string, amount: string) => {
    setLiveData((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      const devisNum = parseInt(amount.replace(/[^\d]/g, ""), 10);
      const acompteNum = Math.round(devisNum * 0.5);
      const acompte = `${acompteNum.toLocaleString("fr-FR")} FCFA`;
      const pipeline = entry.pipeline.map((s, i) =>
        i === 1 && !s.done ? { ...s, done: true, date: formatNow() } : s
      );
      const next: SMLiveMap = {
        ...prev,
        [id]: { ...entry, pipeline, status: deriveStatus(pipeline), devis: amount, acompte },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const markInvoiceGenerated = useCallback((id: string) => {
    setLiveData((prev) => {
      const entry = prev[id];
      if (!entry) return prev;
      const next: SMLiveMap = { ...prev, [id]: { ...entry, invoiceGenerated: true, invoiceDate: formatNow() } };
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <Ctx.Provider value={{ liveData, advanceStep, markPayment, setDevis, markInvoiceGenerated }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSurMesure() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSurMesure must be used within SurMesureProvider");
  return ctx;
}
