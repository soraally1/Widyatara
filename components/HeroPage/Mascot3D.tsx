"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const CelestialAura = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => (
  <motion.div
    style={{
      opacity: useTransform(mouseX, [-0.5, 0.5], [0.3, 0.5]),
      scale: useTransform(mouseY, [-0.5, 0.5], [0.95, 1.05]),
    }}
    className="absolute inset-0 flex items-center justify-center -z-20 overflow-visible"
  >
    {/* Primary Glow */}
    <div className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
    {/* Accent Glow */}
    <div className="absolute w-[300px] h-[300px] bg-accent-gold/15 rounded-full blur-[80px] translate-x-10 -translate-y-10" />
    {/* Core Light */}
    <div className="absolute w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl" />
  </motion.div>
);

const Mascot3D = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]), // Reduced intensity for more natural feel
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    springConfig,
  );

  const mascotX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
    springConfig,
  );
  const mascotY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-15, 15]),
    springConfig,
  );

  const shadowX = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [40, -10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex justify-center items-center perspective-1000 h-[320px] sm:h-[400px] lg:h-[600px] w-full max-w-2xl mx-auto ${className || ""}`}
    >
      <CelestialAura mouseX={mouseX} mouseY={mouseY} />

      {/* Mascot Image Layer */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: mascotX,
          y: mascotY,
          z: 100,
        }}
        animate={
          // Auto-float animation when mouse is not present (for mobile/touch)
          mouseX.get() === 0 && mouseY.get() === 0
            ? {
                y: [0, -10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
            : {}
        }
        className="relative z-10 transform-style-3d group"
      >
        <motion.img
          src="/hero-mascot.png"
          alt="Mascot"
          className="w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[420px] h-auto select-none pointer-events-none drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Dynamic Soft Shadow */}
        <motion.div
          style={{
            x: shadowX,
            y: shadowY,
            opacity: 0.25,
          }}
          className="absolute inset-0 bg-black/40 blur-2xl lg:blur-[60px] rounded-[50%] -z-10 scale-[0.6] translate-y-8 lg:translate-y-12"
        />
      </motion.div>
    </div>
  );
};

export default Mascot3D;
