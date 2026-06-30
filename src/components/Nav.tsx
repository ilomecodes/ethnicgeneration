"use client";

import { motion } from "framer-motion";
import { ShoppingBag, User, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

interface NavProps {
  scrolledPast: boolean;
  onOpenDrawer: () => void;
}

export default function Nav({ scrolledPast, onOpenDrawer }: NavProps) {
  const { t } = useLang();

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
          href="#"
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
        Ethnic Generation
        <span
          className="block font-[family-name:var(--font-nav)] not-italic font-bold text-[9px] tracking-[.38em] mt-1"
          style={{ color: markColor, transition: "color .4s" }}
        >
          EST · 2024
        </span>
      </div>

      {/* Right links */}
      <div
        className="justify-self-end flex items-center gap-8 font-[family-name:var(--font-nav)] font-semibold text-[11px] uppercase tracking-[.18em]"
        style={{ color: linkColor, transition: "color .4s" }}
      >
        <a
          href="#"
          className="no-underline hidden sm:flex items-center gap-1"
          style={{ color: linkColor, transition: "color .25s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = linkColor)}
        >
          <User size={13} strokeWidth={1.8} />
          <span className="hidden lg:inline">{t("navAccount")}</span>
        </a>
        <a
          href="#"
          className="no-underline hidden sm:flex items-center gap-1"
          style={{ color: linkColor, transition: "color .25s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = scrolledPast ? mocha : mocha2)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = linkColor)}
        >
          <ShoppingBag size={13} strokeWidth={1.8} />
          <span className="hidden lg:inline">{t("navBag")}</span>
        </a>
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
