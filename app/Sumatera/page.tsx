"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function SumateraOnboarding() {
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
                Jelajahi Pulau Sumatera
              </h1>
              <div className="space-y-4 text-[var(--color-foreground)]/80 leading-relaxed mb-8">
                <p>
                  Sumatera, pulau keenam terbesar di dunia, adalah rumah bagi sejarah yang megah dan budaya yang kaya. 
                  Dari kejayaan Kerajaan Srivijaya yang menguasai jalur perdagangan laut, hingga keunikan adat Minangkabau yang menganut sistem matrilineal.
                </p>
                <p>
                  Pulau ini dikenal dengan julukan <span className="text-[var(--color-accent-gold)] font-bold italic">Swarnadwipa</span> atau "Pulau Emas". 
                  Kekayaan rempahnya telah menjadikannya pusat perhatian dunia selama berabad-abad. Mari kita pelajari lebih dalam melalui permainan yang seru!
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full md:w-max px-8 py-4 bg-[var(--color-primary)] text-[var(--color-background)] rounded-full font-bold hover:bg-[var(--color-secondary)] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
              >
                Mulai Petualangan
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
                Dua permainan seru menantimu untuk mengenal lebih dekat budaya Sumatera yang ikonik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Game 1 Card */}
              <Link href="/Sumatera/game1" className="group">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-[var(--color-accent)]/20 shadow-xl group-hover:shadow-2xl transition-all h-full flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Image src="/assets/Sulawesi/game1/FaceWin.png" alt="Mascot" width={100} height={100} />
                  </div>
                  
                  <div className="w-24 h-24 bg-[var(--color-accent-gold)]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative">
                     <Image src="/Sumatera/game1/gadangfull.png" alt="Rumah Gadang Icon" fill className="object-contain p-2" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-bold text-[var(--color-primary)] mb-4">
                    Pembangun Rumah Gadang
                  </h3>
                  <p className="text-[var(--color-foreground)]/70 mb-8 flex-grow">
                    Susun elemen-elemen ikonik Rumah Gadang dan pelajari arsitektur megah dari Sumatera Barat yang sarat akan makna filosofis.
                  </p>
                  <span className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-background)] rounded-full text-sm font-bold group-hover:bg-[var(--color-accent-gold)] transition-colors">
                    Main Sekarang
                  </span>
                </motion.div>
              </Link>

              {/* Game 2 Card */}
              <Link href="/Sumatera/game2" className="group">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-[var(--color-accent)]/20 shadow-xl group-hover:shadow-2xl transition-all h-full flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Image src="/assets/Sulawesi/game1/FaceWin.png" alt="Mascot" width={100} height={100} />
                  </div>

                  <div className="w-24 h-24 bg-[var(--color-accent-gold)]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative">
                     <Image src="/Sumatera/game2/dagingrendang.jpg" alt="Rendang Icon" fill className="object-cover rounded-xl p-1" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-bold text-[var(--color-primary)] mb-4">
                    Dapur Tradisi Rendang
                  </h3>
                  <p className="text-[var(--color-foreground)]/70 mb-8 flex-grow">
                    Masuki dapur tradisional dan buatlah Rendang yang sempurna. Pelajari bahan-bahan serta filosofi di balik makanan paling lezat di dunia.
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
