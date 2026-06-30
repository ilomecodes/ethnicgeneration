"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLang } from "@/context/LangContext";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["drStep1", "drStep2", "drStep3"];

export default function Drawer({ open, onClose }: DrawerProps) {
  const { t } = useLang();
  const [activeStep, setActiveStep] = useState(0);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-ui)",
    fontSize: 15,
    color: "#14110d",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(20,17,13,.2)",
    padding: "8px 0",
    outline: "none",
    width: "100%",
    transition: "border-color .25s",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[80]"
            style={{ background: "rgba(20,17,13,.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[90] overflow-y-auto"
            style={{
              width: "min(540px, 100vw)",
              background: "#f6f1e6",
              color: "#14110d",
              padding: "56px 48px 48px",
              boxShadow: "-30px 0 80px rgba(20,17,13,.3)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t("drK")}
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div
                className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.32em] uppercase"
                style={{ color: "#b08a4a" }}
              >
                {t("drK")}
              </div>
              <button
                onClick={onClose}
                className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center w-9 h-9"
                style={{ color: "#14110d" }}
                aria-label="Fermer"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <h3
              className="font-[family-name:var(--font-display)] font-light text-[44px] leading-[1.05] tracking-[-0.01em] mt-6 mb-3"
            >
              {t("drTitle")}
            </h3>
            <p
              className="font-[family-name:var(--font-display)] italic text-[16px] leading-relaxed mb-8"
              style={{ color: "rgba(20,17,13,.7)" }}
            >
              {t("drLede")}
            </p>

            {/* Steps */}
            <div
              className="flex border-b pb-[18px] mb-7"
              style={{ borderColor: "rgba(20,17,13,.12)" }}
            >
              {STEPS.map((key, i) => (
                <button
                  key={key}
                  onClick={() => setActiveStep(i)}
                  className="flex-1 flex items-baseline gap-2.5 font-[family-name:var(--font-display)] text-[13px] tracking-[.14em] uppercase bg-transparent border-none cursor-pointer p-0 text-left"
                  style={{ color: i === activeStep ? "#14110d" : "rgba(20,17,13,.4)" }}
                >
                  <span
                    className="italic text-[11px] tracking-[.26em]"
                    style={{ color: "#b08a4a" }}
                  >
                    0{i + 1}
                  </span>
                  {t(key)}
                </button>
              ))}
            </div>

            {/* Form */}
            <form
              className="grid gap-5"
              onSubmit={(e) => { e.preventDefault(); onClose(); }}
            >
              <label className="flex flex-col gap-2">
                <span
                  className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.14em] uppercase"
                  style={{ color: "rgba(20,17,13,.6)" }}
                >
                  {t("drName")}
                </span>
                <input
                  type="text"
                  placeholder="Adérinsola Adéyẹmí"
                  autoComplete="name"
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#b08a4a")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(20,17,13,.2)")}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span
                  className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.14em] uppercase"
                  style={{ color: "rgba(20,17,13,.6)" }}
                >
                  {t("drEmail")}
                </span>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  autoComplete="email"
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#b08a4a")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(20,17,13,.2)")}
                />
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["drBust", "drWaist", "drHips"] as const).map((key, i) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span
                      className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.14em] uppercase"
                      style={{ color: "rgba(20,17,13,.6)" }}
                    >
                      {t(key)}
                    </span>
                    <input
                      type="text"
                      placeholder={["86", "64", "92"][i]}
                      style={fieldStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#b08a4a")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(20,17,13,.2)")}
                    />
                  </label>
                ))}
              </div>
              <label className="flex flex-col gap-2">
                <span
                  className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.14em] uppercase"
                  style={{ color: "rgba(20,17,13,.6)" }}
                >
                  {t("drFabric")}
                </span>
                <select
                  style={{ ...fieldStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#b08a4a")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(20,17,13,.2)")}
                >
                  {(["drFab1", "drFab2", "drFab3", "drFab4"] as const).map((k) => (
                    <option key={k}>{t(k)}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span
                  className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.14em] uppercase"
                  style={{ color: "rgba(20,17,13,.6)" }}
                >
                  {t("drNotes")}
                </span>
                <textarea
                  rows={4}
                  placeholder="Décrivez la silhouette, l'occasion, l'histoire…"
                  style={{ ...fieldStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#b08a4a")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(20,17,13,.2)")}
                />
              </label>
              <button
                type="submit"
                className="w-full mt-4 py-[18px] font-[family-name:var(--font-display)] text-[13px] tracking-[.32em] uppercase cursor-pointer"
                style={{
                  color: "#f6f1e6",
                  background: "#14110d",
                  border: "1px solid #14110d",
                  transition: "background .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#b08a4a";
                  e.currentTarget.style.borderColor = "#b08a4a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#14110d";
                  e.currentTarget.style.borderColor = "#14110d";
                }}
              >
                {t("drSubmit")}
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
