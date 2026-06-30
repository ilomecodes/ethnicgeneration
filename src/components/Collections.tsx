"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

const CARDS = [
  { eyebrowKey: "col1Kicker", nameKey: "col1Name", image: "/product-1.png", href: "/boutique?categorie=Femmes" },
  { eyebrowKey: "col2Kicker", nameKey: "col2Name", image: "/product-2.png", href: "/boutique?categorie=Hommes" },
  { eyebrowKey: "col3Kicker", nameKey: "col3Name", image: "/product-3.png", href: "/boutique?categorie=Enfants" },
];

function CollectionCard({
  eyebrowKey,
  nameKey,
  image,
  href,
  delay,
}: {
  eyebrowKey: string;
  nameKey: string;
  image: string;
  href: string;
  delay: number;
}) {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay }}
      className="flex flex-col gap-8"
    >
      <Link
        href={href}
        className="block relative overflow-hidden"
        style={{ aspectRatio: "3/4", background: "#ede7d9" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-[1400ms]"
          style={{ transform: "scale(1)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: "top center" }}
          />
        </div>
      </Link>
      <div className="flex flex-col items-center text-center gap-3.5 px-3">
        <div
          className="font-[family-name:var(--font-nav)] font-semibold text-[11px] tracking-[.38em] uppercase"
          style={{ color: "#b08a4a" }}
        >
          {t(eyebrowKey)}
        </div>
        <h3
          className="font-[family-name:var(--font-display)] font-normal text-[30px] tracking-[.01em] m-0"
          style={{ color: "#14110d" }}
        >
          {t(nameKey)}
        </h3>
        <Link
          href={href}
          className="font-[family-name:var(--font-nav)] font-semibold text-[11px] tracking-[.32em] uppercase no-underline inline-flex items-center gap-2 mt-1.5 pb-1"
          style={{
            color: "#14110d",
            borderBottom: "1.5px solid #14110d",
            transition: "color .25s, border-color .25s, letter-spacing .25s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#b08a4a";
            el.style.borderColor = "#b08a4a";
            el.style.letterSpacing = ".36em";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#14110d";
            el.style.borderColor = "#14110d";
            el.style.letterSpacing = ".32em";
          }}
        >
          {t("colCTA")}
          <ArrowRight size={11} strokeWidth={2} />
        </Link>
      </div>
    </motion.article>
  );
}

export default function Collections() {
  const { t } = useLang();
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section
      className="px-16 py-[200px]"
      style={{ background: "#f6f1e6", color: "#14110d" }}
    >
      <motion.header
        ref={headRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        className="max-w-[1440px] mx-auto mb-[140px] text-center"
      >
        <div
          className="font-[family-name:var(--font-nav)] font-semibold text-[11px] tracking-[.42em] uppercase"
          style={{ color: "#b08a4a" }}
        >
          {t("atKicker")}
        </div>
        <h2
          className="font-[family-name:var(--font-display)] font-normal text-[88px] leading-none m-0 mt-7"
          style={{ color: "#14110d" }}
        >
          {t("atTitleA")}{" "}
          <em className="italic font-normal" style={{ color: "#b08a4a" }}>
            {t("atTitleB")}
          </em>
        </h2>
      </motion.header>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {CARDS.map((card, i) => (
          <CollectionCard key={card.nameKey} {...card} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
