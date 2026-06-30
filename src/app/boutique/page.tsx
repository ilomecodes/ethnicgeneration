"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { products } from "@/lib/admin-data";
import Nav from "@/components/Nav";

const CATEGORIES = ["Tous", "Femmes", "Hommes", "Enfants"];

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("categorie") || "Tous";
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    let list = cat === "Tous" ? [...products] : products.filter((p) => p.category === cat);
    if (sort === "price-asc") list = list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = list.sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort]);

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }}>
      <Nav scrolledPast={true} onOpenDrawer={() => {}} />

      <div className="max-w-7xl mx-auto px-8 pt-32 pb-20">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-8"
          style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
        >
          <ArrowLeft size={13} />
          Accueil
        </Link>

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p
              className="text-[11px] font-semibold tracking-[.38em] uppercase mb-2"
              style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
            >
              — Collections de la Maison
            </p>
            <h1
              className="font-[family-name:var(--font-display)] font-light text-[56px] leading-none"
              style={{ color: "#14110d" }}
            >
              {cat === "Tous" ? (
                <>
                  La{" "}
                  <em className="italic" style={{ color: "#b08a4a" }}>
                    boutique
                  </em>
                </>
              ) : (
                <>
                  Collection{" "}
                  <em className="italic" style={{ color: "#b08a4a" }}>
                    {cat}
                  </em>
                </>
              )}
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#9CA3AF" }}>
              {filtered.length} pièce{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} style={{ color: "#9CA3AF" }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-white rounded-xl px-4 py-2.5 border-0 outline-none shadow-sm"
              style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}
            >
              <option value="default">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="px-5 py-2 rounded-full text-[11px] font-semibold tracking-[.2em] uppercase transition-all"
              style={
                cat === c
                  ? { background: "#14110d", color: "#f6f1e6", fontFamily: "var(--font-nav)" }
                  : { background: "#fff", color: "#6B7280", fontFamily: "var(--font-nav)" }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/boutique/${product.id}`}
              className="group block"
            >
              {/* Image */}
              <div
                className="relative overflow-hidden rounded-2xl mb-4"
                style={{ aspectRatio: "3/4", background: "#ede7d9" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Category badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[.2em] uppercase"
                  style={{ background: "rgba(246,241,230,.9)", color: "#b08a4a", fontFamily: "var(--font-nav)" }}
                >
                  {product.category}
                </div>
              </div>

              {/* Info */}
              <div className="px-1">
                <p
                  className="font-semibold text-sm leading-tight group-hover:text-[#b08a4a] transition-colors"
                  style={{ color: "#14110d" }}
                >
                  {product.name}
                </p>
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: "#b08a4a", fontFamily: "var(--font-display)" }}
                >
                  {product.priceFormatted}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {product.sizes.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-[9px] px-1.5 py-0.5 rounded border"
                      style={{ borderColor: "rgba(20,17,13,.15)", color: "#9CA3AF", fontFamily: "var(--font-nav)" }}
                    >
                      {s}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span
                      className="text-[9px] px-1.5 py-0.5"
                      style={{ color: "#9CA3AF" }}
                    >
                      +{product.sizes.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p
              className="font-[family-name:var(--font-display)] italic text-2xl"
              style={{ color: "rgba(20,17,13,.3)" }}
            >
              Aucun article dans cette catégorie
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense>
      <BoutiqueContent />
    </Suspense>
  );
}
