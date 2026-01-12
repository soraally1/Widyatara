"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

import { MoveRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex flex-col relative overflow-hidden md:pt-20">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-accent/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />
      <div className="grow flex items-center justify-center px-6 py-12 md:py-24 relative z-10">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 text-center md:text-left">
          {/* Mascot Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex justify-center md:justify-end order-1 md:order-2"
          >
            <div className="relative group">
              <div className="relative z-10">
                <video
                  src="/assets/widyatara-maintenance.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-48 sm:w-64 md:w-80 lg:w-[420px] h-auto drop-shadow-[0_20px_50px_rgba(84,51,16,0.25)] transition-transform duration-500 group-hover:scale-105 [clip-path:inset(5%_0)]"
                />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-accent/15 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 space-y-6 md:space-y-8 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#543310]/5 text-[#543310]/80 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 border border-[#543310]/10 backdrop-blur-sm">
                Page under Maintenance
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#543310] leading-[1.1] font-serif">
                Oops! Sedang <br />
                <span className="text-accent relative">
                  Bersiap-siap.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-[#AF8F6F]/30"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 25 0, 50 5 T 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-md lg:text-lg text-[#543310]/70 leading-relaxed font-medium max-w-lg mx-auto md:mx-0"
            >
              Widyatara sedang dipercantik untuk memberikan pengalaman
              menjelajah budaya yang jauh lebih seru. Masih proses pengerjaan,
              tunggu sebentar ya!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center md:justify-start pt-4 pb-12 md:pb-0"
            >
              <Link href="/">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -15px rgba(84,51,16,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 md:px-10 py-4 bg-[#543310] text-[#F8F4E1] rounded-full font-bold shadow-2xl hover:bg-[#3d250c] transition-all flex items-center justify-center gap-3 group cursor-pointer"
                >
                  Kembali ke Beranda
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <MoveRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="md:hidden h-24" /> {/* Spacer for Mobile Dock */}
      <Footer />
    </main>
  );
}
