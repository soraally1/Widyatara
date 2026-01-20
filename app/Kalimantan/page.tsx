"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Footprints, Brain, ArrowRight } from "lucide-react";

export default function KalimantanOnboarding() {
  const [step, setStep] = useState(0);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4 md:p-8 font-plus-jakarta">
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="intro"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-4xl w-full bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-accent)]/20 flex flex-col md:flex-row"
          >
            {/* Image Section */}
            <div className="md:w-1/3 bg-[var(--color-primary)]/10 flex items-center justify-center p-8 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-accent-gold)] rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--color-accent)] rounded-full translate-x-16 translate-y-16 blur-3xl"></div>
               </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/assets/Sulawesi/game1/Thinking.png"
                  alt="Thinking Mascot"
                  width={300}
                  height={300}
                  className="relative z-10 object-contain"
                />
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-[var(--color-primary)] mb-6">
                Jelajahi Pulau Kalimantan
              </h1>
              <div className="space-y-4 text-[var(--color-foreground)]/80 leading-relaxed mb-8">
                <p>
                  Kalimantan, bagian dari pulau Borneo yang megah, adalah rumah bagi sejarah purba Nusantara. 
                  Dari Kerajaan Kutai Martapura yang merupakan kerajaan tertua di Indonesia, hingga kekayaan tradisi Dayak yang harmonis dengan alam.
                </p>
                <p>
                  Dikenal dengan sungai-sungainya yang raksasa dan hutan hujan khatulistiwa yang menjadi paru-paru dunia. 
                  Mari kita pelajari lebih dalam mengenai kekayaan geografi, penduduk, dan budaya Kalimantan melalui petualangan ini!
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full md:w-max px-8 py-4 bg-[var(--color-primary)] text-[var(--color-background)] rounded-full font-bold hover:bg-[var(--color-secondary)] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
              >
                Mulai Petualangan
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="games"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-6xl w-full"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-[var(--color-primary)] mb-4">
                Pilih Permainanmu
              </h2>
              <p className="text-[var(--color-foreground)]/70 max-w-2xl mx-auto">
                Dua permainan seru menantimu untuk mengenal lebih dekat budaya Kalimantan yang unik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Game 1 Card */}
              <Link href="/Kalimantan/game1" className="group">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-[var(--color-accent)]/20 shadow-xl group-hover:shadow-2xl transition-all h-full flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Image src="/assets/Sulawesi/game1/FaceWin.png" alt="Mascot" width={100} height={100} />
                  </div>
                  
                  <div className="w-24 h-24 bg-[var(--color-accent-gold)]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Footprints size={48} className="text-[var(--color-primary)]" />
                  </div>

                  <h3 className="text-2xl font-cormorant font-bold text-[var(--color-primary)] mb-4">
                    Tantangan Egrang
                  </h3>
                  <p className="text-[var(--color-foreground)]/70 mb-8 flex-grow text-sm leading-relaxed">
                    Uji keseimbanganmu dalam permainan tradisional egrang bambu yang melatih fokus serta kekuatan fisik secara interaktif.
                  </p>
                  <span className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-background)] rounded-full text-sm font-bold group-hover:bg-[var(--color-accent-gold)] transition-colors">
                    Main Sekarang
                  </span>
                </motion.div>
              </Link>

              {/* Game 2 Card */}
              <Link href="/Kalimantan/game2" className="group">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-[var(--color-accent)]/20 shadow-xl group-hover:shadow-2xl transition-all h-full flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Image src="/assets/Sulawesi/game1/FaceWin.png" alt="Mascot" width={100} height={100} />
                  </div>

                  <div className="w-24 h-24 bg-[var(--color-accent-gold)]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Brain size={48} className="text-[var(--color-primary)]" />
                  </div>

                  <h3 className="text-2xl font-cormorant font-bold text-[var(--color-primary)] mb-4">
                    Memori Patung Dayak
                  </h3>
                  <p className="text-[var(--color-foreground)]/70 mb-8 flex-grow text-sm leading-relaxed">
                    Latih ketajaman memori melalui simbol-simbol ukiran totem Dayak yang sarat akan makna spiritual dan filosofis.
                  </p>
                  <span className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-background)] rounded-full text-sm font-bold group-hover:bg-[var(--color-accent-gold)] transition-colors">
                    Main Sekarang
                  </span>
                </motion.div>
              </Link>
            </div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setStep(0)}
              className="mt-12 mx-auto block text-[var(--color-primary)] hover:underline font-bold"
            >
              ← Kembali ke Penjelasan
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--color-accent-gold)]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}