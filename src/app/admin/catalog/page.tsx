"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, Package, X } from "lucide-react";
import { useCategories } from "@/context/CategoriesContext";
import Image from "next/image";

/* ── shared input style ── */
const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#b08a4a] transition-colors";

/* ── Category modal ── */
function CategoryModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: { name: string; image: string };
  onSave: (name: string, image: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [image, setImage] = useState(initial?.image ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), image.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{initial ? "Modifier la catégorie" : "Nouvelle méga-catégorie"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom *</label>
            <input
              className={inputCls}
              placeholder="ex: Robes de mariée"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Image (chemin ou URL)</label>
            <input
              className={inputCls}
              placeholder="/product-1.png"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: "#b08a4a" }}
            >
              {initial ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Subcategory modal ── */
function SubcategoryModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: string;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{initial ? "Modifier la sous-catégorie" : "Nouvelle sous-catégorie"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom *</label>
            <input
              className={inputCls}
              placeholder="ex: Robes longues"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: "#b08a4a" }}
            >
              {initial ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Confirm delete dialog ── */
function ConfirmModal({ message, onConfirm, onClose }: { message: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function CatalogPage() {
  const { categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } =
    useCategories();

  const [expanded, setExpanded] = useState<number[]>([1]);

  /* modal state */
  const [catModal, setCatModal] = useState<null | { edit?: { id: number; name: string; image: string } }>(null);
  const [subModal, setSubModal] = useState<null | { catId: number; edit?: { id: number; name: string } }>(null);
  const [confirmModal, setConfirmModal] = useState<null | { message: string; onConfirm: () => void }>(null);

  const toggle = (id: number) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Catalogue</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gérez vos méga-catégories et sous-catégories</p>
        </div>
        <button
          onClick={() => setCatModal({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nouvelle méga-catégorie</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
              <Image src={cat.image} alt={cat.name} width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.productCount} produits</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const isOpen = expanded.includes(cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Mega category row */}
              <div
                className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggle(cat.id)}
              >
                {isOpen ? (
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                )}
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#f0ebe0" }}>
                  <Image src={cat.image} alt={cat.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{cat.name}</p>
                  <p className="text-xs text-gray-400">
                    {cat.subcategories.length} sous-catégories · {cat.productCount} produits
                  </p>
                </div>
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setCatModal({ edit: { id: cat.id, name: cat.name, image: cat.image } })}
                  >
                    <Edit2 size={13} className="text-gray-400" />
                  </button>
                  <button
                    className="p-1.5 md:p-2 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={() =>
                      setConfirmModal({
                        message: `Supprimer la catégorie « ${cat.name} » et toutes ses sous-catégories ?`,
                        onConfirm: () => deleteCategory(cat.id),
                      })
                    }
                  >
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                  <button
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: "#fdf5e8", color: "#b08a4a" }}
                    onClick={() => {
                      setExpanded((prev) => prev.includes(cat.id) ? prev : [...prev, cat.id]);
                      setSubModal({ catId: cat.id });
                    }}
                  >
                    <Plus size={12} />
                    Sous-catégorie
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {isOpen && (
                <div className="border-t border-gray-50 divide-y divide-gray-50">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 ml-6 md:ml-10 hover:bg-gray-50/30 transition-colors">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#b08a4a" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{sub.name}</p>
                        <p className="text-xs text-gray-400">{sub.productCount} produits</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href="/admin/catalog/products"
                          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          <Package size={12} />
                          Produits
                        </a>
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setSubModal({ catId: cat.id, edit: { id: sub.id, name: sub.name } })}
                        >
                          <Edit2 size={13} className="text-gray-400" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          onClick={() =>
                            setConfirmModal({
                              message: `Supprimer la sous-catégorie « ${sub.name} » ?`,
                              onConfirm: () => deleteSubcategory(cat.id, sub.id),
                            })
                          }
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Mobile: add sub button inside expanded panel */}
                  <div className="px-4 py-3 ml-6 sm:hidden">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: "#fdf5e8", color: "#b08a4a" }}
                      onClick={() => setSubModal({ catId: cat.id })}
                    >
                      <Plus size={12} />
                      Sous-catégorie
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {catModal !== null && (
        <CategoryModal
          initial={catModal.edit}
          onSave={(name, image) =>
            catModal.edit ? updateCategory(catModal.edit.id, name, image) : addCategory(name, image)
          }
          onClose={() => setCatModal(null)}
        />
      )}

      {subModal !== null && (
        <SubcategoryModal
          initial={subModal.edit?.name}
          onSave={(name) =>
            subModal.edit
              ? updateSubcategory(subModal.catId, subModal.edit.id, name)
              : addSubcategory(subModal.catId, name)
          }
          onClose={() => setSubModal(null)}
        />
      )}

      {confirmModal !== null && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
