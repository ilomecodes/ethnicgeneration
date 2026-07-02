"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, CheckCircle, Circle, Scissors, AlertCircle,
  FileText, Play, X, Download, Check,
} from "lucide-react";
import { surMesureRequests } from "@/lib/admin-data";
import { useSurMesure, PIPELINE_STEPS } from "@/context/SurMesureContext";

const statusColor: Record<string, { bg: string; text: string }> = {
  "Demande reçue":     { bg: "#F4F3FF", text: "#6B7280" },
  "Devis envoyé":      { bg: "#fdf5e8", text: "#b08a4a" },
  "Acompte reçu":      { bg: "#FEF3C7", text: "#D97706" },
  "En production":     { bg: "#ECFDF5", text: "#059669" },
  "Essayage / Retouche": { bg: "#F0F9FF", text: "#0EA5E9" },
  "Livré":             { bg: "#f0ebe0", text: "#3f2417" },
  "Annulée":           { bg: "#FEF2F2", text: "#DC2626" },
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

function generateInvoiceHTML(req: typeof surMesureRequests[0], devis: string, acompte: string, acomptePaid: boolean, soldePaid: boolean): string {
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const devisNum = parseInt(devis.replace(/[^\d]/g, ""), 10) || 0;
  const acompteNum = parseInt(acompte.replace(/[^\d]/g, ""), 10) || 0;
  const soldeNum = devisNum - acompteNum;
  const soldeLabel = soldePaid ? "✓ Réglé" : `${soldeNum.toLocaleString("fr-FR")} FCFA`;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Facture FAC-${req.id}</title>
<style>
  body{font-family:Georgia,serif;color:#14110d;max-width:760px;margin:0 auto;padding:48px 40px}
  .hd{text-align:center;border-bottom:2px solid #b08a4a;padding-bottom:24px;margin-bottom:32px}
  .brand{font-size:26px;font-weight:bold;letter-spacing:3px}
  .sub{font-size:12px;color:#b08a4a;margin-top:4px}
  .inv{font-size:18px;color:#b08a4a;margin-top:14px;font-weight:600;letter-spacing:1px}
  .meta{display:flex;justify-content:space-between;margin-bottom:32px;font-size:13px}
  .meta-r{text-align:right}
  h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#b08a4a;margin-bottom:10px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px}
  th{background:#f0ebe0;padding:10px 14px;text-align:left;font-weight:600}
  td{padding:12px 14px;border-bottom:1px solid #f0ebe0}
  .tr{font-weight:bold;border-top:2px solid #b08a4a;font-size:15px}
  .ft{margin-top:48px;text-align:center;font-size:11px;color:#aaa;border-top:1px solid #f0ebe0;padding-top:16px}
  @media print{body{padding:24px}}
</style></head><body>
<div class="hd">
  <div class="brand">ETHNICGENERATION</div>
  <div class="sub">Création sur mesure · Boulevard de l'OUA, Yaoundé, Cameroun · contact@ethnicgeneration.com</div>
  <div class="inv">FACTURE</div>
</div>
<div class="meta">
  <div>
    <strong>Référence :</strong> FAC-${req.id}<br>
    <strong>Date :</strong> ${today}<br>
    <strong>Livraison prévue :</strong> ${req.deadline ?? "—"}
  </div>
  <div class="meta-r">
    <strong>${req.customer}</strong><br>
    ${req.phone}<br>
    ${req.email}
  </div>
</div>
<h3>Description de la pièce</h3>
<table>
  <thead><tr><th>Article</th><th>Détails</th><th style="text-align:right">Montant</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>${req.piece}</strong><br><span style="color:#6B7280">${req.wax}</span></td>
      <td style="color:#6B7280">Col : ${req.col} · Manches : ${req.manches}<br>Doublure : ${req.doublure}</td>
      <td style="text-align:right;font-weight:600">${devis}</td>
    </tr>
  </tbody>
</table>
<h3>Récapitulatif financier</h3>
<table>
  <tbody>
    <tr><td>Total devis</td><td style="text-align:right">${devis}</td></tr>
    <tr><td>Acompte (50%) — ${acomptePaid ? "✓ Reçu" : "En attente"}</td><td style="text-align:right">${acompte}</td></tr>
    <tr class="tr"><td>Solde restant</td><td style="text-align:right">${soldeLabel}</td></tr>
  </tbody>
</table>
<div class="ft">Ethnicgeneration · Yaoundé, Cameroun · Merci pour votre confiance !</div>
</body></html>`;
}

export default function SurMesureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { liveData, advanceStep, markPayment, setDevis, markInvoiceGenerated } = useSurMesure();

  const [showInvoice, setShowInvoice] = useState(false);
  const [devisInput, setDevisInput] = useState("");
  const [showDevisForm, setShowDevisForm] = useState(false);

  const req = surMesureRequests.find((r) => r.id === id);
  const live = liveData[id as string];

  if (!req || !live) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-400">Demande introuvable.</p>
        <button onClick={() => router.back()} className="text-sm font-medium" style={{ color: "#b08a4a" }}>
          ← Retour
        </button>
      </div>
    );
  }

  const sc = statusColor[live.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
  const nextStepIndex = live.pipeline.findIndex((s) => !s.done);
  const isComplete = nextStepIndex === -1;

  const devisNum = live.devis ? parseInt(live.devis.replace(/[^\d]/g, ""), 10) : 0;
  const acompteNum = live.acompte ? parseInt(live.acompte.replace(/[^\d]/g, ""), 10) : 0;
  const soldeNum = devisNum - acompteNum;
  const soldeDisplay = `${soldeNum.toLocaleString("fr-FR")} FCFA`;

  function handleAdvanceStep(i: number) {
    if (i === 1 && !live.devis) {
      setShowDevisForm(true);
      return;
    }
    advanceStep(id as string, i);
  }

  function handleSaveDevis() {
    if (!devisInput.trim()) return;
    const formatted = `${parseInt(devisInput.replace(/[^\d]/g, ""), 10).toLocaleString("fr-FR")} FCFA`;
    setDevis(id as string, formatted);
    setDevisInput("");
    setShowDevisForm(false);
  }

  function downloadPDF() {
    if (!live.devis || !live.acompte) return;
    const html = generateInvoiceHTML(req!, live.devis, live.acompte, live.acomptePaid, live.soldePaid);
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
    markInvoiceGenerated(id as string);
  }

  function sendWhatsApp() {
    if (!live.devis || !live.acompte) return;
    const phone = req!.phone.replace(/[^\d+]/g, "");
    const prenom = req!.customer.split(" ")[0];
    const msg = `Bonjour ${prenom},\n\nVoici votre récapitulatif de commande sur mesure Ethnicgeneration :\n\n📌 Réf : FAC-${req!.id}\n👗 Pièce : ${req!.piece} — ${req!.wax}\n\n💰 Montant total : ${live.devis}\n💳 Acompte (50%) : ${live.acompte} — ${live.acomptePaid ? "✓ Reçu" : "En attente"}\n📦 Solde restant : ${live.soldePaid ? "✓ Réglé" : soldeDisplay}\n\nMerci pour votre confiance ! 🙏`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    markInvoiceGenerated(id as string);
  }

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
                {live.status}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>{req.customer} · {req.date}</p>
          </div>
        </div>
        <button
          onClick={() => live.devis ? setShowInvoice(true) : setShowDevisForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ background: "#b08a4a", color: "#fff" }}
        >
          <FileText size={14} />
          <span className="hidden sm:inline">Générer la facture</span>
          <span className="sm:hidden">Facture</span>
        </button>
      </div>

      {/* Interactive pipeline */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-sm" style={{ color: "#14110d" }}>Suivi de la commande</h2>
          {isComplete
            ? <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#ECFDF5", color: "#059669" }}>Terminé</span>
            : <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#fdf5e8", color: "#b08a4a" }}>Action requise</span>
          }
        </div>
        <div className="space-y-0">
          {live.pipeline.map((step, i) => {
            const isLast = i === live.pipeline.length - 1;
            const isNext = i === nextStepIndex;
            const isPaymentStep = step.label === "Acompte reçu";
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {step.done
                    ? <CheckCircle size={20} style={{ color: "#b08a4a" }} className="flex-shrink-0" />
                    : isNext
                      ? <Circle size={20} style={{ color: "#b08a4a" }} className="flex-shrink-0" />
                      : <Circle size={20} className="text-gray-200 flex-shrink-0" />
                  }
                  {!isLast && (
                    <div className="w-0.5 flex-1 my-1" style={{ background: step.done ? "#b08a4a" : "#e8d9bd", minHeight: "28px" }} />
                  )}
                </div>
                <div className="pb-5 flex-1">
                  <p className="text-sm font-medium" style={{ color: step.done || isNext ? "#14110d" : "#9CA3AF" }}>
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>{step.date}</p>
                  )}
                  {isNext && isPaymentStep && !live.acomptePaid && (
                    <button
                      onClick={() => markPayment(id as string, "acompte")}
                      className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                      style={{ background: "#D97706", color: "#fff" }}
                    >
                      <Check size={11} />
                      Confirmer l&apos;acompte reçu
                    </button>
                  )}
                  {isNext && !isPaymentStep && (
                    <button
                      onClick={() => handleAdvanceStep(i)}
                      className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                      style={{ background: "#b08a4a" }}
                    >
                      <Play size={10} fill="white" />
                      Initier cette étape
                    </button>
                  )}
                  {i === 1 && !step.done && !isNext && !live.devis && (
                    <p className="text-xs mt-0.5" style={{ color: "#d1d5db" }}>Définissez d&apos;abord le montant du devis</p>
                  )}
                </div>
              </div>
            );
          })}
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
            <div className="px-4 md:px-6 py-4">
              <DetailRow label="Type de pièce" value={req.piece} />
              <DetailRow label="Tissu wax" value={req.wax} />
              <DetailRow label="Silhouette / modèle" value={req.silhouette} />
              {req.inspirationImage && (
                <div className="py-3 border-b" style={{ borderColor: "#f0ebe0" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>Image d&apos;inspiration</p>
                  <div className="w-28 h-28 rounded-xl flex items-center justify-center text-xs text-gray-400" style={{ background: "#f0ebe0" }}>Image importée</div>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(req.measurements).map(([key, val]) => {
                    const labels: Record<string, string> = {
                      poitrine: "Poitrine", taille: "Taille", hanches: "Hanches",
                      hauteur: "Hauteur", longueurPiece: "Longueur pièce", epaules: "Épaules",
                      longueurManches: "L. manches", tourBras: "Tour de bras",
                    };
                    return (
                      <div key={key} className="text-center p-3 rounded-xl" style={{ background: "#f0ebe0" }}>
                        <p className="text-base font-bold" style={{ color: "#14110d" }}>{val} <span className="text-xs font-normal">cm</span></p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#b08a4a" }}>{labels[key] ?? key}</p>
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

        {/* Right column */}
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
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Suivi financier</h2>
            <div className="space-y-3 text-sm">
              {/* Devis */}
              <div className="flex justify-between items-center">
                <span style={{ color: "#6B7280" }}>Devis total</span>
                {live.devis
                  ? <span className="font-bold" style={{ color: "#14110d" }}>{live.devis}</span>
                  : <button onClick={() => setShowDevisForm(true)} className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: "#fdf5e8", color: "#b08a4a" }}>
                      + Définir
                    </button>
                }
              </div>

              {/* Acompte */}
              {live.acompte && (
                <div className="flex justify-between items-center">
                  <span style={{ color: "#6B7280" }}>Acompte (50%)</span>
                  <span className="font-semibold" style={{ color: "#14110d" }}>{live.acompte}</span>
                </div>
              )}

              {/* Acompte status */}
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "#f0ebe0" }}>
                <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>Acompte reçu</span>
                {live.acomptePaid
                  ? <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#ECFDF5", color: "#059669" }}>✓ Confirmé</span>
                  : live.devis
                    ? <button onClick={() => markPayment(id as string, "acompte")} className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: "#FEF3C7", color: "#D97706" }}>
                        Marquer reçu
                      </button>
                    : <span className="text-xs" style={{ color: "#d1d5db" }}>—</span>
                }
              </div>

              {/* Solde */}
              {live.devis && live.acompte && (
                <div className="flex justify-between items-center">
                  <span style={{ color: "#6B7280" }}>Solde restant</span>
                  {live.soldePaid
                    ? <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#ECFDF5", color: "#059669" }}>✓ Réglé</span>
                    : <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: "#14110d" }}>{soldeDisplay}</span>
                        {live.acomptePaid && (
                          <button onClick={() => markPayment(id as string, "solde")} className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: "#ECFDF5", color: "#059669" }}>
                            Marquer reçu
                          </button>
                        )}
                      </div>
                  }
                </div>
              )}

              {req.deadline && (
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "#f0ebe0" }}>
                  <span style={{ color: "#6B7280" }}>Date limite</span>
                  <span className="font-semibold text-xs" style={{ color: "#14110d" }}>{req.deadline}</span>
                </div>
              )}
            </div>

            {live.devis && (
              <button
                onClick={() => setShowInvoice(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "#b08a4a", color: "#fff" }}
              >
                <FileText size={13} /> Générer la facture
              </button>
            )}
          </div>

          {/* Measurement source */}
          <div className="rounded-2xl p-4" style={{ background: req.noMeasurements ? "#fdf5e8" : "#f0ebe0" }}>
            <div className="flex items-center gap-2 mb-1">
              <Scissors size={13} style={{ color: "#b08a4a" }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#b08a4a" }}>Prise de mesures</p>
            </div>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              {req.noMeasurements
                ? "Rendez-vous en atelier à planifier avec la cliente."
                : "Mesures fournies par la cliente via le formulaire."}
            </p>
          </div>

          {/* Invoice status */}
          {live.invoiceGenerated && (
            <div className="rounded-2xl p-4" style={{ background: "#ECFDF5" }}>
              <p className="text-xs font-semibold" style={{ color: "#059669" }}>✓ Facture générée</p>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{live.invoiceDate}</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice modal */}
      {showInvoice && live.devis && live.acompte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#f0ebe0" }}>
              <p className="font-semibold text-sm" style={{ color: "#14110d" }}>Facture FAC-{req.id}</p>
              <button onClick={() => setShowInvoice(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Invoice preview */}
            <div className="p-6 space-y-5">
              <div className="text-center border-b pb-5" style={{ borderColor: "#f0ebe0" }}>
                <p className="text-lg font-bold tracking-widest" style={{ color: "#14110d" }}>ETHNICGENERATION</p>
                <p className="text-xs mt-1" style={{ color: "#b08a4a" }}>Création sur mesure · Yaoundé, Cameroun</p>
                <p className="text-base font-semibold mt-3" style={{ color: "#b08a4a" }}>FACTURE</p>
              </div>

              <div className="flex justify-between text-xs">
                <div className="space-y-1">
                  <p><span style={{ color: "#b08a4a99" }}>Réf :</span> <strong>FAC-{req.id}</strong></p>
                  <p><span style={{ color: "#b08a4a99" }}>Date :</span> {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold" style={{ color: "#14110d" }}>{req.customer}</p>
                  <p style={{ color: "#6B7280" }}>{req.phone}</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#f0ebe0" }}>
                <div className="px-4 py-2.5 text-xs font-semibold" style={{ background: "#f0ebe0", color: "#14110d" }}>Article</div>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold" style={{ color: "#14110d" }}>{req.piece} — {req.wax}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Col : {req.col} · Manches : {req.manches}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#6B7280" }}>Total devis</span>
                  <span className="font-semibold" style={{ color: "#14110d" }}>{live.devis}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#6B7280" }}>Acompte (50%) — {live.acomptePaid ? "✓ Reçu" : "En attente"}</span>
                  <span className="font-semibold" style={{ color: "#14110d" }}>{live.acompte}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t text-base" style={{ borderColor: "#f0ebe0" }}>
                  <span style={{ color: "#14110d" }}>Solde restant</span>
                  <span style={{ color: "#b08a4a" }}>{live.soldePaid ? "✓ Réglé" : soldeDisplay}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={downloadPDF}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "#14110d", color: "#fff" }}
              >
                <Download size={14} /> Télécharger PDF
              </button>
              <button
                onClick={sendWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: "#25D366", color: "#fff" }}
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Devis modal */}
      {showDevisForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-semibold text-sm" style={{ color: "#14110d" }}>Définir le montant du devis</p>
              <button onClick={() => setShowDevisForm(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#b08a4a" }}>Montant total (FCFA)</label>
                <input
                  type="number"
                  value={devisInput}
                  onChange={(e) => setDevisInput(e.target.value)}
                  placeholder="ex : 145000"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "#e8d9bd", color: "#14110d" }}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveDevis()}
                  autoFocus
                />
                {devisInput && (
                  <p className="text-xs mt-1" style={{ color: "#b08a4a99" }}>
                    Acompte (50%) : {Math.round(parseInt(devisInput || "0", 10) * 0.5).toLocaleString("fr-FR")} FCFA
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveDevis}
                  disabled={!devisInput.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "#b08a4a", color: "#fff" }}
                >
                  Enregistrer & Envoyer
                </button>
                <button onClick={() => setShowDevisForm(false)} className="px-4 rounded-xl text-sm" style={{ background: "#f3f4f6", color: "#6B7280" }}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
