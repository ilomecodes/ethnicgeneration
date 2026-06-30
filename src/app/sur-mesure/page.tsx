"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload, Check, X, CheckCircle } from "lucide-react";
import { pieceTypes, finitionOptions, waxMaterials } from "@/lib/admin-data";

// ─── Data (driven by admin-data so admin changes reflect here) ────────────────

const PIECES = pieceTypes
  .filter((p) => p.active)
  .map((p) => ({ id: p.id, label: p.name, desc: p.desc }));

const WAX_SWATCHES = waxMaterials
  .filter((m) => m.active)
  .map((m) => ({
    id: m.id,
    name: m.name,
    bg: `linear-gradient(135deg,${m.color1},${m.color2},${m.color1})`,
  }));

const SILHOUETTES = [
  { id: "droite",      label: "Robe droite",      shape: "rect" },
  { id: "evasee",      label: "Évasée / Trapèze",  shape: "trap" },
  { id: "sirene",      label: "Sirène",            shape: "mermaid" },
  { id: "asymetrique", label: "Asymétrique",       shape: "asym" },
  { id: "boubou",      label: "Boubou ample",      shape: "wide" },
  { id: "deux-pieces", label: "Deux pièces",       shape: "two" },
];

const COLS         = finitionOptions.cols.filter((o) => o.active).map((o) => o.name);
const MANCHES      = finitionOptions.manches.filter((o) => o.active).map((o) => o.name);
const DOUBLURES    = finitionOptions.doublures.filter((o) => o.active).map((o) => o.name);
const POCHES       = finitionOptions.poches.filter((o) => o.active).map((o) => o.name);
const BOUTON_TYPES = finitionOptions.boutons.filter((o) => o.active).map((o) => o.name);

const MEASUREMENTS = [
  { key: "poitrine",       label: "Tour de poitrine", hint: "cm" },
  { key: "taille",         label: "Tour de taille",   hint: "cm" },
  { key: "hanches",        label: "Tour de hanches",  hint: "cm" },
  { key: "hauteur",        label: "Hauteur totale",   hint: "cm" },
  { key: "longueurPiece",  label: "Longueur souhaitée de la pièce", hint: "cm" },
  { key: "epaules",        label: "Largeur des épaules", hint: "cm" },
  { key: "longueurManches",label: "Longueur des manches", hint: "cm" },
  { key: "tourBras",       label: "Tour de bras",     hint: "cm" },
];

// ─── Silhouette SVG ────────────────────────────────────────────────────────────

function SilhouetteSVG({ shape, selected }: { shape: string; selected: boolean }) {
  const c = selected ? "#b08a4a" : "#d9b89a";
  const svgs: Record<string, React.ReactElement> = {
    rect: (
      <svg viewBox="0 0 60 100" className="w-12 h-20">
        <rect x="12" y="4" width="36" height="92" rx="2" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="12" y1="28" x2="48" y2="28" stroke={c} strokeWidth="1.5"/>
      </svg>
    ),
    trap: (
      <svg viewBox="0 0 60 100" className="w-12 h-20">
        <path d="M20,4 L40,4 L52,96 L8,96 Z" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="18" y1="28" x2="42" y2="28" stroke={c} strokeWidth="1.5"/>
      </svg>
    ),
    mermaid: (
      <svg viewBox="0 0 60 100" className="w-12 h-20">
        <path d="M18,4 L42,4 L44,60 Q44,75 50,96 L10,96 Q16,75 16,60 Z" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="17" y1="28" x2="43" y2="28" stroke={c} strokeWidth="1.5"/>
      </svg>
    ),
    asym: (
      <svg viewBox="0 0 60 100" className="w-12 h-20">
        <path d="M18,4 L42,4 L48,96 L12,96 Z" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="17" y1="28" x2="43" y2="28" stroke={c} strokeWidth="1.5"/>
        <line x1="12" y1="70" x2="48" y2="56" stroke={c} strokeWidth="1.5"/>
      </svg>
    ),
    wide: (
      <svg viewBox="0 0 60 100" className="w-12 h-20">
        <path d="M10,8 L50,8 L58,96 L2,96 Z" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="10" y1="28" x2="50" y2="28" stroke={c} strokeWidth="1.5"/>
      </svg>
    ),
    two: (
      <svg viewBox="0 0 60 100" className="w-12 h-20">
        <rect x="12" y="4" width="36" height="40" rx="2" fill="none" stroke={c} strokeWidth="2"/>
        <rect x="12" y="52" width="36" height="44" rx="2" fill="none" stroke={c} strokeWidth="2"/>
      </svg>
    ),
  };
  return svgs[shape] ?? svgs.rect;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Form {
  piece: string;
  waxId: string;
  ownFabric: boolean;
  silhouetteId: string;
  inspirationFile: File | null;
  inspirationPreview: string;
  inspirationNote: string;
  noMeasurements: boolean;
  measurements: Record<string, string>;
  col: string;
  manches: string;
  doublure: string;
  boutons: boolean;
  typeBouton: string;
  poches: string;
  nom: string;
  email: string;
  telephone: string;
  noteLibre: string;
}

const empty: Form = {
  piece: "", waxId: "", ownFabric: false,
  silhouetteId: "", inspirationFile: null, inspirationPreview: "", inspirationNote: "",
  noMeasurements: false,
  measurements: { poitrine:"", taille:"", hanches:"", hauteur:"", longueurPiece:"", epaules:"", longueurManches:"", tourBras:"" },
  col: "", manches: "", doublure: "", boutons: false, typeBouton: "", poches: "",
  nom: "", email: "", telephone: "", noteLibre: "",
};

const STEP_LABELS = ["Pièce","Tissu","Modèle","Mesures","Finitions","Récapitulatif"];

// ─── Main component ────────────────────────────────────────────────────────────

export default function SurMesurePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(empty);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  const advance = () => {
    setStep((s) => s + 1);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const back = () => {
    setStep((s) => s - 1);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const canNext: Record<number, boolean> = {
    1: !!form.piece,
    2: !!form.waxId || form.ownFabric,
    3: !!form.silhouetteId || !!form.inspirationFile,
    4: form.noMeasurements || Object.values(form.measurements).some(Boolean),
    5: !!form.col && !!form.manches && !!form.doublure && !!form.poches,
  };

  if (submitted) return <ConfirmationScreen nom={form.nom} />;

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }} ref={topRef}>

      {/* Header */}
      <header className="flex items-center justify-between px-10 h-20 border-b" style={{ borderColor: "rgba(20,17,13,.1)", background: "#f6f1e6" }}>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>
          <ArrowLeft size={15} strokeWidth={2} />
          Retour
        </Link>
        <div className="text-center">
          <span className="font-[family-name:var(--font-display)] italic text-xl" style={{ color: "#14110d" }}>
            Ethnicgeneration
          </span>
          <span className="block font-[family-name:var(--font-nav)] text-[9px] tracking-[.38em] uppercase mt-0.5" style={{ color: "#b08a4a" }}>
            Atelier Sur Mesure
          </span>
        </div>
        <div className="w-20" />
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-0">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                    style={{
                      background: done ? "#b08a4a" : active ? "#14110d" : "transparent",
                      color: done || active ? "#f6f1e6" : "#b08a4a99",
                      border: done || active ? "none" : "1.5px solid #d9b89a",
                    }}
                  >
                    {done ? <Check size={13} /> : n}
                  </div>
                  <span
                    className="text-[10px] font-medium tracking-wide hidden sm:block"
                    style={{ color: active ? "#14110d" : done ? "#b08a4a" : "#b08a4a80", fontFamily: "var(--font-nav)" }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1 mb-5 transition-all"
                    style={{ background: done ? "#b08a4a" : "#e8d9bd" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">

        {/* Step 1 — Pièce */}
        {step === 1 && (
          <StepShell title="Quelle pièce souhaitez-vous ?" sub="Choisissez le type de vêtement que notre atelier va créer pour vous.">
            <div className="grid grid-cols-3 gap-3">
              {PIECES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set({ piece: p.id })}
                  className="p-5 rounded-2xl text-left border-2 transition-all"
                  style={{
                    background: form.piece === p.id ? "#14110d" : "#fff",
                    borderColor: form.piece === p.id ? "#14110d" : "#e8d9bd",
                  }}
                >
                  <p className="font-semibold text-sm" style={{ color: form.piece === p.id ? "#f6f1e6" : "#14110d", fontFamily: "var(--font-nav)" }}>{p.label}</p>
                  <p className="text-xs mt-1" style={{ color: form.piece === p.id ? "#d9b89a" : "#b08a4a99" }}>{p.desc}</p>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 2 — Tissu */}
        {step === 2 && (
          <StepShell title="Choisissez votre tissu wax" sub="Ces swatches sont provisoires — nos artisans vous présenteront l'assortiment complet après réception.">
            <div className="grid grid-cols-4 gap-3 mb-5">
              {WAX_SWATCHES.map((w) => {
                const sel = form.waxId === w.id && !form.ownFabric;
                return (
                  <button
                    key={w.id}
                    onClick={() => set({ waxId: w.id, ownFabric: false })}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full aspect-square rounded-xl border-2 transition-all flex items-center justify-center"
                      style={{
                        background: w.bg,
                        borderColor: sel ? "#14110d" : "transparent",
                        boxShadow: sel ? "0 0 0 2px #14110d" : "none",
                      }}
                    >
                      {sel && <Check size={20} color="#fff" strokeWidth={2.5} />}
                    </div>
                    <span className="text-[11px] font-medium text-center leading-tight" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>
                      {w.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => set({ ownFabric: !form.ownFabric, waxId: "" })}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all"
              style={{
                background: form.ownFabric ? "#14110d" : "#fff",
                borderColor: form.ownFabric ? "#14110d" : "#e8d9bd",
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: form.ownFabric ? "#b08a4a" : "transparent", border: form.ownFabric ? "none" : "1.5px solid #d9b89a" }}
              >
                {form.ownFabric && <Check size={12} color="#fff" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: form.ownFabric ? "#f6f1e6" : "#14110d", fontFamily: "var(--font-nav)" }}>
                  Je fournis mon propre tissu
                </p>
                <p className="text-xs mt-0.5" style={{ color: form.ownFabric ? "#d9b89a" : "#b08a4a99" }}>
                  Apportez votre wax en atelier ou envoyez-le par la poste
                </p>
              </div>
            </button>
          </StepShell>
        )}

        {/* Step 3 — Modèle */}
        {step === 3 && (
          <StepShell title="Quel modèle souhaitez-vous ?" sub="Sélectionnez une silhouette parmi nos modèles ou importez votre propre inspiration.">
            <div className="grid grid-cols-3 gap-3 mb-6">
              {SILHOUETTES.map((s) => {
                const sel = form.silhouetteId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => set({ silhouetteId: s.id, inspirationFile: null, inspirationPreview: "" })}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all"
                    style={{
                      background: sel ? "#14110d" : "#fff",
                      borderColor: sel ? "#14110d" : "#e8d9bd",
                    }}
                  >
                    <SilhouetteSVG shape={s.shape} selected={sel} />
                    <span className="text-xs font-semibold" style={{ color: sel ? "#f6f1e6" : "#14110d", fontFamily: "var(--font-nav)" }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px" style={{ background: "#e8d9bd" }} />
                <span className="text-xs font-medium" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>OU</span>
                <div className="flex-1 h-px" style={{ background: "#e8d9bd" }} />
              </div>

              {form.inspirationPreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2" style={{ borderColor: "#14110d" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.inspirationPreview} alt="Inspiration" className="w-full h-48 object-cover" />
                  <button
                    onClick={() => set({ inspirationFile: null, inspirationPreview: "" })}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#14110d" }}
                  >
                    <X size={13} color="#f6f1e6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { set({ silhouetteId: "" }); fileRef.current?.click(); }}
                  className="w-full flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all"
                  style={{ borderColor: "#d9b89a", background: "#fff" }}
                >
                  <Upload size={24} style={{ color: "#b08a4a" }} />
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>
                      Importer une image d&apos;inspiration
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#b08a4a99" }}>JPG, PNG · max 5 Mo</p>
                  </div>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = URL.createObjectURL(f);
                  set({ inspirationFile: f, inspirationPreview: url, silhouetteId: "" });
                }}
              />

              {(form.inspirationFile || form.inspirationPreview) && (
                <textarea
                  value={form.inspirationNote}
                  onChange={(e) => set({ inspirationNote: e.target.value })}
                  placeholder="Décrivez ce qui vous plaît dans cette image (optionnel)…"
                  rows={3}
                  className="mt-3 w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                  style={{ background: "#fff", border: "1.5px solid #e8d9bd", color: "#14110d", fontFamily: "var(--font-ui)" }}
                />
              )}
            </div>
          </StepShell>
        )}

        {/* Step 4 — Mesures */}
        {step === 4 && (
          <StepShell title="Vos mesures" sub="Prenez vos mesures à plat sur le corps, sans vêtements épais. En cm.">
            <button
              onClick={() => set({ noMeasurements: !form.noMeasurements })}
              className="flex items-center gap-3 w-full p-4 rounded-2xl border-2 mb-6 text-left transition-all"
              style={{
                background: form.noMeasurements ? "#14110d" : "#fff",
                borderColor: form.noMeasurements ? "#14110d" : "#e8d9bd",
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: form.noMeasurements ? "#b08a4a" : "transparent", border: form.noMeasurements ? "none" : "1.5px solid #d9b89a" }}
              >
                {form.noMeasurements && <Check size={12} color="#fff" />}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: form.noMeasurements ? "#f6f1e6" : "#14110d", fontFamily: "var(--font-nav)" }}>
                  Je préfère être mesurée en atelier
                </p>
                <p className="text-xs mt-0.5" style={{ color: form.noMeasurements ? "#d9b89a" : "#b08a4a99" }}>
                  Notre équipe prendra rendez-vous avec vous
                </p>
              </div>
            </button>

            <div className={`grid grid-cols-2 gap-4 transition-opacity ${form.noMeasurements ? "opacity-30 pointer-events-none" : ""}`}>
              {MEASUREMENTS.map((m) => (
                <div key={m.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>
                    {m.label}
                  </label>
                  <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: "#e8d9bd", background: "#fff" }}>
                    <input
                      type="number"
                      min={0}
                      value={form.measurements[m.key]}
                      onChange={(e) => set({ measurements: { ...form.measurements, [m.key]: e.target.value } })}
                      placeholder="0"
                      className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
                      style={{ color: "#14110d" }}
                    />
                    <span className="px-4 text-xs font-medium" style={{ color: "#b08a4a", background: "#fdf5e8" }}>
                      {m.hint}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 5 — Finitions */}
        {step === 5 && (
          <StepShell title="Finitions & détails" sub="Personnalisez chaque aspect de votre pièce.">
            <div className="space-y-6">
              <OptionGroup label="Type de col" options={COLS} value={form.col} onChange={(v) => set({ col: v })} />
              <OptionGroup label="Manches" options={MANCHES} value={form.manches} onChange={(v) => set({ manches: v })} />
              <OptionGroup label="Doublure" options={DOUBLURES} value={form.doublure} onChange={(v) => set({ doublure: v })} />

              {/* Boutons */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>Boutons</p>
                <div className="flex gap-3 mb-3">
                  {["Non","Oui"].map((v) => {
                    const sel = form.boutons === (v === "Oui");
                    return (
                      <button
                        key={v}
                        onClick={() => set({ boutons: v === "Oui", typeBouton: "" })}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-all"
                        style={{
                          background: sel ? "#14110d" : "#fff",
                          color: sel ? "#f6f1e6" : "#14110d",
                          borderColor: sel ? "#14110d" : "#e8d9bd",
                          fontFamily: "var(--font-nav)",
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
                {form.boutons && (
                  <OptionGroup label="Type de bouton" options={BOUTON_TYPES} value={form.typeBouton} onChange={(v) => set({ typeBouton: v })} />
                )}
              </div>

              <OptionGroup label="Poches" options={POCHES} value={form.poches} onChange={(v) => set({ poches: v })} />
            </div>
          </StepShell>
        )}

        {/* Step 6 — Récapitulatif */}
        {step === 6 && (
          <StepShell title="Votre demande en un coup d'œil" sub="Vérifiez vos choix puis envoyez votre demande. L'atelier vous répond sous 48 h.">
            <div className="space-y-4 mb-8">
              <SummaryRow label="Pièce" value={PIECES.find(p => p.id === form.piece)?.label ?? "-"} />
              <SummaryRow label="Tissu" value={form.ownFabric ? "Tissu personnel" : (WAX_SWATCHES.find(w => w.id === form.waxId)?.name ?? "-")} />
              <SummaryRow label="Modèle" value={form.silhouetteId ? (SILHOUETTES.find(s => s.id === form.silhouetteId)?.label ?? "-") : "Image importée"} />
              <SummaryRow label="Mesures" value={form.noMeasurements ? "En atelier" : Object.values(form.measurements).filter(Boolean).length + " mesures renseignées"} />
              <SummaryRow label="Col" value={form.col} />
              <SummaryRow label="Manches" value={form.manches} />
              <SummaryRow label="Doublure" value={form.doublure} />
              <SummaryRow label="Boutons" value={form.boutons ? (form.typeBouton || "Oui") : "Non"} />
              <SummaryRow label="Poches" value={form.poches} />
            </div>

            {/* Contact */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#fff", border: "1.5px solid #e8d9bd" }}>
              <p className="text-sm font-semibold mb-4" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>Vos coordonnées</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "nom", label: "Nom complet", type: "text" },
                  { key: "email", label: "Adresse e-mail", type: "email" },
                  { key: "telephone", label: "Téléphone / WhatsApp", type: "tel" },
                ].map(({ key, label, type }) => (
                  <div key={key} className={key === "telephone" ? "col-span-2 sm:col-span-1" : ""}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof Form] as string}
                      onChange={(e) => set({ [key]: e.target.value } as Partial<Form>)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                      style={{ border: "1.5px solid #e8d9bd", color: "#14110d", background: "#fdf5e8" }}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>
                    Note libre <span className="font-normal" style={{ color: "#b08a4a99" }}>(optionnel)</span>
                  </label>
                  <textarea
                    value={form.noteLibre}
                    onChange={(e) => set({ noteLibre: e.target.value })}
                    placeholder="Précisions, questions, délai souhaité…"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none border"
                    style={{ border: "1.5px solid #e8d9bd", color: "#14110d", background: "#fdf5e8" }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-center mb-6" style={{ color: "#b08a4a99", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              Réponse de l'atelier sous 48 heures · Première esquisse offerte
            </p>

            <button
              onClick={() => setSubmitted(true)}
              disabled={!form.nom || !form.email}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-40"
              style={{ background: "#14110d", color: "#f6f1e6", fontFamily: "var(--font-nav)", letterSpacing: ".1em" }}
            >
              Envoyer ma demande à l&apos;atelier
              <ArrowRight size={16} />
            </button>
          </StepShell>
        )}

        {/* Navigation */}
        {step < 6 && (
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={back}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all"
                style={{ border: "1.5px solid #e8d9bd", color: "#14110d", background: "#fff", fontFamily: "var(--font-nav)" }}
              >
                <ArrowLeft size={15} />
                Précédent
              </button>
            ) : <div />}
            <button
              onClick={advance}
              disabled={!canNext[step]}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: "#14110d", color: "#f6f1e6", fontFamily: "var(--font-nav)" }}
            >
              Suivant
              <ArrowRight size={15} />
            </button>
          </div>
        )}
        {step === 6 && (
          <button
            onClick={back}
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all"
            style={{ border: "1.5px solid #e8d9bd", color: "#14110d", background: "#fff", fontFamily: "var(--font-nav)" }}
          >
            <ArrowLeft size={15} />
            Modifier ma demande
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StepShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-[28px] font-light leading-tight mb-2" style={{ color: "#14110d" }}>
        {title}
      </h2>
      <p className="text-sm mb-8" style={{ color: "#b08a4a99", fontFamily: "var(--font-display)", fontStyle: "italic" }}>{sub}</p>
      {children}
    </div>
  );
}

function OptionGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-3" style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const sel = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="px-4 py-2 rounded-xl text-xs font-medium border transition-all"
              style={{
                background: sel ? "#14110d" : "#fff",
                color: sel ? "#f6f1e6" : "#14110d",
                borderColor: sel ? "#14110d" : "#e8d9bd",
                fontFamily: "var(--font-nav)",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#e8d9bd" }}>
      <span className="text-xs font-semibold" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: "#14110d", fontFamily: "var(--font-display)" }}>{value || "—"}</span>
    </div>
  );
}

function ConfirmationScreen({ nom }: { nom: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#f6f1e6" }}>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#14110d" }}
      >
        <CheckCircle size={32} style={{ color: "#b08a4a" }} />
      </div>
      <h1 className="font-[family-name:var(--font-display)] font-light text-[36px] leading-tight mb-3" style={{ color: "#14110d" }}>
        Demande envoyée,<br /><em style={{ color: "#b08a4a" }}>{nom || "merci"}</em>.
      </h1>
      <p className="font-[family-name:var(--font-display)] italic text-lg max-w-md mb-2" style={{ color: "rgba(20,17,13,.6)" }}>
        Notre atelier a bien reçu votre demande et vous répondra sous 48 heures avec une première esquisse.
      </p>
      <p className="text-xs mb-10" style={{ color: "#b08a4a99", fontFamily: "var(--font-nav)" }}>
        Un e-mail de confirmation vous a été envoyé.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold"
        style={{ background: "#14110d", color: "#f6f1e6", fontFamily: "var(--font-nav)" }}
      >
        <ArrowLeft size={15} />
        Retour à la boutique
      </Link>
    </div>
  );
}
