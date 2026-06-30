"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, ArrowRight, Menu, X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

interface NavProps {
  scrolledPast: boolean;
  onOpenDrawer: () => void;
}

export default function Nav({ scrolledPast, onOpenDrawer }: NavProps) {
  const { t, lang, setLang } = useLang();
  const { user } = useAuth();
  const { openCart, itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const cream = "rgba(246,241,230,0.78)";
  const ink = "#14110d";
  const mocha = "#b08a4a";
  const mocha2 = "#d9b89a";

  const linkColor = scrolledPast ? ink : cream;
  const brandColor = scrolledPast ? ink : "#f6f1e6";

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.7 }}
        style={{
          background: scrolledPast ? "#f6f1e6" : "transparent",
          borderBottom: scrolledPast ? "1px solid rgba(20,17,13,.1)" : "none",
          boxShadow: scrolledPast ? "0 2px 18px rgba(20,17,13,.04)" : "none",
          transition: "background .5s, border-color .5s, box-shadow .5s",
        }}
        className="fixed top-0 left-0 right-0 h-[72px] md:h-[88px] z-30 px-5 md:px-12 flex items-center"
      >
        {/* ── MOBILE layout ── */}
        <div className="flex md:hidden w-full items-center justify-between">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center -ml-2"
            aria-label="Menu"
            style={{ color: linkColor, background: "none", border: "none", cursor: "pointer" }}
          >
            <Menu size={22} strokeWidth={1.6} />
          </button>

          {/* Brand */}
          <a
            href="/"
            className="font-[family-name:var(--font-display)] italic font-medium text-[22px] tracking-[.04em] leading-none no-underline"
            style={{ color: brandColor, transition: "color .4s" }}
          >
            Ethnicgeneration
          </a>

          {/* Cart */}
          <button
            onClick={openCart}
            className="w-10 h-10 flex items-center justify-center -mr-2 relative"
            style={{ color: linkColor, background: "none", border: "none", cursor: "pointer" }}
          >
            <ShoppingBag size={20} strokeWidth={1.6} />
            {itemCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "#b08a4a", color: "#fff" }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden md:grid w-full grid-cols-[1fr_auto_1fr] items-center">
          {/* Left links */}
          <div
            className="flex gap-8 font-[family-name:var(--font-nav)] font-semibold text-[11px] uppercase tracking-[.18em]"
            style={{ color: linkColor, transition: "color .4s" }}
          >
            <a
              href="#"
              className="no-underline"
              style={{ color: linkColor, transition: "color .25s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = linkColor)}
            >
              {t("navAtelier")}
            </a>
            <a
              href="/boutique"
              className="no-underline"
              style={{ color: linkColor, transition: "color .25s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = linkColor)}
            >
              {t("navStores")}
            </a>
          </div>

          {/* Brand */}
          <div
            className="justify-self-center text-center font-[family-name:var(--font-display)] italic font-medium text-[26px] tracking-[.04em] leading-none"
            style={{ color: brandColor, transition: "color .4s" }}
          >
            Ethnicgeneration
          </div>

          {/* Right links */}
          <div
            className="justify-self-end flex items-center gap-6 font-[family-name:var(--font-nav)] font-semibold text-[11px] uppercase tracking-[.18em]"
            style={{ color: linkColor, transition: "color .4s" }}
          >
            {/* Language switcher */}
            <div className="flex items-center gap-0.5">
              {LANGS.map((l, i) => (
                <span key={l.code} className="flex items-center">
                  {i > 0 && (
                    <span style={{ color: linkColor, opacity: 0.25, margin: "0 3px", fontSize: 9 }}>·</span>
                  )}
                  <button
                    onClick={() => setLang(l.code)}
                    className="bg-transparent border-0 cursor-pointer px-0.5 py-1"
                    style={{
                      fontFamily: "var(--font-nav)",
                      fontSize: "9px",
                      fontWeight: lang === l.code ? 700 : 400,
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      color: lang === l.code ? (scrolledPast ? "#b08a4a" : "#d9b89a") : linkColor,
                      transition: "color .25s",
                      textDecoration: lang === l.code ? "underline" : "none",
                      textDecorationColor: "#b08a4a",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {l.label}
                  </button>
                </span>
              ))}
            </div>

            {user ? (
              <a
                href="/compte"
                className="no-underline flex items-center gap-2"
                style={{ color: linkColor, transition: "color .25s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = linkColor)}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                  style={{ background: "#b08a4a" }}
                >
                  {user.initials}
                </div>
                <span className="hidden lg:inline text-[11px]">{user.name.split(" ")[0]}</span>
              </a>
            ) : (
              <a
                href="/connexion"
                className="no-underline flex items-center gap-1"
                style={{ color: linkColor, transition: "color .25s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = linkColor)}
              >
                <User size={13} strokeWidth={1.8} />
                <span className="hidden lg:inline">{t("navAccount")}</span>
              </a>
            )}

            <button
              onClick={openCart}
              className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer relative"
              style={{ color: linkColor, transition: "color .25s", fontFamily: "var(--font-nav)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".18em" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = linkColor)}
            >
              <span className="relative">
                <ShoppingBag size={13} strokeWidth={1.8} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: "#b08a4a", color: "#fff" }}
                  >
                    {itemCount}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline">{itemCount > 0 ? `Panier (${itemCount})` : t("navBag")}</span>
            </button>

            <a
              href="/sur-mesure"
              className="flex items-center gap-2 no-underline"
              style={{
                color: scrolledPast ? ink : "#f6f1e6",
                borderBottom: `1.5px solid ${scrolledPast ? ink : mocha2}`,
                paddingBottom: "3px",
                fontFamily: "var(--font-nav)",
                fontSize: "11px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontWeight: 700,
                transition: "color .25s, border-color .25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = scrolledPast ? mocha : mocha2;
                (e.currentTarget as HTMLElement).style.borderBottomColor = mocha;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = scrolledPast ? ink : "#f6f1e6";
                (e.currentTarget as HTMLElement).style.borderBottomColor = scrolledPast ? ink : mocha2;
              }}
            >
              {t("navCustom")}
              <ArrowRight size={13} strokeWidth={2} />
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(20,17,13,.45)", backdropFilter: "blur(3px)" }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[80vw] max-w-[320px] flex flex-col"
              style={{ background: "#1a0e07" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-8">
                <span
                  className="font-[family-name:var(--font-display)] italic text-[20px] tracking-[.04em]"
                  style={{ color: "#f6f1e6" }}
                >
                  Ethnicgeneration
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(246,241,230,.08)", color: "rgba(246,241,230,.7)", border: "none", cursor: "pointer" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-6 flex flex-col gap-1">
                {[
                  { label: t("navAtelier"), href: "#" },
                  { label: t("navStores"), href: "/boutique" },
                  { label: user ? t("navAccount") : t("navAccount"), href: user ? "/compte" : "/connexion" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="font-[family-name:var(--font-display)] font-light text-[32px] leading-tight no-underline py-2"
                    style={{ color: "rgba(246,241,230,.85)", transition: "color .2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#d9b89a")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(246,241,230,.85)")}
                  >
                    {label}
                  </a>
                ))}

                {/* CTA */}
                <a
                  href="/sur-mesure"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex items-center gap-3 no-underline font-[family-name:var(--font-nav)] font-bold text-[11px] tracking-[.24em] uppercase py-2"
                  style={{ color: "#f6f1e6", borderBottom: "1.5px solid #b08a4a", paddingBottom: "4px", alignSelf: "flex-start" }}
                >
                  {t("navCustom")}
                  <ArrowRight size={12} strokeWidth={2} />
                </a>
              </nav>

              {/* Footer: lang + user */}
              <div className="px-6 pb-10 pt-6 border-t" style={{ borderColor: "rgba(246,241,230,.08)" }}>
                {/* Language */}
                <div className="flex items-center gap-3 mb-5">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); }}
                      className="text-[10px] tracking-[.28em] uppercase font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        fontFamily: "var(--font-nav)",
                        background: lang === l.code ? "#b08a4a" : "rgba(246,241,230,.08)",
                        color: lang === l.code ? "#f6f1e6" : "rgba(246,241,230,.5)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                {user ? (
                  <a
                    href="/compte"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 no-underline"
                    style={{ color: "rgba(246,241,230,.6)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: "#b08a4a" }}
                    >
                      {user.initials}
                    </div>
                    <span className="text-sm" style={{ fontFamily: "var(--font-nav)" }}>{user.name}</span>
                  </a>
                ) : (
                  <a
                    href="/connexion"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 no-underline text-sm"
                    style={{ color: "rgba(246,241,230,.5)", fontFamily: "var(--font-nav)" }}
                  >
                    <User size={14} strokeWidth={1.6} />
                    {t("navAccount")}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
