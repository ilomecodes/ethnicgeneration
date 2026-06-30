"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

interface HeroProps {
  onOpenDrawer: () => void;
}

const PLATE_CONFIG = [
  {
    id: "women",
    href: "/boutique?categorie=Femmes",
    catKey: "catWomen",
    piecesKey: "piecesWomen",
    wordKey: "wordWomen",
    descKey: "descWomen",
    labelKey: "labelWomen",
    pieces: 24,
    src: "/hero-women.png",
    objectPosition: "center 5%",
    // base transform (from left:50%, top:50%)
    baseX: -260,
    baseY: -230, // -50% of 460px
    baseRot: -8,
    width: 320,
    height: 460,
    activeRot: -2,
    zIndex: 1,
    brightness: 0.7,
    saturation: 0.85,
    gradient:
      "radial-gradient(120% 80% at 30% 25%, rgba(176,138,74,.55) 0%, transparent 55%), radial-gradient(140% 90% at 80% 95%, rgba(20,17,13,.7) 0%, transparent 60%), linear-gradient(160deg, #5e3d28 0%, #2a1d13 100%)",
    rateX: 6,
    rateY: 4,
  },
  {
    id: "kids",
    href: "/boutique?categorie=Enfants",
    catKey: "catKids",
    piecesKey: "piecesKids",
    wordKey: "wordKids",
    descKey: "descKids",
    labelKey: "labelKids",
    pieces: 18,
    src: "/hero-kid.png",
    objectPosition: "center 8%",
    baseX: -180, // -50% of 360px
    baseY: -260, // -50% of 520px
    baseRot: 0,
    width: 360,
    height: 520,
    activeRot: 0,
    zIndex: 2,
    brightness: 0.95,
    saturation: 1,
    gradient:
      "radial-gradient(120% 80% at 70% 20%, rgba(217,184,154,.6) 0%, transparent 60%), radial-gradient(140% 90% at 25% 95%, rgba(30,18,10,.75) 0%, transparent 60%), linear-gradient(200deg, #6b4226 0%, #2f2118 100%)",
    rateX: 14,
    rateY: 10,
  },
  {
    id: "men",
    href: "/boutique?categorie=Hommes",
    catKey: "catMen",
    piecesKey: "piecesMen",
    wordKey: "wordMen",
    descKey: "descMen",
    labelKey: "labelMen",
    pieces: 21,
    src: "/hero-men.png",
    objectPosition: "40% 0%",
    baseX: 220,
    baseY: -230, // -50% of 460px
    baseRot: 6,
    width: 320,
    height: 460,
    activeRot: 2,
    zIndex: 3,
    brightness: 0.78,
    saturation: 0.85,
    gradient:
      "radial-gradient(120% 80% at 50% 15%, rgba(138,90,57,.55) 0%, transparent 55%), radial-gradient(140% 90% at 50% 110%, rgba(20,17,13,.85) 0%, transparent 60%), linear-gradient(180deg, #3a2618 0%, #1a1410 100%)",
    rateX: 26,
    rateY: 18,
  },
];

export default function Hero({ onOpenDrawer }: HeroProps) {
  const { t } = useLang();
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(1);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const [warming, setWarming] = useState(false);
  const warmingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const driftRefs = useRef<Array<{ x: number; y: number }>>(
    PLATE_CONFIG.map(() => ({ x: 0, y: 0 }))
  );
  const plateRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  function handleSetActive(i: number) {
    if (i === activeIdx) return;
    setActiveIdx(i);
    setWarming(true);
    clearTimeout(warmingTimer.current);
    warmingTimer.current = setTimeout(() => setWarming(false), 900);
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        PLATE_CONFIG.forEach((cfg, i) => {
          const el = plateRefs.current[i] as HTMLElement | null;
          if (!el) return;
          const dx = (-mouseRef.current.x * cfg.rateX).toFixed(2);
          const dy = (-mouseRef.current.y * cfg.rateY).toFixed(2);
          el.style.setProperty("--dx", `${dx}px`);
          el.style.setProperty("--dy", `${dy}px`);
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const activeData = PLATE_CONFIG[activeIdx];

  return (
    <section
      className="relative h-screen overflow-hidden"
      style={{ background: "#1a0e07", color: "#f6f1e6" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 film-grain vignette"
        style={{
          background:
            "radial-gradient(140% 80% at 70% 110%, #3f2417 0%, transparent 60%), radial-gradient(120% 90% at 20% -10%, #4a2c19 0%, transparent 55%), linear-gradient(160deg, #1a0e07 0%, #2e1a0e 60%, #1a0e07 100%)",
          filter: warming ? "saturate(1.1) brightness(1.04)" : "none",
          transition: "filter 1.2s cubic-bezier(.4,0,.2,1)",
        }}
      />

      {/* Side rules */}
      <div
        className="absolute left-8 z-[1]"
        style={{
          top: 88,
          bottom: 88,
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(246,241,230,.15) 20%, rgba(246,241,230,.15) 80%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-8 z-[1]"
        style={{
          top: 88,
          bottom: 88,
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(246,241,230,.15) 20%, rgba(246,241,230,.15) 80%, transparent 100%)",
        }}
      />

      {/* ── MOBILE hero (single card + category tabs) ── */}
      <div className="md:hidden absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 px-6">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            width: "min(72vw, 260px)",
            aspectRatio: `${PLATE_CONFIG[activeIdx].width}/${PLATE_CONFIG[activeIdx].height}`,
            background: "#2a1812",
            boxShadow: "0 40px 80px rgba(0,0,0,.65), 0 0 0 1px rgba(246,241,230,.15)",
          }}
          onClick={() => router.push(activeData.href)}
        >
          <div className="absolute inset-0" style={{ background: activeData.gradient }} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 22px, rgba(246,241,230,.018) 22px 23px), repeating-linear-gradient(-45deg, transparent 0 22px, rgba(246,241,230,.018) 22px 23px)",
              mixBlendMode: "overlay",
            }}
          />
          <Image
            src={activeData.src}
            alt={t(activeData.catKey)}
            fill
            className="object-cover"
            style={{ objectPosition: activeData.objectPosition }}
            priority
          />
          <div
            className="absolute left-0 right-0 bottom-0 z-[2] px-5 py-4"
            style={{ background: "linear-gradient(0deg, rgba(20,17,13,.85) 0%, transparent 100%)" }}
          >
            <div className="font-[family-name:var(--font-display)] font-light text-2xl tracking-wide" style={{ color: "#f6f1e6" }}>
              {t(activeData.catKey)}
            </div>
            <div className="font-[family-name:var(--font-display)] italic text-xs tracking-wide mt-1" style={{ color: "rgba(246,241,230,.6)" }}>
              {t(activeData.piecesKey)}
            </div>
          </div>
        </motion.div>

        {/* Category tabs */}
        <div className="flex items-center gap-8 z-20">
          {PLATE_CONFIG.map((cfg, i) => (
            <button
              key={cfg.id}
              onClick={() => handleSetActive(i)}
              className="font-[family-name:var(--font-nav)] text-[10px] tracking-[.3em] uppercase font-semibold pb-1.5 bg-transparent"
              style={{
                color: i === activeIdx ? "#d9b89a" : "rgba(246,241,230,.4)",
                border: "none",
                borderBottom: i === activeIdx ? "1px solid #b08a4a" : "1px solid transparent",
                transition: "color .3s, border-color .3s",
                cursor: "pointer",
              }}
            >
              {t(cfg.catKey)}
            </button>
          ))}
        </div>

        {/* Mobile CTA */}
        <button
          onClick={() => router.push("/boutique")}
          className="font-[family-name:var(--font-nav)] text-[11px] tracking-[.28em] uppercase font-semibold bg-transparent"
          style={{ color: "#f6f1e6", border: "none", borderBottom: "1px solid #b08a4a", paddingBottom: "2px", cursor: "pointer" }}
        >
          {t("enter")}
        </button>
      </div>

      {/* ── DESKTOP plates (three overlapping cards) ── */}
      <div className="hidden md:block absolute inset-0 z-10" style={{ perspective: 1400 }}>
        {PLATE_CONFIG.map((cfg, i) => {
          const isActive = i === activeIdx;
          const delays = [0.1, 0.28, 0.46];
          return (
            <motion.article
              key={cfg.id}
              ref={(el) => {
                plateRefs.current[i] = el;
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: exitingIdx === i ? 0 : 1 }}
              transition={
                exitingIdx === i
                  ? { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }
                  : { delay: delays[i], duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }
              }
              onMouseEnter={() => handleSetActive(i)}
              onClick={() => {
                setExitingIdx(i);
                setTimeout(() => router.push(cfg.href), 420);
              }}
              className="absolute top-1/2 left-1/2 overflow-hidden cursor-pointer"
              style={
                {
                  width: cfg.width,
                  height: cfg.height,
                  background: "#2a1812",
                  boxShadow: isActive
                    ? "0 50px 90px rgba(0,0,0,.7), 0 12px 30px rgba(0,0,0,.5), 0 0 0 1px rgba(246,241,230,.18)"
                    : "0 30px 60px rgba(0,0,0,.55), 0 8px 20px rgba(0,0,0,.4), inset 0 0 0 1px rgba(246,241,230,.08)",
                  filter: isActive
                    ? "brightness(1) saturate(1)"
                    : `brightness(${cfg.brightness}) saturate(${cfg.saturation})`,
                  zIndex: exitingIdx === i ? 10 : isActive ? 5 : cfg.zIndex,
                  transform: exitingIdx === i
                    ? (isActive
                        ? `translate(-50%, -50%) translate(var(--dx,0px), var(--dy,0px)) scale(1.35) rotate(${cfg.activeRot}deg)`
                        : `translate(${cfg.baseX}px, ${cfg.baseY}px) translate(var(--dx,0px), var(--dy,0px)) scale(1.35) rotate(${cfg.baseRot}deg)`)
                    : isActive
                        ? `translate(-50%, -50%) translate(var(--dx,0px), var(--dy,0px)) rotate(${cfg.activeRot}deg)`
                        : `translate(${cfg.baseX}px, ${cfg.baseY}px) translate(var(--dx,0px), var(--dy,0px)) rotate(${cfg.baseRot}deg)`,
                  transition: exitingIdx === i
                    ? "transform 400ms cubic-bezier(.2,.7,.2,1), box-shadow 400ms, filter 400ms"
                    : "transform 900ms cubic-bezier(.2,.7,.2,1), box-shadow 600ms cubic-bezier(.4,0,.2,1), filter 600ms cubic-bezier(.4,0,.2,1)",
                  willChange: "transform",
                  "--dx": "0px",
                  "--dy": "0px",
                } as React.CSSProperties
              }
            >
              {/* Gradient placeholder */}
              <div
                className="absolute inset-0"
                style={{ background: cfg.gradient }}
              />
              {/* Wax texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 28% 32%, rgba(246,241,230,.04) 0 18px, transparent 19px), radial-gradient(circle at 72% 68%, rgba(246,241,230,.035) 0 22px, transparent 23px), repeating-linear-gradient(45deg, transparent 0 22px, rgba(246,241,230,.018) 22px 23px), repeating-linear-gradient(-45deg, transparent 0 22px, rgba(246,241,230,.018) 22px 23px)",
                  mixBlendMode: "overlay",
                }}
              />
              {/* Actual image (when loaded) */}
              <Image
                src={cfg.src}
                alt={t(cfg.catKey)}
                fill
                className="object-cover"
                style={{ objectPosition: cfg.objectPosition }}
                sizes="(max-width: 768px) 100vw, 360px"
                priority={i === 1}
              />
              {/* Corner dot */}
              <div
                className="absolute top-[14px] right-[14px] w-[26px] h-[26px] rounded-full grid place-items-center z-[2] font-[family-name:var(--font-display)] italic text-[12px]"
                style={{
                  border: "1px solid rgba(246,241,230,.35)",
                  background: isActive ? "#b08a4a" : "transparent",
                  color: isActive ? "#f6f1e6" : "rgba(246,241,230,.7)",
                  borderColor: isActive ? "#b08a4a" : "rgba(246,241,230,.35)",
                  transition: "background .35s, color .35s, border-color .35s",
                }}
              >
                ♦
              </div>
              {/* Label */}
              <div
                className="absolute left-0 right-0 bottom-0 z-[2] px-[22px] py-[18px]"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(20,17,13,.85) 0%, transparent 100%)",
                  color: "#f6f1e6",
                }}
              >
                <div
                  className="font-[family-name:var(--font-display)] font-light text-[28px] tracking-[.14em] leading-none"
                >
                  {t(cfg.catKey)}
                </div>
                <div
                  className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.14em] mt-2"
                  style={{ color: "rgba(246,241,230,.6)" }}
                >
                  {t(cfg.piecesKey)}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>{/* end desktop plates */}

      {/* Type stack (left) */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
        className="absolute top-1/2 -translate-y-1/2 left-16 z-20 flex flex-col gap-1.5 hidden md:flex"
      >
        {PLATE_CONFIG.map((cfg, i) => {
          const isActive = i === activeIdx;
          return (
            <div key={cfg.id}>
              <div
                className="flex items-baseline cursor-pointer py-1"
                style={{
                  opacity: isActive ? 1 : 0.42,
                  transition: "opacity .35s",
                }}
                onMouseEnter={() => handleSetActive(i)}
                onClick={() => router.push(cfg.href)}
              >
                <span
                  className="font-[family-name:var(--font-display)] font-light text-[84px] leading-[.9] tracking-[.04em] inline-block"
                  style={{
                    color: isActive ? "#d9b89a" : "#f6f1e6",
                    fontStyle: isActive ? "italic" : "normal",
                    transform: isActive ? "translateX(8px)" : "translateX(0)",
                    transition: "color .35s, transform .5s cubic-bezier(.2,.7,.2,1)",
                  }}
                >
                  {t(cfg.wordKey)}
                  <span
                    className="inline-block ml-4 text-[28px] align-[14px]"
                    style={{
                      color: "#b08a4a",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(-10px)",
                      transition: "opacity .35s, transform .35s",
                    }}
                  >
                    →
                  </span>
                </span>
              </div>
              <div
                className="font-[family-name:var(--font-display)] italic text-[13px] tracking-[.04em] max-w-[280px] overflow-hidden"
                style={{
                  color: "rgba(246,241,230,.6)",
                  height: isActive ? 38 : 0,
                  transition: "height .5s cubic-bezier(.2,.7,.2,1)",
                }}
              >
                {t(cfg.descKey)}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Right detail */}
      <motion.aside
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
        className="absolute top-1/2 -translate-y-1/2 right-16 z-20 w-60 text-right hidden md:block"
      >
        <div
          className="font-[family-name:var(--font-display)] italic text-[12px] tracking-[.32em] uppercase mb-6"
          style={{ color: "#d9b89a" }}
        >
          {t("season")}
        </div>
        <div
          className="font-[family-name:var(--font-display)] font-light text-[76px] leading-none tracking-[-0.02em]"
          style={{ color: "#f6f1e6", transition: "color .4s" }}
        >
          {activeData.pieces}
          <sup
            className="italic text-[22px] ml-1.5"
            style={{ verticalAlign: "38px", color: "#d9b89a" }}
          >
            {t("piecesSup")}
          </sup>
        </div>
        <div
          className="font-[family-name:var(--font-display)] italic text-[13px] tracking-[.08em] mt-1"
          style={{ color: "rgba(246,241,230,.55)" }}
        >
          {t(activeData.labelKey)}
        </div>
        <button
          onClick={() => router.push("/boutique")}
          className="mt-8 inline-flex items-center gap-3.5 font-[family-name:var(--font-display)] text-[12px] tracking-[.32em] uppercase cursor-pointer bg-transparent border-0 pb-1"
          style={{
            color: "#f6f1e6",
            borderBottom: "1px solid #b08a4a",
            transition: "gap .35s, color .25s, border-color .25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#d9b89a";
            e.currentTarget.style.borderColor = "#d9b89a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#f6f1e6";
            e.currentTarget.style.borderColor = "#b08a4a";
          }}
        >
          {t("enter")}
        </button>
      </motion.aside>

      {/* Bottom marquee */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute left-0 right-0 bottom-7 text-center z-20 pointer-events-none"
      >
        <div
          className="font-[family-name:var(--font-display)] italic text-[13px] tracking-[.18em] uppercase px-6"
          style={{ color: "#d9b89a" }}
        >
          {t("tagline")}
        </div>
      </motion.div>
    </section>
  );
}
