"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, CheckCircle, Circle, ChevronDown, Scissors, AlertCircle } from "lucide-react";
import { surMesureRequests } from "@/lib/admin-data";

const STATUS_PIPELINE = [
  "Demande reçue", "Devis envoyé", "Acompte reçu",
  "En production", "Prêt à expédier", "Livré",
];

const statusColor: Record<string, { bg: string; text: string }> = {
  "Demande reçue":   { bg: "#F4F3FF", text: "#6B7280" },
  "Devis envoyé":    { bg: "#fdf5e8", text: "#b08a4a" },
  "Acompte reçu":    { bg: "#FEF3C7", text: "#D97706" },
  "En production":   { bg: "#ECFDF5", text: "#059669" },
  "Prêt à expédier": { bg: "#F0F9FF", text: "#0EA5E9" },
  "Livré":           { bg: "#f0ebe0", text: "#3f2417" },
  "Annulée":         { bg: "#FEF2F2", text: "#DC2626" },
};

function DetailRow({ label, value }: { label: string; value?: string | boolean }) {
  const display = value === true ? "Oui" : value === false ? "Non" : value || "—";
  return (
    <div className="flex justify-between items-start py-2.5 border-b" style={{ borderColor: "#f0ebe0" }}>
      <span className="text-xs font-semibold mr-3" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>{label}</span>
      <span className="text-sm text-right max-w-[60%]" style={{ color: "#14110d" }}>{display}</span>
    </div>
  );
}

export default function SurMesureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const req = surMesureRequests.find((r) => r.id === id);

  if (!req) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-400">Demande introuvable.</p>
        <button onClick={() => router.back()} className="text-sm font-medium" style={{ color: "#b08a4a" }}>
          ← Retour
        </button>
      </div>
    );
  }

  const sc = statusColor[req.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
  const currentStepIndex = STATUS_PIPELINE.indexOf(req.status);

  return (
    <div className="max-w-5xl mx-auto space-y-5 md:space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} className="text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-semibold" style={{ color: "#14110d" }}>#{req.id}</h1>
              <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                {req.status}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>{req.customer} · {req.date}</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <span className="hidden sm:inline">Changer le statut</span>
          <span className="sm:hidden">Statut</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <h2 className="font-semibold text-sm mb-4 md:mb-5" style={{ color: "#14110d" }}>Avancement de la commande</h2>
        <div className="overflow-x-auto">
          <div className="flex items-center gap-0 min-w-[400px]">
            {STATUS_PIPELINE.map((status, i) => {
              const done = i < currentStepIndex;
              const active = i === currentStepIndex;
              const sc2 = statusColor[status] ?? { bg: "#F3F4F6", text: "#6B7280" };
              return (
                <div key={status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: done ? "#b08a4a" : active ? "#14110d" : "transparent",
                        border: done || active ? "none" : "1.5px solid #e8d9bd",
                      }}
                    >
                      {done
                        ? <CheckCircle size={14} color="#fff" />
                        : active
                          ? <Scissors size={12} color="#f6f1e6" />
                          : <Circle size={12} color="#e8d9bd" />
                      }
                    </div>
                    <span
                      className="text-[8px] md:text-[9px] font-semibold text-center leading-tight max-w-[56px] md:max-w-[72px]"
                      style={{ color: active ? "#14110d" : done ? "#b08a4a" : "#d9b89a", fontFamily: "var(--font-nav)" }}
                    >
                      {status}
                    </span>
                  </div>
                  {i < STATUS_PIPELINE.length - 1 && (
                    <div className="flex-1 h-px mx-1 mb-5 transition-all" style={{ background: done ? "#b08a4a" : "#e8d9bd" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Left — garment details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-5">

          {/* Garment specs */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b" style={{ borderColor: "#f0ebe0" }}>
              <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Spécifications de la pièce</h2>
            </div>
            <div className="px-4 md:px-6 py-4 space-y-0">
              <DetailRow label="Type de pièce" value={req.piece} />
              <DetailRow label="Tissu wax" value={req.wax} />
              <DetailRow label="Silhouette / modèle" value={req.silhouette} />
              {req.inspirationImage && (
                <div className="py-3 border-b" style={{ borderColor: "#f0ebe0" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>Image d&apos;inspiration</p>
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl flex items-center justify-center text-xs text-gray-400" style={{ background: "#f0ebe0" }}>
                    Image importée
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b" style={{ borderColor: "#f0ebe0" }}>
              <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Mesures</h2>
            </div>
            <div className="px-4 md:px-6 py-4">
              {req.noMeasurements ? (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#fdf5e8" }}>
                  <AlertCircle size={16} style={{ color: "#b08a4a" }} />
                  <p className="text-sm" style={{ color: "#b08a4a" }}>
                    La cliente préfère être mesurée en atelier. Rendez-vous à planifier.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {Object.entries(req.measurements).map(([key, val]) => {
                    const labels: Record<string, string> = {
                      poitrine: "Poitrine", taille: "Taille", hanches: "Hanches",
                      hauteur: "Hauteur", longueurPiece: "Longueur pièce", epaules: "Épaules",
                      longueurManches: "Longueur manches", tourBras: "Tour de bras",
                    };
                    return (
                      <div key={key} className="text-center p-3 rounded-xl" style={{ background: "#f0ebe0" }}>
                        <p className="text-base md:text-lg font-bold" style={{ color: "#14110d" }}>{val} <span className="text-xs font-normal">cm</span></p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>{labels[key] ?? key}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Finitions */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b" style={{ borderColor: "#f0ebe0" }}>
              <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Finitions choisies</h2>
            </div>
            <div className="px-4 md:px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <DetailRow label="Type de col" value={req.col} />
                  <DetailRow label="Manches" value={req.manches} />
                  <DetailRow label="Doublure" value={req.doublure} />
                </div>
                <div>
                  <DetailRow label="Boutons" value={req.boutons} />
                  {"typeBouton" in req && req.boutons && (
                    <DetailRow label="Type de bouton" value={(req as { typeBouton?: string }).typeBouton} />
                  )}
                  <DetailRow label="Poches" value={req.poches} />
                </div>
              </div>
            </div>
          </div>

          {req.note && (
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
              <h2 className="font-semibold text-sm mb-3" style={{ color: "#14110d" }}>Note de la cliente</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280", fontStyle: "italic" }}>« {req.note} »</p>
            </div>
          )}
        </div>

        {/* Right — client + financials */}
        <div className="space-y-4 md:space-y-5">
          {/* Client */}
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Cliente</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" style={{ background: "#b08a4a" }}>
                {req.customer.charAt(0)}
              </div>
              <p className="font-semibold text-sm" style={{ color: "#14110d" }}>{req.customer}</p>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <Mail size={13} className="flex-shrink-0" style={{ color: "#b08a4a" }} />
                <span className="break-all" style={{ color: "#6B7280" }}>{req.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={13} className="flex-shrink-0" style={{ color: "#b08a4a" }} />
                <span style={{ color: "#6B7280" }}>{req.phone}</span>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="rounded-2xl p-4 md:p-5" style={{ background: "#fdf5e8" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>
              Suivi financier
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: "#6B7280" }}>Devis total</span>
                <span className="font-bold text-sm" style={{ color: "#14110d" }}>{req.devis ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: "#6B7280" }}>Acompte (50%)</span>
                <span className="font-semibold text-sm" style={{ color: "#14110d" }}>{req.acompte ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "#e8d9bd" }}>
                <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>Acompte reçu</span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={req.acomptePaid ? { background: "#ECFDF5", color: "#059669" } : { background: "#FEF2F2", color: "#DC2626" }}
                >
                  {req.acomptePaid ? "Confirmé" : "En attente"}
                </span>
              </div>
              {req.deadline && (
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "#6B7280" }}>Date limite</span>
                  <span className="text-xs font-semibold" style={{ color: "#14110d" }}>{req.deadline}</span>
                </div>
              )}
            </div>
            {!req.devis && (
              <button
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: "#b08a4a", color: "#fff", fontFamily: "var(--font-nav)" }}
              >
                Envoyer un devis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
