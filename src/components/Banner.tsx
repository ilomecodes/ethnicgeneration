"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

interface BannerProps {
  onOpenDrawer: () => void;
}

export default function Banner({ onOpenDrawer }: BannerProps) {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-[160px] px-12 relative overflow-hidden"
      style={{ background: "#14110d", color: "#f6f1e6" }}
    >
      {/* Wax pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(246,241,230,.04) 0 24px, transparent 25px), radial-gradient(circle at 75% 70%, rgba(246,241,230,.03) 0 28px, transparent 29px), repeating-linear-gradient(45deg, transparent 0 28px, rgba(246,241,230,.018) 28px 29px)",
        }}
      />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        className="max-w-[880px] mx-auto text-center relative"
      >
        <div
          className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.42em] uppercase"
          style={{ color: "#d9b89a" }}
        >
          {t("bnK")}
        </div>
        <h2
          className="font-[family-name:var(--font-display)] font-light text-[88px] leading-none tracking-[-0.01em] my-7"
          style={{ color: "#f6f1e6" }}
        >
          {t("bnTitleA")}
          <br />
          <em className="italic" style={{ color: "#d9b89a" }}>
            {t("bnTitleB")}
          </em>
        </h2>
        <p
          className="font-[family-name:var(--font-display)] italic text-[20px] max-w-[580px] mx-auto mb-12 leading-relaxed"
          style={{ color: "rgba(246,241,230,.75)" }}
        >
          {t("bnLede")}
        </p>
        <a
          href="/sur-mesure"
          className="inline-flex items-center gap-4 px-12 py-[22px] font-[family-name:var(--font-display)] text-[13px] tracking-[.32em] uppercase cursor-pointer no-underline"
          style={{
            color: "#14110d",
            background: "#f6f1e6",
            border: "1px solid #f6f1e6",
            transition: "background .3s, color .3s, border-color .3s, gap .3s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "#b08a4a";
            el.style.color = "#f6f1e6";
            el.style.borderColor = "#b08a4a";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "#f6f1e6";
            el.style.color = "#14110d";
            el.style.borderColor = "#f6f1e6";
          }}
        >
          <span>{t("bnCTA")}</span>
          <ArrowRight size={18} strokeWidth={1.5} />
        </a>
        <div
          className="mt-5 font-[family-name:var(--font-display)] italic text-[12px] tracking-[.12em]"
          style={{ color: "rgba(246,241,230,.4)" }}
        >
          {t("bnHint")}
        </div>
      </motion.div>
    </section>
  );
}
