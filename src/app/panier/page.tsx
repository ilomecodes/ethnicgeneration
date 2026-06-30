"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Nav from "@/components/Nav";

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

const SHIPPING = 3200;

export default function PanierPage() {
  const { items, removeItem, updateQty, total, itemCount } = useCart();

  const grandTotal = total + (items.length > 0 ? SHIPPING : 0);

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }}>
      <Nav scrolledPast={true} onOpenDrawer={() => {}} />

      <div className="max-w-5xl mx-auto px-8 pt-32 pb-20">
        {/* Header */}
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-8"
          style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
        >
          <ArrowLeft size={13} />
          Continuer mes achats
        </Link>

        <h1
          className="font-[family-name:var(--font-display)] font-light text-[48px] leading-none mb-2"
          style={{ color: "#14110d" }}
        >
          Votre{" "}
          <em className="italic" style={{ color: "#b08a4a" }}>
            panier
          </em>
        </h1>
        <p className="text-sm mb-10" style={{ color: "#9CA3AF" }}>
          {itemCount} article{itemCount !== 1 ? "s" : ""}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-6">
            <ShoppingBag size={48} style={{ color: "rgba(20,17,13,.12)" }} />
            <p
              className="font-[family-name:var(--font-display)] italic text-2xl"
              style={{ color: "rgba(20,17,13,.35)" }}
            >
              Votre panier est vide
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase"
              style={{ background: "#14110d", color: "#f6f1e6" }}
            >
              Découvrir la boutique
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            {/* Items */}
            <div className="space-y-0">
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-6 py-6"
                  style={{
                    borderTop: idx === 0 ? "1px solid rgba(20,17,13,.1)" : undefined,
                    borderBottom: "1px solid rgba(20,17,13,.1)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                    style={{ width: 110, height: 138, background: "#ede7d9" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <p className="font-semibold text-base" style={{ color: "#14110d" }}>
                        {item.name}
                      </p>
                      <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                        Taille : {item.size}
                      </p>
                      <p
                        className="font-[family-name:var(--font-display)] text-lg font-semibold mt-2"
                        style={{ color: "#b08a4a" }}
                      >
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      {/* Qty */}
                      <div
                        className="flex items-center rounded-xl overflow-hidden border"
                        style={{ borderColor: "rgba(20,17,13,.12)" }}
                      >
                        <button
                          onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                        >
                          <Minus size={13} style={{ color: "#6B7280" }} />
                        </button>
                        <span
                          className="w-9 text-center text-sm font-semibold"
                          style={{ color: "#14110d" }}
                        >
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                        >
                          <Plus size={13} style={{ color: "#6B7280" }} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="flex items-center gap-1.5 text-xs hover:text-red-500 transition-colors"
                        style={{ color: "#9CA3AF" }}
                      >
                        <Trash2 size={13} />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="hidden md:flex flex-col items-end justify-start pt-1">
                    <p className="text-sm" style={{ color: "#9CA3AF" }}>
                      {formatPrice(item.price)} / pièce
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div
                className="bg-white rounded-3xl p-6 shadow-sm sticky top-28"
              >
                <h2
                  className="font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase mb-5"
                  style={{ color: "#14110d" }}
                >
                  Récapitulatif
                </h2>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>Sous-total</span>
                    <span style={{ color: "#14110d" }} className="font-medium">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>Livraison</span>
                    <span style={{ color: "#14110d" }} className="font-medium">
                      {formatPrice(SHIPPING)}
                    </span>
                  </div>
                  <div
                    className="border-t pt-3 flex justify-between font-semibold text-base"
                    style={{ borderColor: "rgba(20,17,13,.08)" }}
                  >
                    <span style={{ color: "#14110d" }}>Total</span>
                    <span style={{ color: "#b08a4a" }}>
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.12em] uppercase transition-opacity hover:opacity-90 mb-3"
                  style={{ background: "#14110d", color: "#f6f1e6" }}
                  onClick={() => alert("Paiement bientôt disponible — connexion Stripe en cours")}
                >
                  Passer la commande
                  <ArrowRight size={15} />
                </button>

                <Link
                  href="/compte"
                  className="block text-center text-xs py-2"
                  style={{ color: "#9CA3AF" }}
                >
                  Suivre mes commandes →
                </Link>

                {/* Guarantees */}
                <div
                  className="mt-5 pt-5 space-y-3 border-t"
                  style={{ borderColor: "rgba(20,17,13,.07)" }}
                >
                  {[
                    { icon: Truck, text: "Livraison internationale sous 5–14 jours" },
                    { icon: RotateCcw, text: "Retours sous 30 jours" },
                    { icon: ShieldCheck, text: "Paiement sécurisé SSL" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon size={14} style={{ color: "#b08a4a", flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
