"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle, Scissors, AlertCircle } from "lucide-react";
import { mySurMesure, statusColors } from "@/lib/client-data";
import { useSurMesure } from "@/context/SurMesureContext";

export default function SurMesureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { liveData } = useSurMesure();

  const staticSm = mySurMesure.find((s) => s.id === id);
  const live = liveData[id as string];

  // Use live data from context if available, otherwise fall back to static
  const sm = staticSm ?? null;
  if (!sm && !live) {
    return (
      <div className="text-center py-20">
        <p className="text-sm" style={{ color: "#b08a4a99" }}>Demande introuvable.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm font-medium" style={{ color: "#b08a4a" }}>
          Retour
        </button>
      </div>
    );
  }

  const liveStatus = live?.status ?? sm?.status ?? "";
  const livePipeline = live?.pipeline ?? sm?.pipeline ?? [];
  const liveAcomptePaid = live?.acomptePaid ?? sm?.acomptePaid ?? false;
  const liveDevis = live?.devis ?? sm?.devis ?? "";
  const liveAcompte = live?.acompte ?? sm?.acompte ?? "";

  const sc = statusColors[liveStatus] ?? { bg: "#f3f4f6", color: "#6B7280" };
  const doneCount = livePipeline.filter((p) => p.done).length;

  const specs = sm ? [
    { label: "Pièce",       value: sm.piece },
    { label: "Tissu / Wax", value: sm.wax },
    { label: "Col",         value: sm.col },
    { label: "Manches",     value: sm.manches },
    { label: "Doublure",    value: sm.doublure },
    { label: "Boutons",     value: sm.boutons ? (sm as { typeBouton?: string }).typeBouton ?? "Oui" : "Non" },
    { label: "Poches",      value: sm.poches },
  ] : [];

  return (
    <div className="space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#b08a4a" }}>
        <ArrowLeft size={15} /> Retour
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scissors size={18} style={{ color: "#b08a4a" }} />
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#b08a4a" }}>Sur Mesure</span>
          </div>
          {sm && (
            <h1 className="text-2xl font-semibold" style={{ color: "#14110d" }}>
              {sm.piece} — {sm.wax}
            </h1>
          )}
          <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>#{id} · Demande du {sm?.date ?? ""}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
          {liveStatus}
        </span>
      </div>

      {/* Acompte alert */}
      {!liveAcomptePaid && liveDevis && (
        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "#fef9c3" }}>
          <AlertCircle size={18} style={{ color: "#854d0e" }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#854d0e" }}>Acompte en attente</p>
            <p className="text-xs mt-0.5" style={{ color: "#a16207" }}>
              Un acompte de <strong>{liveAcompte}</strong> est requis pour lancer la production.
              Veuillez contacter notre atelier pour procéder au paiement.
            </p>
          </div>
        </div>
      )}

      {/* Pipeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Avancement de votre création</h2>
          <span className="text-xs" style={{ color: "#b08a4a99" }}>{doneCount}/{livePipeline.length} étapes</span>
        </div>

        <div className="h-2 rounded-full mb-6 overflow-hidden" style={{ background: "#f0ebe0" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${livePipeline.length > 0 ? (doneCount / livePipeline.length) * 100 : 0}%`, background: "#b08a4a" }}
          />
        </div>

        <div className="space-y-0">
          {livePipeline.map((step, i) => {
            const isLast = i === livePipeline.length - 1;
            const isActive = step.done && (isLast || !livePipeline[i + 1]?.done);
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 mt-0.5">
                    {step.done
                      ? <CheckCircle size={20} style={{ color: "#b08a4a" }} />
                      : <Circle size={20} style={{ color: "#e8d9bd" }} />
                    }
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 my-1" style={{ background: step.done && livePipeline[i + 1]?.done ? "#b08a4a" : "#e8d9bd", minHeight: "24px" }} />
                  )}
                </div>
                <div className="pb-5 flex-1">
                  <p className="text-sm font-semibold" style={{ color: step.done ? "#14110d" : "#9CA3AF" }}>
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

      {/* Specs grid */}
      {specs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Détails de la création</h2>
          <div className="grid grid-cols-2 gap-3">
            {specs.map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: "#fdf9f4" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#b08a4a99" }}>{label}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: "#14110d" }}>{value}</p>
              </div>
            ))}
          </div>
          {sm?.note && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: "#fdf9f4" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#b08a4a99" }}>Note</p>
              <p className="text-sm italic" style={{ color: "#14110d" }}>{sm.note}</p>
            </div>
          )}
        </div>
      )}

      {/* Financial summary */}
      {liveDevis && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Devis & paiement</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: "#b08a4a99" }}>Montant total (devis)</span>
              <span className="font-semibold" style={{ color: "#14110d" }}>{liveDevis}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#b08a4a99" }}>Acompte (50%)</span>
              <span className="font-semibold" style={{ color: "#14110d" }}>{liveAcompte}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: "#f0ebe0" }}>
              <span style={{ color: "#b08a4a99" }}>Statut acompte</span>
              {liveAcomptePaid
                ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>✓ Payé</span>
                : <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fef9c3", color: "#854d0e" }}>En attente</span>
              }
            </div>
            {live?.soldePaid && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#b08a4a99" }}>Solde</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>✓ Réglé</span>
              </div>
            )}
            {sm?.deadline && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#b08a4a99" }}>Livraison prévue</span>
                <span className="font-semibold" style={{ color: "#14110d" }}>{sm.deadline}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
