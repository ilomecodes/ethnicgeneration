"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Globe, Play, Music2 } from "lucide-react";
import { useLang } from "@/context/LangContext";

const COL_A = ["fa1", "fa2", "fa3", "fa4", "fa5"];
const COL_B = ["fb1", "fb2", "fb3", "fb4", "fb5"];
const COL_C = ["fc1", "fc2", "fc3", "fc4", "fc5"];
const COL_D = ["fd1", "fd2", "fd3", "fd4", "fd5"];

const linkStyle: React.CSSProperties = {
  color: "rgba(246,241,230,.7)",
  textDecoration: "none",
  fontFamily: "var(--font-display)",
  fontSize: 15,
  letterSpacing: ".02em",
  transition: "color .25s",
};

function FootLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <a
        href={href}
        style={linkStyle}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#f6f1e6")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(246,241,230,.7)")}
      >
        {text}
      </a>
    </li>
  );
}

export default function Footer() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      className="pt-[110px] pb-12 px-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #4f3322 0%, #3a2618 100%)",
        color: "#f6f1e6",
      }}
    >
      {/* Wax pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 25%, rgba(246,241,230,.04) 0 30px, transparent 31px), radial-gradient(circle at 80% 70%, rgba(246,241,230,.03) 0 36px, transparent 37px), repeating-linear-gradient(45deg, transparent 0 26px, rgba(246,241,230,.018) 26px 27px), repeating-linear-gradient(-45deg, transparent 0 26px, rgba(246,241,230,.018) 26px 27px)",
        }}
      />
      {/* Watermark */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap leading-none font-[family-name:var(--font-display)] italic font-light"
        style={{ fontSize: 220, letterSpacing: "-.02em", color: "rgba(246,241,230,.05)" }}
      >
        Ethnicgeneration
      </div>

      {/* Grid */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-[60px] relative"
      >
        {[
          { heading: "footColA", links: COL_A },
          { heading: "footColB", links: COL_B },
          { heading: "footColC", links: COL_C },
          { heading: "footColD", links: COL_D },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <h4
              className="font-[family-name:var(--font-display)] italic font-normal text-[13px] tracking-[.32em] uppercase m-0 mb-7"
              style={{ color: "#d9b89a" }}
            >
              {t(heading)}
            </h4>
            <ul className="list-none p-0 m-0 grid gap-3.5">
              {links.map((key) => (
                <FootLink key={key} href="#" text={t(key)} />
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      {/* Rule */}
      <div
        className="max-w-[1280px] mx-auto mt-20 mb-8 relative"
        style={{ height: 1, background: "rgba(246,241,230,.15)" }}
      />

      {/* Bottom row */}
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 relative">
        <div
          className="font-[family-name:var(--font-display)] italic text-[13px] tracking-[.04em]"
          style={{ color: "rgba(246,241,230,.85)" }}
        >
          <span className="block text-[22px] italic">Ethnicgeneration</span>
          <span
            className="block not-italic text-[9px] tracking-[.42em] mt-1"
            style={{ color: "#d9b89a" }}
          >
            EST · 2024 · LAGOS / PARIS
          </span>
        </div>
        <div
          className="justify-self-center flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] tracking-[.26em] uppercase"
        >
          {[
            { label: "Instagram", icon: <Camera size={14} strokeWidth={1.5} /> },
            { label: "Pinterest", icon: <Globe size={14} strokeWidth={1.5} /> },
            { label: "YouTube", icon: <Play size={14} strokeWidth={1.5} /> },
            { label: "Spotify", icon: <Music2 size={14} strokeWidth={1.5} /> },
          ].map(({ label, icon }, i) => (
            <span key={label} className="flex items-center gap-3">
              {i > 0 && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(246,241,230,.3)" }}
                />
              )}
              <a
                href="#"
                className="no-underline flex items-center gap-1.5"
                style={linkStyle}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#f6f1e6")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(246,241,230,.7)")}
              >
                {icon}
                <span className="hidden lg:inline">{label}</span>
              </a>
            </span>
          ))}
        </div>
        <div
          className="justify-self-end font-[family-name:var(--font-display)] italic text-[12px] tracking-[.04em]"
          style={{ color: "rgba(246,241,230,.5)" }}
        >
          {t("footCopy")}
        </div>
      </div>
    </footer>
  );
}
