"use client";

import { motion } from "framer-motion";
import { ShoppingBag, User, ArrowRight } from "lucide-react";
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

  const cream = "rgba(246,241,230,0.78)";
  const ink = "#14110d";
  const mocha = "#b08a4a";
  const mocha2 = "#d9b89a";

  const linkColor = scrolledPast ? ink : cream;
  const brandColor = scrolledPast ? ink : "#f6f1e6";
  const markColor = scrolledPast ? mocha : mocha2;

  return (
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
      className="fixed top-0 left-0 right-0 h-[88px] grid grid-cols-[1fr_auto_1fr] items-center px-12 z-30"
    >
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
        className="justify-self-end flex items-center gap-8 font-[family-name:var(--font-nav)] font-semibold text-[11px] uppercase tracking-[.18em]"
        style={{ color: linkColor, transition: "color .4s" }}
      >
        {/* Language switcher */}
        <div className="hidden md:flex items-center gap-0.5 mr-1">
          {LANGS.map((l, i) => (
            <span key={l.code} className="flex items-center">
              {i > 0 && (
                <span style={{ color: linkColor, opacity: 0.25, margin: "0 3px", fontSize: 9 }}>
                  ·
                </span>
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
            className="no-underline hidden sm:flex items-center gap-2"
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
            className="no-underline hidden sm:flex items-center gap-1"
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
          className="hidden sm:flex items-center gap-1.5 bg-transparent border-0 cursor-pointer relative"
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
          className="flex items-center gap-3 no-underline"
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
    </motion.nav>
  );
}
