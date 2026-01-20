"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, Sparkles, Gamepad2, ArrowRight, Compass } from "lucide-react";
import AnimatedLink from "./AnimatedLink";

const FeatureHighlights = () => {
  return (
    <section className="pt-24 lg:pt-40 pb-24 bg-accent/10 relative overflow-hidden px-6 lg:px-20">
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mb-10 mx-auto flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-[#543310] leading-tight text-center"
          >
            Awali Langkah, <br />
            <span className="text-accent-gold">Temukan Warisan.</span>
          </motion.p>
        </div>

        {/* Responsive Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 md:auto-rows-[280px]">
          {/* Node 1: Visual Experience (The "Hero" Feature) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-8 md:row-span-2 bg-accent/20 rounded-[32px] md:rounded-[48px] p-6 md:p-12 flex flex-col justify-between shadow-sm border border-[#543310]/5 relative overflow-hidden group transition-all duration-500"
          >
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#543310] mb-4 md:mb-6 leading-tight">
                Rasakan Budaya <br /> Lewat Teknologi 3D.
              </h3>
              <p className="text-[#74512D] max-w-lg leading-relaxed text-base md:text-lg">
                Jelajahi artefak bersejarah dengan detail yang luar biasa. Kami
                menghidupkan kembali warisan nusantara melalui visualisasi
                presisi tinggi yang bisa Anda interaksi secara langsung.
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 mt-6 md:mt-8 relative z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#543310] text-[#F8F4E1] flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="md:w-8 md:h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#543310] font-bold text-sm md:text-base">
                  Teknologi Modern
                </span>
                <span className="text-[#74512D]/60 text-xs md:text-sm">
                  Pengalaman Tanpa Batas
                </span>
              </div>
            </div>
          </motion.div>

          {/* Node 2: 5 Nusa Adventure (The "Journey" Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-4 md:row-span-3 bg-[#AF8F6F] rounded-[32px] md:rounded-[48px] p-8 md:p-10 flex flex-col relative overflow-hidden shadow-2xl transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -m-20 blur-3xl" />

            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center text-white mb-5 shadow-inner">
              <Gamepad2 size={24} className="md:w-8 md:h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 leading-tight">
              Jelajahi Nusantara <br /> di 6 pulau yang ada.
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 mb-8 lg:mb-auto mt-2 lg:mt-4 lg:px-2">
              {[
                "Sulawesi",
                "Jawa",
                "Kalimantan",
                "Sumatera",
                "Bali",
                "Papua",
              ].map((island, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 md:gap-4 group/item"
                >
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white opacity-30 group-hover:opacity-100 transition-all duration-300" />
                  <span className="text-xs md:text-sm text-white font-medium tracking-wide">
                    {island}
                  </span>
                </div>
              ))}
            </div>

            <AnimatedLink
              href="/Nusantara"
              className="mt-6 lg:mt-10 py-4 bg-white text-[#AF8F6F] rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-[#F8F4E1] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group/btn"
            >
              Mulai Eksplorasi
              <ArrowRight
                size={14}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </AnimatedLink>
          </motion.div>

          {/* Node 3: Interactive Map (Wide Bridge Feature) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-8 md:row-span-1 bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#543310]/5 shadow-sm transition-all duration-500 overflow-hidden group gap-6 md:gap-0"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#AF8F6F]/10 flex items-center justify-center text-[#AF8F6F]">
                <Map size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-3xl font-bold text-[#543310]">
                  Peta Budaya Interaktif
                </h3>
                <p className="text-[#74512D]/60 text-sm md:text-lg max-w-md leading-relaxed">
                  Temukan lokasi bersejarah melalui peta eksplorasi yang modern.
                </p>
              </div>
            </div>

            <div className="flex lg:flex flex-col items-start md:items-end gap-1">
              <span className="text-[10px] font-black text-[#AF8F6F] uppercase tracking-[0.2em]">
                Eksplorasi
              </span>
              <div className="flex items-center gap-2 text-[#543310] font-bold">
                <span className="text-sm">Indonesia</span>
                <Compass size={16} className="animate-spin-slow" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
