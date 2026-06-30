"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import { waxMaterials } from "@/lib/admin-data";

type Material = {
  id: string;
  name: string;
  color1: string;
  color2: string;
  active: boolean;
};

type EditForm = { name: string; color1: string; color2: string };

const emptyForm: EditForm = { name: "", color1: "#b08a4a", color2: "#d9b89a" };

export default function MateriauxPage() {
  const [materials, setMaterials] = useState<Material[]>(waxMaterials);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm);

  const swatchBg = (m: { color1: string; color2: string }) =>
    `linear-gradient(135deg, ${m.color1}, ${m.color2}, ${m.color1})`;

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setAdding(true);
  };

  const startEdit = (m: Material) => {
    setForm({ name: m.name, color1: m.color1, color2: m.color2 });
    setEditingId(m.id);
    setAdding(false);
  };

  const cancel = () => {
    setAdding(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (adding) {
      const newId = "w" + (Date.now());
      setMaterials((ms) => [...ms, { id: newId, ...form, active: true }]);
    } else if (editingId) {
      setMaterials((ms) =>
        ms.map((m) => (m.id === editingId ? { ...m, ...form } : m))
      );
    }
    cancel();
  };

  const toggle = (id: string) =>
    setMaterials((ms) => ms.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));

  const remove = (id: string) =>
    setMaterials((ms) => ms.filter((m) => m.id !== id));

  const active = materials.filter((m) => m.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold" style={{ color: "#14110d" }}>Matières & Tissus</h1>
          <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
            {active} matières actives sur {materials.length} — ces options s&apos;affichent dans le formulaire Sur Mesure.
          </p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Ajouter une matière</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2" style={{ borderColor: "#b08a4a" }}>
          <p className="font-semibold text-sm mb-4" style={{ color: "#14110d" }}>Nouvelle matière</p>
          <MaterialForm form={form} setForm={setForm} onSave={save} onCancel={cancel} />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {materials.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            style={{ opacity: m.active ? 1 : 0.55 }}
          >
            {editingId === m.id ? (
              <div className="p-4">
                <MaterialForm form={form} setForm={setForm} onSave={save} onCancel={cancel} compact />
              </div>
            ) : (
              <>
                {/* Swatch */}
                <div
                  className="h-24 w-full relative"
                  style={{ background: swatchBg(m) }}
                >
                  {!m.active && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.55)" }}>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white" style={{ color: "#9CA3AF" }}>Inactif</span>
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="p-4">
                  <p className="font-semibold text-sm mb-1" style={{ color: "#14110d" }}>{m.name}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="w-4 h-4 rounded-full border border-gray-100" style={{ background: m.color1 }} />
                    <div className="w-4 h-4 rounded-full border border-gray-100" style={{ background: m.color2 }} />
                    <span className="text-xs ml-1" style={{ color: "#b08a4a99" }}>
                      {m.color1} → {m.color2}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(m)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={13} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggle(m.id)}
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: m.active ? "#059669" : "#9CA3AF" }}
                    >
                      {m.active
                        ? <ToggleRight size={18} style={{ color: "#059669" }} />
                        : <ToggleLeft size={18} style={{ color: "#d1d5db" }} />
                      }
                      {m.active ? "Actif" : "Inactif"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialForm({
  form, setForm, onSave, onCancel, compact = false,
}: {
  form: EditForm;
  setForm: (f: EditForm) => void;
  onSave: () => void;
  onCancel: () => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "grid grid-cols-3 gap-4 items-end"}>
      <div className={compact ? "" : "col-span-1"}>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d" }}>Nom</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: Kente Doré"
          className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
          style={{ border: "1.5px solid #e8d9bd", color: "#14110d" }}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d" }}>Couleur 1</label>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ border: "1.5px solid #e8d9bd" }}>
            <input
              type="color"
              value={form.color1}
              onChange={(e) => setForm({ ...form, color1: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono" style={{ color: "#b08a4a" }}>{form.color1}</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#14110d" }}>Couleur 2</label>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ border: "1.5px solid #e8d9bd" }}>
            <input
              type="color"
              value={form.color2}
              onChange={(e) => setForm({ ...form, color2: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono" style={{ color: "#b08a4a" }}>{form.color2}</span>
          </div>
        </div>
        {/* Preview */}
        <div className="flex-shrink-0 self-end">
          <div
            className="w-10 h-10 rounded-lg border"
            style={{
              background: `linear-gradient(135deg, ${form.color1}, ${form.color2})`,
              borderColor: "#e8d9bd",
            }}
          />
        </div>
      </div>
      <div className={`flex gap-2 ${compact ? "" : "col-span-1 justify-end"}`}>
        <button
          onClick={onSave}
          disabled={!form.name.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-40"
          style={{ background: "#b08a4a" }}
        >
          <Check size={13} />
          Enregistrer
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all"
          style={{ border: "1.5px solid #e8d9bd", color: "#6B7280" }}
        >
          <X size={13} />
          Annuler
        </button>
      </div>
    </div>
  );
}
