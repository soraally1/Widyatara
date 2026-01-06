"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Home, Compass, LogIn } from "lucide-react";

interface NavItem {
  name: string;
  link: string;
}

const navItems: NavItem[] = [
  {
    name: "Beranda",
    link: "/",
  },
  {
    name: "Pilih Pulau",
    link: "/pilih-pulau",
  },
  {
    name: "Test",
    link: "/test",
  },
];

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`pointer-events-auto relative flex items-center gap-4 px-4 py-2.5 rounded-full transition-all duration-500 ${
            scrolled
              ? "bg-[#F8F4E1]/90 backdrop-blur-2xl border border-[#AF8F6F]/20 shadow-[0_8px_32px_rgba(84,51,16,0.12)]"
              : "bg-[#F8F4E1]/40 backdrop-blur-lg border border-[#AF8F6F]/10 shadow-sm"
          }`}
        >
          {/* Logo Section */}
          <Link href="/">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center bg-white/60 w-16 h-16 rounded-full shadow-inner border border-[#AF8F6F]/10 overflow-hidden cursor-pointer"
            >
              <Image
                src="/assets/widyatara-logo.png"
                alt="Widyatara Logo"
                width={160}
                height={160}
                className="object-contain p-2"
                priority
              />
            </motion.div>
          </Link>

          {/* Divider between Logo and Nav */}
          <motion.div
            variants={itemVariants}
            className="h-8 w-px bg-[#AF8F6F]/30 mx-1"
          />

          {/* Navigation Items */}
          <div className="flex items-center gap-1 text-bold">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.link}
                  className={`
                    relative z-10 px-5 py-2.5 rounded-full text-sm font-bold tracking-tight transition-colors duration-300
                    flex items-center gap-1.5 cursor-pointer
                    ${
                      pathname === item.link
                        ? "text-[#F8F4E1]"
                        : "text-[#543310]/80 hover:text-[#543310]"
                    }
                  `}
                >
                  {item.name}
                </Link>

                {/* Shared Layout Hover Background */}
                <AnimatePresence>
                  {hoveredItem === item.name && (
                    <motion.div
                      layoutId="navHover"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-[#543310]/5 rounded-full z-0"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Active Background */}
                {pathname === item.link && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute inset-0 bg-[#543310] rounded-full z-0 shadow-md shadow-[#543310]/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Divider between Nav and Login */}
          <motion.div
            variants={itemVariants}
            className="h-8 w-px bg-[#AF8F6F]/30 mx-1"
          />

          {/* Login Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px -10px rgba(84,51,16,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-7 py-2.5 rounded-full bg-[#543310] text-[#F8F4E1] text-sm font-extrabold shadow-[0_4px_12px_rgba(84,51,16,0.2)] hover:bg-[#3d250c] transition-all cursor-pointer"
            >
              Login
            </motion.button>
          </motion.div>
        </motion.div>
      </nav>

      {/* --- MOBILE MODERNISED NAVBAR (Liquid Dock) --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px]">
        <motion.div
          className="relative bg-[#F8F4E1]/80 backdrop-blur-3xl border border-[#AF8F6F]/20 shadow-[0_20px_50px_rgba(84,51,16,0.2)] rounded-[35px] px-3 py-2 flex items-center justify-around"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
            delay: 0.2,
          }}
        >
          {[
            { name: "Beranda", link: "/", icon: Home },
            { name: "Pilih Pulau", link: "/pilih-pulau", icon: Compass },
            { name: "Login", link: "/login", icon: LogIn },
          ].map((item) => {
            const isActive = item.link === pathname;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.link}
                className="flex-1 flex justify-center"
              >
                <motion.div
                  className={`relative flex flex-col items-center gap-1 p-4 rounded-3xl transition-colors duration-500 ${
                    isActive ? "text-[#F8F4E1]" : "text-[#543310]/60"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Background Liquid Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActive"
                      className="absolute inset-0 bg-[#543310] rounded-[28px] -z-10 shadow-[0_8px_20px_rgba(84,51,16,0.3)]"
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <motion.div
                    animate={
                      isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
};

export default Navbar;
