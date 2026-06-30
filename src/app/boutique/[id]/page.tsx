"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, ChevronDown, ChevronUp } from "lucide-react";
import { products } from "@/lib/admin-data";
import { useCart } from "@/context/CartContext";
import Nav from "@/components/Nav";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      priceFormatted: product.priceFormatted,
      image: product.image,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }}>
      <Nav scrolledPast={true} onOpenDrawer={() => {}} />

      <div className="max-w-6xl mx-auto px-8 pt-32 pb-20">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-10"
          style={{ fontFamily: "var(--font-nav)" }}
        >
          <Link href="/" style={{ color: "#9CA3AF" }}>Accueil</Link>
          <span style={{ color: "#D1D5DB" }}>/</span>
          <Link href="/boutique" style={{ color: "#9CA3AF" }}>Boutique</Link>
          <span style={{ color: "#D1D5DB" }}>/</span>
          <Link href={`/boutique?categorie=${product.category}`} style={{ color: "#9CA3AF" }}>
            {product.category}
          </Link>
          <span style={{ color: "#D1D5DB" }}>/</span>
          <span style={{ color: "#14110d" }}>{product.name}</span>
        </div>

        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "3/4", background: "#ede7d9" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col pt-4">
            <p
              className="text-[11px] font-semibold tracking-[.38em] uppercase mb-3"
              style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
            >
              {product.category} · {product.subcategory}
            </p>

            <h1
              className="font-[family-name:var(--font-display)] font-light text-[42px] leading-tight mb-4"
              style={{ color: "#14110d" }}
            >
              {product.name}
            </h1>

            <p
              className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-6"
              style={{ color: "#b08a4a" }}
            >
              {product.priceFormatted}
            </p>

            <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B7280" }}>
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-xs font-semibold tracking-[.2em] uppercase"
                  style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}
                >
                  Taille
                </p>
                {sizeError && (
                  <p className="text-xs text-red-500 font-medium">Veuillez choisir une taille</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
                    style={
                      selectedSize === size
                        ? { background: "#14110d", color: "#f6f1e6", borderColor: "#14110d", fontFamily: "var(--font-nav)" }
                        : sizeError
                        ? { background: "#fff", color: "#EF4444", borderColor: "#FCA5A5", fontFamily: "var(--font-nav)" }
                        : { background: "#fff", color: "#6B7280", borderColor: "rgba(20,17,13,.15)", fontFamily: "var(--font-nav)" }
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.14em] uppercase transition-all mb-4"
              style={added ? { background: "#065f46", color: "#d1fae5" } : { background: "#14110d", color: "#f6f1e6" }}
            >
              {added ? (
                <><Check size={16} />Ajouté au panier</>
              ) : (
                <><ShoppingBag size={16} />Ajouter au panier</>
              )}
            </button>

            <Link
              href="/sur-mesure"
              className="block text-center text-xs font-medium py-3"
              style={{ color: "#9CA3AF", fontFamily: "var(--font-nav)" }}
            >
              Vous souhaitez une version sur mesure ? →
            </Link>

            <div className="border-t mt-4 mb-4" style={{ borderColor: "rgba(20,17,13,.08)" }} />

            {/* Details accordion */}
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex items-center justify-between w-full py-3 text-left"
            >
              <span
                className="text-xs font-semibold tracking-[.2em] uppercase"
                style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}
              >
                Composition & entretien
              </span>
              {detailsOpen ? <ChevronUp size={16} style={{ color: "#9CA3AF" }} /> : <ChevronDown size={16} style={{ color: "#9CA3AF" }} />}
            </button>
            {detailsOpen && (
              <ul className="mt-2 space-y-2 pb-3">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#6B7280" }}>
                    <span style={{ color: "#b08a4a" }}>·</span>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t mt-1" style={{ borderColor: "rgba(20,17,13,.08)" }} />
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24">
            <p
              className="text-[11px] font-semibold tracking-[.38em] uppercase mb-2"
              style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
            >
              — Vous aimerez aussi
            </p>
            <h2
              className="font-[family-name:var(--font-display)] font-light text-3xl mb-10"
              style={{ color: "#14110d" }}
            >
              Collection {product.category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/boutique/${p.id}`} className="group block">
                  <div
                    className="relative overflow-hidden rounded-2xl mb-3"
                    style={{ aspectRatio: "3/4", background: "#ede7d9" }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#14110d" }}>{p.name}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: "#b08a4a" }}>{p.priceFormatted}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
