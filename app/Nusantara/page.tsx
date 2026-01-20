"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "@/components/TransitionContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

// DO NOT CHANGE THESE POSITIONS - User is happy with them.
const ISLANDS = [
  {
    name: "Sumatera",
    file: "/pulau/sumatera.svg",
    style: {
      width: "20%", left: "8%", top: "30%"
    },
  },
  {
    name: "Kalimantan",
    file: "/pulau/Kalimantan.svg",
    style: { width: "19%", left: "30%", top: "20%" },
  },
  {
    name: "Jawa",
    file: "/pulau/jawa.svg",
    style: { width: "46%", left: "25%", top: "72%" },
  },
  {
    name: "Sulawesi",
    file: "/pulau/sulawesi.svg",
    style: { width: "14%", left: "50%", top: "22%" },
  },
  {
    name: "Papua",
    file: "/pulau/papua.svg",
    style: { width: "28%", left: "60%", top: "28%" },
  },
];

export default function NusantaraPage() {
  const router = useRouter();
  const { triggerTransition } = useTransitionContext();
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);

  // Find active island data
  const selectedIslandData = ISLANDS.find(i => i.name === selectedIsland);

  return (
    <section className="relative w-full min-h-screen bg-[#F0F8FF] overflow-hidden flex flex-col items-center justify-start pt-32 md:pt-48 pb-[200px]">
      {/* Background: Light Blue Solid (No Gradient) */}
      <div className="absolute inset-0 bg-[#E3F2FD] -z-10" />

      {/* Decorative Texture/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] -z-10" />

      {/* Header Text */}
      <div className="text-center mb-0 md:mb-12 relative z-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-black text-[#543310] tracking-tight uppercase drop-shadow-sm font-serif"
        >
          Widyatara
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#74512D] italic font-serif text-xs md:text-lg tracking-[0.3em] mt-2 md:mt-3 uppercase"
        >
          Menjelajahi Budaya Indonesia
        </motion.p>

        {/* Mobile Swipe Instruction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="md:hidden mt-6 flex items-center justify-center gap-2"
        >
          <span className="text-[#AF8F6F]">←</span>
          <span className="text-[10px] font-bold text-[#543310]/60 uppercase tracking-widest">
            Geser untuk melihat pulau lain
          </span>
          <span className="text-[#AF8F6F]">→</span>
        </motion.div>
      </div>

      {/* Map Interactive Container - Scrollable on Mobile */}
      <div
        className="relative w-full md:max-w-7xl px-0 md:px-4 flex-1 flex items-center md:justify-center overflow-x-auto md:overflow-visible pb-20 md:pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar Firefox/IE
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; } /* Hide scrollbar Chrome/Safari */
        `}</style>

        <div
          className="relative min-w-[215vw] md:min-w-full w-full aspect-[2/1] md:aspect-[2.3/1] select-none"
          // Deselect on clicking empty space
          onClick={() => setSelectedIsland(null)}
          onMouseLeave={() => setHoveredIsland(null)}
        >
          {ISLANDS.map((island) => {
            const isSelected = selectedIsland === island.name;
            const isHovered = hoveredIsland === island.name;
            const isBlur = (selectedIsland || hoveredIsland) && !isSelected && !isHovered;

            return (
              <motion.div
                key={island.name}
                className={`absolute cursor-pointer transition-all duration-700 ${island.name === "Papua" ? "z-10" : "z-20"}`}
                style={{
                  ...island.style,
                  zIndex: isSelected || isHovered ? 50 : undefined,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isBlur ? 0.3 : 1,
                  scale: isSelected || isHovered ? 1.05 : 1,
                  filter: isSelected || isHovered ? "drop-shadow(0 25px 25px rgba(0,0,0,0.15))" : "drop-shadow(0 8px 12px rgba(84,51,16,0.1))"
                }}
                whileHover={{
                  scale: 1.05,
                  filter: "drop-shadow(0 15px 20px rgba(84,51,16,0.15))"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIsland(island.name);
                }}
                onMouseEnter={() => setHoveredIsland(island.name)}
                onMouseLeave={() => setHoveredIsland(null)}
              >
                <img
                  src={island.file}
                  alt={`Peta Pulau ${island.name}`}
                  className="w-full h-auto"
                  draggable={false}
                />

                {/* Hover Text Label (Only shows name on hover) */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-1/2 -translate-x-1/2 -top-12 pointer-events-none whitespace-nowrap z-50"
                    >
                      <h3 className="text-2xl md:text-4xl font-black text-[#543310] font-serif drop-shadow-md uppercase tracking-wider">
                        {island.name}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Detail Panel (Only shows on Click / Selection) */}
      <AnimatePresence mode="wait">
        {selectedIsland && selectedIslandData && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-36 md:bottom-12 left-1/2 -translate-x-1/2 z-50 rounded-full w-[95%] md:w-auto max-w-[400px]"
          >
            <div className="bg-[#F8F4E1]/95 backdrop-blur-2xl border border-[#AF8F6F]/30 p-2 pr-2.5 rounded-full shadow-[0_20px_60px_rgba(84,51,16,0.4)] flex items-center gap-3 md:gap-6 w-full justify-between">

              {/* Icon Circle */}
              <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-[#543310] rounded-full text-[#F8F4E1] shadow-inner shrink-0 ml-1">
                <MapPin size={20} className="md:w-7 md:h-7" />
              </div>

              {/* Title Only */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="text-[9px] md:text-xs text-[#74512D] uppercase tracking-widest font-bold opacity-70 mb-0.5 truncate">
                  Pulau
                </span>
                <motion.h2
                  layout
                  className="text-lg md:text-2xl font-black text-[#543310] font-serif uppercase tracking-wider leading-none truncate"
                >
                  {selectedIslandData.name}
                </motion.h2>
              </div>

              {/* Action Button (Pill) */}
              <button
                className="
                   group relative overflow-hidden shrink-0
                   px-5 py-2.5 md:px-6 md:py-3
                   bg-[#AF8F6F] hover:bg-[#543310] text-[#F8F4E1]
                   rounded-full font-bold
                   shadow-md hover:shadow-lg
                   transition-all duration-300
                   flex items-center gap-2
                 "
                onClick={() => window.location.href = `/${selectedIsland}`}
              >
                <span className="uppercase tracking-widest text-[10px] md:text-xs font-black">
                  Jelajahi
                </span>
                <ArrowRight size={14} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

