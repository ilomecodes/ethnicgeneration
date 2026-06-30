"use client";

import { useRef, useState } from "react";
import { Search, Plus, Edit2, Trash2, X, Star, Image as ImageIcon } from "lucide-react";
import { megaCategories } from "@/lib/admin-data";
import type { Product } from "@/lib/admin-data";
import { useProducts } from "@/context/ProductsContext";
import Image from "next/image";

const CATEGORIES: Product["category"][] = ["Femmes", "Hommes", "Enfants"];

type FormState = {
  name: string;
  price: string;
  category: Product["category"];
  subcategory: string;
  images: string[];
  sizes: string;
  description: string;
  details: string[];
  inStock: boolean;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  price: "",
  category: "Femmes",
  subcategory: "",
  images: [],
  sizes: "",
  description: "",
  details: [],
  inStock: true,
  featured: false,
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    price: String(p.price),
    category: p.category,
    subcategory: p.subcategory,
    images: p.images,
    sizes: p.sizes.join(", "),
    description: p.description,
    details: p.details,
    inStock: p.inStock,
    featured: p.featured,
  };
}

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const catOptions = ["Tous", ...megaCategories.filter((c) => c.name !== "Accessoires").map((c) => c.name)];

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (catFilter === "Tous" || p.category === catFilter)
  );

  const subcategoryOptions =
    megaCategories.find((c) => c.name === form?.category)?.subcategories ?? [];

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm(productToForm(p));
  };

  const closeModal = () => {
    setEditingId(null);
    setForm(null);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !form) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setForm((prev) => (prev ? { ...prev, images: [...prev.images, dataUrl] } : prev));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setForm((prev) =>
      prev ? { ...prev, images: prev.images.filter((_, i) => i !== idx) } : prev
    );
  };

  const setCoverImage = (idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const images = [...prev.images];
      const [img] = images.splice(idx, 1);
      images.unshift(img);
      return { ...prev, images };
    });
  };

  const addDetail = () => {
    setForm((prev) => (prev ? { ...prev, details: [...prev.details, ""] } : prev));
  };

  const updateDetail = (idx: number, value: string) => {
    setForm((prev) =>
      prev ? { ...prev, details: prev.details.map((d, i) => (i === idx ? value : d)) } : prev
    );
  };

  const removeDetail = (idx: number) => {
    setForm((prev) =>
      prev ? { ...prev, details: prev.details.filter((_, i) => i !== idx) } : prev
    );
  };

  const handleSubmit = () => {
    if (!form) return;
    if (!form.name.trim() || !form.price || form.images.length === 0) return;

    const price = Number(form.price);
    const payload: Omit<Product, "id" | "sales"> = {
      name: form.name.trim(),
      price,
      priceFormatted: `${price.toLocaleString("fr-FR")} FCFA`,
      category: form.category,
      subcategory: form.subcategory,
      images: form.images,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: form.description.trim(),
      details: form.details.map((d) => d.trim()).filter(Boolean),
      inStock: form.inStock,
      featured: form.featured,
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    closeModal();
  };

  const handleDelete = (p: Product) => {
    if (confirm(`Supprimer « ${p.name} » du catalogue ?`)) {
      deleteProduct(p.id);
    }
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Produits</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} produits dans le catalogue</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: "#b08a4a" }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Ajouter un produit</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm flex-1 min-w-[160px] max-w-sm">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="text-sm text-gray-700 placeholder-gray-400 outline-none flex-1 bg-transparent min-w-0"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {catOptions.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={
                catFilter === c
                  ? { background: "#b08a4a", color: "#fff" }
                  : { background: "#fff", color: "#6B7280" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
            <div className="relative h-44 overflow-hidden" style={{ background: "#f0ebe0" }}>
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {p.images.length > 1 && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ background: "rgba(20,17,13,.6)" }}>
                  <ImageIcon size={10} />
                  {p.images.length}
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Edit2 size={13} className="text-gray-500" />
                </button>
                <button onClick={() => handleDelete(p)} className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-bold" style={{ color: "#b08a4a" }}>{p.priceFormatted}</p>
                <p className="text-xs text-gray-400">{p.sales} ventes</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit modal */}
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(20,17,13,.5)" }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId ? "Modifier le produit" : "Ajouter un produit"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Images */}
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2">
                  Photos du produit
                </label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-xl overflow-hidden group" style={{ background: "#f0ebe0" }}>
                      <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ background: "#b08a4a" }}>
                          Couverture
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => setCoverImage(idx)}
                            title="Définir comme couverture"
                            className="p-1 bg-white rounded-md"
                          >
                            <Star size={11} className="text-gray-600" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          title="Supprimer"
                          className="p-1 bg-white rounded-md"
                        >
                          <X size={11} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-500 hover:border-gray-400"
                    style={{ borderColor: "#D1D5DB" }}
                  >
                    <Plus size={16} />
                    <span className="text-[10px]">Ajouter</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Ajoutez plusieurs photos (face, dos, détails, porté). La première est utilisée comme couverture.
                </p>
              </div>

              {/* Name / price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">Nom</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400"
                    placeholder="Robe Patchwork Wax"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">Prix (FCFA)</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^0-9]/g, "") })}
                    inputMode="numeric"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400"
                    placeholder="59000"
                  />
                </div>
              </div>

              {/* Category / subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as Product["category"], subcategory: "" })
                    }
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">Sous-catégorie</label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">—</option>
                    {subcategoryOptions.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">
                  Tailles disponibles
                </label>
                <input
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400"
                  placeholder="XS, S, M, L, XL"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">Séparez les tailles par des virgules.</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-gray-400 resize-none"
                  placeholder="Décrivez la coupe, le tissu, les finitions..."
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">
                  Composition & entretien
                </label>
                <div className="space-y-2">
                  {form.details.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={d}
                        onChange={(e) => updateDetail(idx, e.target.value)}
                        className="flex-1 text-sm px-3.5 py-2 rounded-xl border border-gray-200 outline-none focus:border-gray-400"
                        placeholder="100% coton wax authentique"
                      />
                      <button type="button" onClick={() => removeDetail(idx)} className="p-2 rounded-lg hover:bg-gray-100">
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDetail}
                    className="text-xs font-medium flex items-center gap-1"
                    style={{ color: "#b08a4a" }}
                  >
                    <Plus size={12} /> Ajouter une ligne
                  </button>
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  />
                  En stock
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Mis en avant
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim() || !form.price || form.images.length === 0}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40"
                style={{ background: "#b08a4a" }}
              >
                {editingId ? "Enregistrer" : "Ajouter le produit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
