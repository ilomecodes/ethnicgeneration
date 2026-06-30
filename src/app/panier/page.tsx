"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight,
  Truck, RotateCcw, ShieldCheck, Check, X, Phone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import Nav from "@/components/Nav";

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

const SHIPPING = 3200;

type PayStep = null | "choose" | "mobile-money" | "success";

const MOBILE_PROVIDERS = [
  { id: "mtn", label: "MTN MoMo", bg: "#FFC107", color: "#1A1A1A" },
  { id: "orange", label: "Orange Money", bg: "#FF7900", color: "#fff" },
];

function genOrderNum() {
  return "EG-" + Math.floor(100000 + Math.random() * 900000);
}

export default function PanierPage() {
  const { items, removeItem, updateQty, total, itemCount, clearCart } = useCart();
  const [payStep, setPayStep] = useState<PayStep>(null);
  const [provider, setProvider] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [payMethod, setPayMethod] = useState("");
  const orderRef = useRef(genOrderNum());

  const grandTotal = total + (items.length > 0 ? SHIPPING : 0);

  function confirmOrder(method: string) {
    setPayMethod(method);
    clearCart();
    setPayStep("success");
  }

  function submitMobileMoney() {
    if (phone.replace(/\s/g, "").length < 8) {
      setPhoneError(true);
      setTimeout(() => setPhoneError(false), 2000);
      return;
    }
    confirmOrder(`${provider} · ${phone}`);
  }

  return (
    <div className="min-h-screen" style={{ background: "#f6f1e6" }}>
      <Nav scrolledPast={true} onOpenDrawer={() => {}} />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-32 pb-20">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-8"
          style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}
        >
          <ArrowLeft size={13} />
          Continuer mes achats
        </Link>

        <h1
          className="font-[family-name:var(--font-display)] font-light text-[40px] sm:text-[48px] leading-none mb-2"
          style={{ color: "#14110d" }}
        >
          Votre{" "}
          <em className="italic" style={{ color: "#b08a4a" }}>panier</em>
        </h1>
        <p className="text-sm mb-10" style={{ color: "#9CA3AF" }}>
          {itemCount} article{itemCount !== 1 ? "s" : ""}
        </p>

        {items.length === 0 && payStep !== "success" ? (
          <div className="text-center py-24 flex flex-col items-center gap-6">
            <ShoppingBag size={48} style={{ color: "rgba(20,17,13,.12)" }} />
            <p className="font-[family-name:var(--font-display)] italic text-2xl" style={{ color: "rgba(20,17,13,.35)" }}>
              Votre panier est vide
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase"
              style={{ background: "#14110d", color: "#f6f1e6" }}
            >
              Découvrir la boutique <ArrowRight size={14} />
            </Link>
          </div>
        ) : payStep === "success" ? (
          /* ── ORDER SUCCESS ── */
          <div className="text-center py-20 flex flex-col items-center gap-6 max-w-md mx-auto">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#065f46" }}
            >
              <Check size={28} color="#d1fae5" />
            </div>
            <h2
              className="font-[family-name:var(--font-display)] font-light text-[34px] leading-tight"
              style={{ color: "#14110d" }}
            >
              Commande confirmée !
            </h2>
            <div
              className="rounded-2xl px-8 py-5 text-center"
              style={{ background: "rgba(20,17,13,.05)" }}
            >
              <p className="text-xs font-semibold tracking-[.28em] uppercase mb-1" style={{ color: "#b08a4a", fontFamily: "var(--font-nav)" }}>
                Numéro de commande
              </p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-light" style={{ color: "#14110d" }}>
                {orderRef.current}
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              {payMethod.startsWith("livraison")
                ? "Vous paierez en espèces à la réception de votre colis."
                : `Nous allons vous contacter au ${phone} pour finaliser le paiement ${provider}.`}
              <br />Notre équipe vous confirme votre commande sous 24h.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase"
              style={{ background: "#14110d", color: "#f6f1e6" }}
            >
              Retour à la boutique <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            {/* Items list */}
            <div className="space-y-0">
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 sm:gap-6 py-6"
                  style={{
                    borderTop: idx === 0 ? "1px solid rgba(20,17,13,.1)" : undefined,
                    borderBottom: "1px solid rgba(20,17,13,.1)",
                  }}
                >
                  <div
                    className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                    style={{ width: 90, height: 112, background: "#ede7d9" }}
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover object-top" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: "#14110d" }}>{item.name}</p>
                      <p className="text-xs sm:text-sm mt-1" style={{ color: "#9CA3AF" }}>Taille : {item.size}</p>
                      <p className="font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold mt-2" style={{ color: "#b08a4a" }}>
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: "rgba(20,17,13,.12)" }}>
                        <button onClick={() => updateQty(item.productId, item.size, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors">
                          <Minus size={12} style={{ color: "#6B7280" }} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold" style={{ color: "#14110d" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, item.size, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors">
                          <Plus size={12} style={{ color: "#6B7280" }} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.productId, item.size)} className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors" style={{ color: "#9CA3AF" }}>
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-28">
                <h2 className="font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.1em] uppercase mb-5" style={{ color: "#14110d" }}>
                  Récapitulatif
                </h2>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>Sous-total</span>
                    <span className="font-medium" style={{ color: "#14110d" }}>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#6B7280" }}>Livraison</span>
                    <span className="font-medium" style={{ color: "#14110d" }}>{formatPrice(SHIPPING)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-base" style={{ borderColor: "rgba(20,17,13,.08)" }}>
                    <span style={{ color: "#14110d" }}>Total</span>
                    <span style={{ color: "#b08a4a" }}>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.12em] uppercase transition-opacity hover:opacity-90 mb-3"
                  style={{ background: "#14110d", color: "#f6f1e6" }}
                  onClick={() => setPayStep("choose")}
                >
                  Commander <ArrowRight size={15} />
                </button>

                <Link href="/compte" className="block text-center text-xs py-2" style={{ color: "#9CA3AF" }}>
                  Suivre mes commandes →
                </Link>

                <div className="mt-5 pt-5 space-y-3 border-t" style={{ borderColor: "rgba(20,17,13,.07)" }}>
                  {[
                    { icon: Truck, text: "Livraison sous 5–14 jours" },
                    { icon: RotateCcw, text: "Retours sous 30 jours" },
                    { icon: ShieldCheck, text: "Paiement sécurisé" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon size={14} style={{ color: "#b08a4a", flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── PAYMENT MODAL ── */}
      {payStep === "choose" && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(20,17,13,.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setPayStep(null); }}
        >
          <div
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8"
            style={{ boxShadow: "0 40px 80px rgba(0,0,0,.3)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-display)] font-light text-2xl" style={{ color: "#14110d" }}>
                Mode de paiement
              </h3>
              <button onClick={() => setPayStep(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
                <X size={16} style={{ color: "#9CA3AF" }} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Cash on delivery */}
              <button
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
                style={{ borderColor: "rgba(20,17,13,.1)", background: "#fafaf9" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#b08a4a")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(20,17,13,.1)")}
                onClick={() => confirmOrder("livraison")}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f0e8d9" }}>
                  <Truck size={18} style={{ color: "#b08a4a" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#14110d" }}>Paiement à la livraison</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Payez en espèces à la réception</p>
                </div>
              </button>

              {/* Mobile Money */}
              <button
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
                style={{ borderColor: "rgba(20,17,13,.1)", background: "#fafaf9" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#b08a4a")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(20,17,13,.1)")}
                onClick={() => setPayStep("mobile-money")}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f0e8d9" }}>
                  <Phone size={18} style={{ color: "#b08a4a" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#14110d" }}>Mobile Money</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>MTN MoMo · Orange Money · Wave</p>
                </div>
              </button>
            </div>

            <p className="text-center text-xs mt-4" style={{ color: "#D1D5DB" }}>
              Paiement par carte bientôt disponible
            </p>
          </div>
        </div>
      )}

      {payStep === "mobile-money" && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(20,17,13,.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setPayStep("choose"); }}
        >
          <div
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8"
            style={{ boxShadow: "0 40px 80px rgba(0,0,0,.3)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setPayStep("choose")}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <ArrowLeft size={15} style={{ color: "#9CA3AF" }} />
              </button>
              <h3 className="font-[family-name:var(--font-display)] font-light text-2xl" style={{ color: "#14110d" }}>
                Mobile Money
              </h3>
            </div>

            {/* Provider selection */}
            <p className="text-xs font-semibold tracking-[.2em] uppercase mb-3" style={{ color: "#6B7280", fontFamily: "var(--font-nav)" }}>
              Opérateur
            </p>
            <div className="flex gap-2 mb-5">
              {MOBILE_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.label)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2"
                  style={
                    provider === p.label
                      ? { background: p.bg, color: p.color, borderColor: p.bg }
                      : { background: "#f5f5f4", color: "#6B7280", borderColor: "transparent" }
                  }
                >
                  {p.id === "mtn" ? "MTN" : p.id === "orange" ? "Orange" : "Wave"}
                </button>
              ))}
            </div>

            {/* Phone number */}
            <p className="text-xs font-semibold tracking-[.2em] uppercase mb-2" style={{ color: "#6B7280", fontFamily: "var(--font-nav)" }}>
              Numéro de téléphone
            </p>
            <div
              className="flex items-center gap-2 rounded-xl border-2 px-3 py-3 mb-5 transition-colors"
              style={{ borderColor: phoneError ? "#FCA5A5" : "rgba(20,17,13,.12)", background: "#fafaf9" }}
            >
              <Phone size={15} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <input
                type="tel"
                placeholder="6XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "#14110d", fontFamily: "var(--font-nav)" }}
              />
            </div>
            {phoneError && <p className="text-xs text-red-500 -mt-3 mb-4">Veuillez entrer un numéro valide</p>}

            <button
              onClick={submitMobileMoney}
              disabled={!provider}
              className="w-full py-4 rounded-2xl font-[family-name:var(--font-nav)] font-semibold text-sm tracking-[.12em] uppercase transition-opacity disabled:opacity-40"
              style={{ background: "#14110d", color: "#f6f1e6" }}
            >
              Confirmer la commande · {formatPrice(grandTotal)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
