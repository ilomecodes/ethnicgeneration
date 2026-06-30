"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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

/* ── Social SVG icons ── */
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-label="Facebook">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-label="Instagram">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ── Payment SVG icons ── */
function IconVisa() {
  return (
    <div
      className="flex items-center justify-center rounded"
      style={{ background: "white", padding: "5px 9px", height: 32 }}
    >
      <svg viewBox="0 0 60 20" width="42" height="14" aria-label="Visa">
        {/* VISA wordmark in navy blue */}
        <text
          x="0" y="16"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="18"
          fill="#1A1F71"
          letterSpacing="-0.5"
        >
          VISA
        </text>
      </svg>
    </div>
  );
}

function IconMastercard() {
  return (
    <div
      className="flex items-center justify-center rounded gap-1"
      style={{ background: "white", padding: "5px 9px", height: 32 }}
    >
      <svg viewBox="0 0 50 32" width="44" height="28" aria-label="Mastercard">
        <circle cx="19" cy="16" r="12" fill="#EB001B" />
        <circle cx="31" cy="16" r="12" fill="#F79E1B" />
        {/* Overlap blend — simplified orange vesica */}
        <path
          d="M25 6.27C27.47 8.22 29.1 11.3 29.1 14.8s-1.63 6.58-4.1 8.53C22.53 21.38 20.9 18.3 20.9 14.8s1.63-6.58 4.1-8.53z"
          fill="#FF5F00"
        />
        {/* MC text */}
        <text x="6" y="29" fontFamily="Arial" fontWeight="700" fontSize="7" fill="#222" letterSpacing="0.5">mc</text>
      </svg>
    </div>
  );
}

function IconMTNMomo() {
  return (
    <div
      className="flex items-center justify-center rounded gap-1"
      style={{ background: "#FFC107", padding: "5px 10px", height: 32 }}
    >
      <svg viewBox="0 0 14 12" width="14" height="12" aria-hidden="true">
        <path d="M1 9 Q4 2 7 7 Q10 12 13 5" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 12, color: "#1A1A1A", letterSpacing: "0.5px" }}>
        MTN
      </span>
    </div>
  );
}

function IconOrangeMoney() {
  return (
    <div
      className="flex items-center justify-center rounded gap-1"
      style={{ background: "#FF7900", padding: "5px 10px", height: 32 }}
    >
      <div
        className="rounded-full flex-shrink-0"
        style={{ width: 10, height: 10, background: "rgba(255,255,255,0.5)", border: "2px solid white" }}
      />
      <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 12, color: "white" }}>
        Orange
      </span>
    </div>
  );
}


const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ethnicgeneration",
    icon: <IconFacebook />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ethnicgeneration",
    icon: <IconInstagram />,
  },
];

const PAYMENTS = [
  { label: "Visa", icon: <IconVisa /> },
  { label: "Mastercard", icon: <IconMastercard /> },
  { label: "MTN MoMo", icon: <IconMTNMomo /> },
  { label: "Orange Money", icon: <IconOrangeMoney /> },
];

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

      {/* Nav grid */}
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

      {/* Payment methods */}
      <div className="max-w-[1280px] mx-auto mb-8 relative flex flex-col items-center gap-3">
        <p
          className="text-[10px] tracking-[.38em] uppercase"
          style={{ color: "rgba(246,241,230,.4)", fontFamily: "var(--font-nav)" }}
        >
          Moyens de paiement acceptés
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {PAYMENTS.map(({ label, icon }) => (
            <div
              key={label}
              title={label}
              className="flex items-center justify-center rounded-lg shadow-sm overflow-hidden"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,.18)" }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Rule */}
      <div
        className="max-w-[1280px] mx-auto mb-8 relative"
        style={{ height: 1, background: "rgba(246,241,230,.08)" }}
      />

      {/* Bottom row */}
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 relative">
        {/* Brand */}
        <div
          className="font-[family-name:var(--font-display)] italic text-[13px] tracking-[.04em]"
          style={{ color: "rgba(246,241,230,.85)" }}
        >
          <span className="block text-[22px] italic">Ethnicgeneration</span>
          <span
            className="block not-italic text-[9px] tracking-[.42em] mt-1"
            style={{ color: "#d9b89a" }}
          >
            YAOUNDÉ, CAMEROON
          </span>
        </div>

        {/* Social icons — only Facebook & Instagram */}
        <div className="justify-self-center flex items-center gap-5">
          {SOCIALS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
              style={{
                color: "rgba(246,241,230,.7)",
                background: "rgba(246,241,230,.08)",
                transition: "background .25s, color .25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(176,138,74,.3)";
                el.style.color = "#f6f1e6";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(246,241,230,.08)";
                el.style.color = "rgba(246,241,230,.7)";
              }}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div
          className="justify-self-end font-[family-name:var(--font-display)] italic text-[12px] tracking-[.04em] text-right"
          style={{ color: "rgba(246,241,230,.5)" }}
        >
          {t("footCopy")}
        </div>
      </div>
    </footer>
  );
}
