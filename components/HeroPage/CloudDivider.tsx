"use client";
import { motion } from "framer-motion";

const FloatingCloud = ({
  className,
  delay = 0,
  duration = 8,
  yOffset = 30,
  xOffset = 15,
  rotateOffset = 2,
  mobileYOffset = 15,
  mobileXOffset = 8,
}: {
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  rotateOffset?: number;
  mobileYOffset?: number;
  mobileXOffset?: number;
}) => {
  // Use responsive offsets
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const activeY = isMobile ? mobileYOffset : yOffset;
  const activeX = isMobile ? mobileXOffset : xOffset;

  return (
    <motion.img
      src="/assets/entrance-clouds.png"
      alt="Cloud"
      className={`absolute pointer-events-none select-none ${className}`}
      animate={{
        y: [0, activeY, 0, -activeY, 0],
        x: isMobile ? 0 : [0, activeX, 0, -activeX, 0],
        rotate: isMobile ? 0 : [0, rotateOffset, 0, -rotateOffset, 0],
      }}
      transition={{
        duration: isMobile ? 10 : duration,
        repeat: Infinity,
        delay: isMobile ? 0 : delay,
        ease: "easeInOut",
      }}
    />
  );
};

const CloudDivider = () => {
  return (
    <div className="absolute left-0 right-0 w-full h-0 z-20 pointer-events-none flex items-center justify-between">
      {/* Left Group - Cinematic Scale */}
      <div className="relative w-1/2 h-full">
        <FloatingCloud
          className="left-[-20%] lg:left-[-15%] top-[-80px] lg:top-[-270px] w-[300px] lg:w-[800px]"
          delay={0}
          duration={12}
          yOffset={30}
          xOffset={10}
          mobileYOffset={6}
          mobileXOffset={2}
          rotateOffset={1}
        />
        <FloatingCloud
          className="left-[0%] lg:left-[10%] top-[-40px] lg:top-[-160px] w-[250px] lg:w-[650px]"
          delay={0.1}
          duration={14}
          yOffset={25}
          xOffset={-8}
          mobileYOffset={5}
          mobileXOffset={-2}
          rotateOffset={-0.8}
        />
        <FloatingCloud
          className="left-[30%] lg:left-[50%] top-[-60px] lg:top-[-160px] w-[200px] lg:w-[550px]"
          delay={0.1}
          duration={16}
          yOffset={20}
          xOffset={6}
          mobileYOffset={4}
          mobileXOffset={1}
          rotateOffset={0.5}
        />
      </div>

      {/* Right Group - Cinematic Scale */}
      <div className="relative w-1/2 h-full flex justify-end">
        <FloatingCloud
          className="right-[-20%] lg:right-[-15%] top-[-90px] lg:top-[-280px] w-[320px] lg:w-[850px] scale-x-[-1]"
          delay={0.8}
          duration={13}
          yOffset={35}
          xOffset={-12}
          mobileYOffset={7}
          mobileXOffset={-3}
          rotateOffset={-1}
        />
        <FloatingCloud
          className="right-[0%] lg:right-[5%] top-[-50px] lg:top-[-190px] w-[240px] lg:w-[600px] scale-x-[-1]"
          delay={0}
          duration={15}
          yOffset={28}
          xOffset={8}
          mobileYOffset={5}
          mobileXOffset={2}
          rotateOffset={0.8}
        />
        <FloatingCloud
          className="right-[25%] lg:right-[30%] top-[-70px] lg:top-[-220px] w-[220px] lg:w-[620px] scale-x-[-1]"
          delay={0.5}
          duration={17}
          yOffset={22}
          xOffset={10}
          mobileYOffset={4}
          mobileXOffset={3}
          rotateOffset={-0.6}
        />
      </div>
    </div>
  );
};

export default CloudDivider;
