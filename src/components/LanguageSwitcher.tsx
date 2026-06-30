"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import type { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["fr", "en", "yo"];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-8 left-12 z-[35] flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[11px] tracking-[.42em] uppercase"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-2.5">
          {i > 0 && (
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(246,241,230,.25)" }}
            />
          )}
          <button
            onClick={() => setLang(l)}
            className="bg-transparent border-none cursor-pointer py-1 px-0.5 relative"
            style={{
              color: l === lang ? "#f6f1e6" : "rgba(246,241,230,.42)",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              transition: "color .25s",
            }}
          >
            {l.toUpperCase()}
            {l === lang && (
              <span
                className="absolute left-0.5 right-0.5 h-px"
                style={{ bottom: -4, background: "#b08a4a" }}
              />
            )}
          </button>
        </span>
      ))}
    </motion.div>
  );
}
