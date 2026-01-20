"use client"
import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const GameHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="z-10 text-center mb-6 mt-28"
    >
      <h1 className="text-4xl md:text-6xl font-black text-[var(--primary)] mb-2 tracking-tighter">
        RUMAH GADANG BUILDER
      </h1>
      <div className="flex items-center justify-center gap-2 text-[var(--secondary)]/60 uppercase tracking-[0.3em] text-[10px] font-bold">
        <Info size={12} />
        Arsitektur Sumatra
      </div>
    </motion.div>
  );
};

export default GameHeader;
