"use client";

import { useRouter } from "next/navigation";
import { FileText, Download, Eye } from "lucide-react";
import { surMesureRequests } from "@/lib/admin-data";
import { useSurMesure } from "@/context/SurMesureContext";

const statusColor: Record<string, { bg: string; text: string }> = {
  "Demande reçue":       { bg: "#F4F3FF", text: "#6B7280" },
  "Devis envoyé":        { bg: "#fdf5e8", text: "#b08a4a" },
  "Acompte reçu":        { bg: "#FEF3C7", text: "#D97706" },
  "En production":       { bg: "#ECFDF5", text: "#059669" },
  "Essayage / Retouche": { bg: "#F0F9FF", text: "#0EA5E9" },
  "Livré":               { bg: "#f0ebe0", text: "#3f2417" },
};

export default function FacturesPage() {
  const router = useRouter();
  const { liveData, markInvoiceGenerated } = useSurMesure();

  const requests = surMesureRequests.filter((r) => {
    const live = liveData[r.id];
    return live?.devis != null;
  });

  const totalGenerated = requests.filter((r) => liveData[r.id]?.invoiceGenerated).length;

  function openInvoice(req: typeof surMesureRequests[0]) {
    const live = liveData[req.id];
    if (!live?.devis || !live?.acompte) return;

    const devisNum = parseInt(live.devis.replace(/[^\d]/g, ""), 10) || 0;
    const acompteNum = parseInt(live.acompte.replace(/[^\d]/g, ""), 10) || 0;
    const soldeNum = devisNum - acompteNum;
    const soldeDisplay = live.soldePaid ? "✓ Réglé" : `${soldeNum.toLocaleString("fr-FR")} FCFA`;
    const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Facture FAC-${req.id}</title>
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
      <td style="color:#6B7280">Col : ${req.col} · Manches : ${req.manches}</td>
      <td style="text-align:right;font-weight:600">${live.devis}</td>
    </tr>
  </tbody>
</table>
<h3>Récapitulatif financier</h3>
<table>
  <tbody>
    <tr><td>Total devis</td><td style="text-align:right">${live.devis}</td></tr>
    <tr><td>Acompte (50%) — ${live.acomptePaid ? "✓ Reçu" : "En attente"}</td><td style="text-align:right">${live.acompte}</td></tr>
    <tr class="tr"><td>Solde restant</td><td style="text-align:right">${soldeDisplay}</td></tr>
  </tbody>
</table>
<div class="ft">Ethnicgeneration · Yaoundé, Cameroun · Merci pour votre confiance !</div>
</body></html>`;

    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
    markInvoiceGenerated(req.id);
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold" style={{ color: "#14110d" }}>Factures</h1>
        <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
          {requests.length} devis établi{requests.length > 1 ? "s" : ""} · {totalGenerated} facture{totalGenerated > 1 ? "s" : ""} générée{totalGenerated > 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold" style={{ color: "#14110d" }}>{requests.length}</p>
          <p className="text-xs mt-1" style={{ color: "#b08a4a99" }}>Devis établis</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold" style={{ color: "#059669" }}>{totalGenerated}</p>
          <p className="text-xs mt-1" style={{ color: "#b08a4a99" }}>Factures générées</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold" style={{ color: "#D97706" }}>{requests.filter((r) => !liveData[r.id]?.acomptePaid).length}</p>
          <p className="text-xs mt-1" style={{ color: "#b08a4a99" }}>Acomptes en attente</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-50">
                {["Référence", "Cliente", "Pièce", "Devis", "Acompte", "Solde", "Statut", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 md:px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => {
                const live = liveData[req.id];
                if (!live) return null;
                const sc = statusColor[live.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
                const devisNum = live.devis ? parseInt(live.devis.replace(/[^\d]/g, ""), 10) : 0;
                const acompteNum = live.acompte ? parseInt(live.acompte.replace(/[^\d]/g, ""), 10) : 0;
                const soldeNum = devisNum - acompteNum;

                return (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#fdf5e8" }}>
                          <FileText size={12} style={{ color: "#b08a4a" }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#14110d" }}>FAC-{req.id}</p>
                          {live.invoiceGenerated && (
                            <p className="text-[10px]" style={{ color: "#059669" }}>✓ Générée</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0" style={{ background: "#b08a4a" }}>
                          {req.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#14110d" }}>{req.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-sm" style={{ color: "#6B7280" }}>{req.piece}</td>
                    <td className="px-4 md:px-5 py-4 text-sm font-semibold" style={{ color: "#14110d" }}>{live.devis}</td>
                    <td className="px-4 md:px-5 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={live.acomptePaid ? { background: "#ECFDF5", color: "#059669" } : { background: "#FEF3C7", color: "#D97706" }}
                      >
                        {live.acomptePaid ? `✓ ${live.acompte}` : `En attente · ${live.acompte}`}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={live.soldePaid ? { background: "#ECFDF5", color: "#059669" } : { background: "#f3f4f6", color: "#6B7280" }}
                      >
                        {live.soldePaid ? "✓ Réglé" : `${soldeNum.toLocaleString("fr-FR")} FCFA`}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: sc.bg, color: sc.text }}>
                        {live.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInvoice(req)}
                          title="Télécharger PDF"
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Download size={14} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/sur-mesure/${req.id}`)}
                          title="Voir la demande"
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {requests.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">Aucune facture disponible — définissez d&apos;abord le montant d&apos;un devis.</div>
        )}
      </div>
    </div>
  );
}
