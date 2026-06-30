"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, itemCount } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(20,17,13,.45)", backdropFilter: "blur(2px)" }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[61] flex flex-col"
            style={{
              width: "min(420px, 100vw)",
              background: "#f6f1e6",
              boxShadow: "-8px 0 40px rgba(20,17,13,.18)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
              style={{ borderColor: "rgba(20,17,13,.1)" }}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={17} style={{ color: "#b08a4a" }} />
                <span
                  className="font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase"
                  style={{ color: "#14110d" }}
                >
                  Panier
                </span>
                {itemCount > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#b08a4a", color: "#fff" }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl transition-colors hover:bg-black/5"
              >
                <X size={18} style={{ color: "#6B7280" }} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <ShoppingBag size={40} style={{ color: "rgba(20,17,13,.15)" }} />
                  <p
                    className="font-[family-name:var(--font-display)] italic text-lg text-center"
                    style={{ color: "rgba(20,17,13,.4)" }}
                  >
                    Votre panier est vide
                  </p>
                  <Link
                    href="/boutique"
                    onClick={closeCart}
                    className="mt-2 font-[family-name:var(--font-nav)] font-semibold text-[11px] tracking-[.24em] uppercase px-5 py-3 rounded-xl transition-colors"
                    style={{ background: "#14110d", color: "#f6f1e6" }}
                  >
                    Découvrir la boutique
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 py-4 border-b"
                    style={{ borderColor: "rgba(20,17,13,.07)" }}
                  >
                    {/* Image */}
                    <div
                      className="relative flex-shrink-0 rounded-xl overflow-hidden"
                      style={{ width: 80, height: 100, background: "#ede7d9" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm leading-tight"
                        style={{ color: "#14110d" }}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                        Taille : {item.size}
                      </p>
                      <p
                        className="text-sm font-bold mt-1"
                        style={{ color: "#b08a4a" }}
                      >
                        {formatPrice(item.price * item.qty)}
                      </p>

                      {/* Qty + remove */}
                      <div className="flex items-center gap-3 mt-3">
                        <div
                          className="flex items-center gap-0 rounded-lg overflow-hidden border"
                          style={{ borderColor: "rgba(20,17,13,.12)" }}
                        >
                          <button
                            onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                          >
                            <Minus size={12} style={{ color: "#6B7280" }} />
                          </button>
                          <span
                            className="w-8 text-center text-sm font-semibold"
                            style={{ color: "#14110d" }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
                          >
                            <Plus size={12} style={{ color: "#6B7280" }} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} style={{ color: "#EF4444" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="flex-shrink-0 px-6 py-5 border-t space-y-4"
                style={{ borderColor: "rgba(20,17,13,.1)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: "#6B7280" }}>
                    Total
                  </span>
                  <span
                    className="font-[family-name:var(--font-display)] text-xl font-semibold"
                    style={{ color: "#14110d" }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Livraison calculée à l'étape suivante
                </p>
                <Link
                  href="/panier"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase transition-opacity hover:opacity-90"
                  style={{ background: "#14110d", color: "#f6f1e6" }}
                >
                  Commander
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/boutique"
                  onClick={closeCart}
                  className="block text-center text-xs font-medium underline underline-offset-2"
                  style={{ color: "#9CA3AF" }}
                >
                  Continuer mes achats
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
