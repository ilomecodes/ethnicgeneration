"use client";

import { useState } from "react";
import { Plus, Check, X, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { finitionOptions, pieceTypes } from "@/lib/admin-data";

type Option = { id: string; name: string; desc?: string; active: boolean };
type OptionsMap = { [key: string]: Option[] };

const TABS = [
  { key: "modeles",   label: "Modèles",   desc: "Types de pièces vestimentaires proposées", hasDesc: true },
  { key: "cols",      label: "Cols",      desc: "Formes d'encolure proposées",               hasDesc: false },
  { key: "boutons",   label: "Boutons",   desc: "Types de boutons disponibles à la sélection", hasDesc: false },
  { key: "manches",   label: "Manches",   desc: "Longueurs et styles de manches",            hasDesc: false },
  { key: "doublures", label: "Doublures", desc: "Options de doublure intérieure",            hasDesc: false },
  { key: "poches",    label: "Poches",    desc: "Types de poches disponibles",               hasDesc: false },
] as const;

type TabKey = typeof TABS[number]["key"];

const initialData: OptionsMap = {
  modeles: pieceTypes.map((p) => ({ id: p.id, name: p.name, desc: p.desc, active: p.active })),
  ...finitionOptions,
};

export default function OptionsPage() {
  const [options, setOptions] = useState<OptionsMap>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("modeles");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const currentOptions = options[activeTab] ?? [];
  const activeCount = currentOptions.filter((o) => o.active).length;
  const tab = TABS.find((t) => t.key === activeTab)!;

  const resetAdd = () => { setAdding(false); setNewName(""); setNewDesc(""); };
  const resetEdit = () => { setEditingId(null); setEditName(""); setEditDesc(""); };

  const startAdd = () => { setNewName(""); setNewDesc(""); resetEdit(); setAdding(true); };

  const saveAdd = () => {
    if (!newName.trim()) return;
    const prefix = activeTab.slice(0, 2);
    const id = prefix + Date.now();
    const entry: Option = { id, name: newName.trim(), active: true };
    if (tab.hasDesc) entry.desc = newDesc.trim();
    setOptions((prev) => ({ ...prev, [activeTab]: [...(prev[activeTab] ?? []), entry] }));
    resetAdd();
  };

  const startEdit = (o: Option) => {
    setEditingId(o.id);
    setEditName(o.name);
    setEditDesc(o.desc ?? "");
    resetAdd();
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setOptions((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((o) =>
        o.id === editingId
          ? { ...o, name: editName.trim(), ...(tab.hasDesc ? { desc: editDesc.trim() } : {}) }
          : o
      ),
    }));
    resetEdit();
  };

  const toggle = (id: string) =>
    setOptions((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((o) => (o.id === id ? { ...o, active: !o.active } : o)),
    }));

  const remove = (id: string) =>
    setOptions((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((o) => o.id !== id) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold" style={{ color: "#14110d" }}>Options & Modèles</h1>
        <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
          Gérez les choix proposés dans le formulaire Sur Mesure côté client.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: "#e8d9bd" }}>
        {TABS.map((t) => {
          const count = (options[t.key] ?? []).filter((o) => o.active).length;
          const total = (options[t.key] ?? []).length;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); resetAdd(); resetEdit(); }}
              className="flex-1 flex flex-col items-center py-2.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              style={{
                background: isActive ? "#fff" : "transparent",
                color: isActive ? "#14110d" : "#b08a4a",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <span>{t.label}</span>
              <span className="text-[10px] mt-0.5 font-normal" style={{ color: isActive ? "#b08a4a" : "#b08a4a99" }}>
                {count}/{total} actifs
              </span>
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-base" style={{ color: "#14110d" }}>{tab.label}</h2>
          <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>
            {activeCount} actif{activeCount > 1 ? "s" : ""} sur {currentOptions.length} · {tab.desc}
          </p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={15} />
          Ajouter
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-2xl shadow-sm border-2 p-4 space-y-3" style={{ borderColor: "#b08a4a" }}>
          <p className="text-xs font-semibold" style={{ color: "#14110d" }}>
            Nouvel élément — {tab.label}
          </p>
          <div className={tab.hasDesc ? "grid grid-cols-2 gap-3" : ""}>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Nom</label>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !tab.hasDesc) saveAdd(); if (e.key === "Escape") resetAdd(); }}
                placeholder={tab.hasDesc ? "Ex: Kaftan" : `Ex: nouvelle option`}
                className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
                style={{ border: "1.5px solid #e8d9bd", color: "#14110d" }}
              />
            </div>
            {tab.hasDesc && (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Description courte</label>
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveAdd(); if (e.key === "Escape") resetAdd(); }}
                  placeholder="Ex: Robe longue à col brodé"
                  className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
                  style={{ border: "1.5px solid #e8d9bd", color: "#14110d" }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={saveAdd}
              disabled={!newName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40"
              style={{ background: "#b08a4a" }}
            >
              <Check size={13} />
              Enregistrer
            </button>
            <button
              onClick={resetAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border"
              style={{ border: "1.5px solid #e8d9bd", color: "#6B7280" }}
            >
              <X size={13} />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Options list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {currentOptions.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: "#b08a4a99" }}>
            Aucune option — ajoutez-en une ci-dessus.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#f0ebe0" }}>
            {currentOptions.map((o, idx) => (
              <div
                key={o.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#fdf9f4]"
                style={{ opacity: o.active ? 1 : 0.55 }}
              >
                {/* Index */}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: "#f0ebe0", color: "#b08a4a" }}
                >
                  {idx + 1}
                </span>

                {/* Name + desc / inline edit */}
                {editingId === o.id ? (
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !tab.hasDesc) saveEdit(); if (e.key === "Escape") resetEdit(); }}
                      placeholder="Nom"
                      className="w-36 px-3 py-1 rounded-lg text-sm border outline-none"
                      style={{ border: "1.5px solid #b08a4a", color: "#14110d" }}
                    />
                    {tab.hasDesc && (
                      <input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") resetEdit(); }}
                        placeholder="Description courte"
                        className="flex-1 min-w-[160px] px-3 py-1 rounded-lg text-sm border outline-none"
                        style={{ border: "1.5px solid #e8d9bd", color: "#14110d" }}
                      />
                    )}
                    <button
                      onClick={saveEdit}
                      disabled={!editName.trim()}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                      style={{ background: "#b08a4a" }}
                    >
                      <Check size={12} /> OK
                    </button>
                    <button
                      onClick={resetEdit}
                      className="p-1 rounded-lg border"
                      style={{ border: "1.5px solid #e8d9bd", color: "#6B7280" }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0" onDoubleClick={() => startEdit(o)}>
                    <p className="text-sm font-medium truncate" style={{ color: "#14110d" }}>{o.name}</p>
                    {tab.hasDesc && o.desc && (
                      <p className="text-xs truncate mt-0.5" style={{ color: "#b08a4a99" }}>{o.desc}</p>
                    )}
                  </div>
                )}

                {/* Inactive badge */}
                {!o.active && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "#f3f4f6", color: "#9CA3AF" }}
                  >
                    Inactif
                  </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {editingId !== o.id && (
                    <button
                      onClick={() => startEdit(o)}
                      className="text-xs px-2 py-1 rounded-lg transition-colors"
                      style={{ color: "#b08a4a", background: "#fdf5e8" }}
                    >
                      Modifier
                    </button>
                  )}
                  <button
                    onClick={() => toggle(o.id)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: o.active ? "#059669" : "#9CA3AF" }}
                  >
                    {o.active
                      ? <ToggleRight size={18} style={{ color: "#059669" }} />
                      : <ToggleLeft size={18} style={{ color: "#d1d5db" }} />
                    }
                  </button>
                  <button
                    onClick={() => remove(o.id)}
                    className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "#b08a4a66" }}>
        Double-cliquez sur un élément pour le modifier. Les éléments inactifs ne s&apos;affichent pas dans le formulaire client.
      </p>
    </div>
  );
}
