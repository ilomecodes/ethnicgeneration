"use client";

import Link from "next/link";
import { Scissors, ChevronRight } from "lucide-react";
import { mySurMesure, statusColors } from "@/lib/client-data";
import { useSurMesure } from "@/context/SurMesureContext";

export default function MonSurMesurePage() {
  const { liveData } = useSurMesure();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#14110d" }}>Mes créations Sur Mesure</h1>
        <p className="text-sm mt-0.5" style={{ color: "#b08a4a99" }}>
          {mySurMesure.length} demande{mySurMesure.length > 1 ? "s" : ""} en cours ou terminée{mySurMesure.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {mySurMesure.map((sm) => {
          const live = liveData[sm.id];
          const liveStatus = live?.status ?? sm.status;
          const livePipeline = live?.pipeline ?? sm.pipeline;
          const liveAcomptePaid = live?.acomptePaid ?? sm.acomptePaid;
          const liveAcompte = live?.acompte ?? sm.acompte;
          const sc = statusColors[liveStatus] ?? { bg: "#f3f4f6", color: "#6B7280" };
          const doneCount = livePipeline.filter((p) => p.done).length;
          const currentStep = livePipeline.find((p) => !p.done);

          return (
            <Link
              key={sm.id}
              href={`/compte/sur-mesure/${sm.id}`}
              className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-5 hover:shadow-md transition-shadow group block"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fdf5e8" }}>
                <Scissors size={22} style={{ color: "#b08a4a" }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold" style={{ color: "#14110d" }}>
                      {sm.piece} — {sm.wax}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#b08a4a99" }}>
                      #{sm.id} · Demande du {sm.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                    {liveStatus}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: "#b08a4a99" }}>
                  <span>Col : {sm.col}</span>
                  <span>Manches : {sm.manches}</span>
                  <span>Livraison prévue : {sm.deadline}</span>
                </div>

                {/* Pipeline progress */}
                <div className="mt-3">
                  <div className="flex items-center gap-1 mb-1.5">
                    {livePipeline.map((step, i) => (
                      <div
                        key={i}
                        title={step.label}
                        className="flex-1 h-1.5 rounded-full"
                        style={{ background: step.done ? "#b08a4a" : "#e8d9bd" }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px]" style={{ color: "#b08a4a99" }}>
                    Étape {doneCount}/{livePipeline.length}
                    {currentStep ? ` · Prochain : ${currentStep.label}` : " · Terminé"}
                  </p>
                </div>

                {/* Acompte notice */}
                {!liveAcomptePaid && liveAcompte && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: "#fef9c3", color: "#854d0e" }}>
                    <span>⚠</span>
                    Acompte de {liveAcompte} en attente de règlement.
                  </div>
                )}
              </div>

              <ChevronRight size={16} className="flex-shrink-0 mt-1 text-gray-300 group-hover:text-[#b08a4a] transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* CTA new */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "linear-gradient(135deg, #14110d, #2a1a0e)" }}
      >
        <p className="font-[family-name:var(--font-display)] italic text-xl text-white mb-1">
          Nouvelle création ?
        </p>
        <p className="text-xs mb-4" style={{ color: "rgba(246,241,230,.6)" }}>
          Lancez une nouvelle demande sur mesure et notre atelier s&apos;occupe du reste.
        </p>
        <Link
          href="/sur-mesure"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#b08a4a", color: "#fff" }}
        >
          <Scissors size={15} />
          Commencer
        </Link>
      </div>
    </div>
  );
}
