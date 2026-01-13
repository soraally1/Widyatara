"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Beranda", href: "/" },
    { title: "Nusantara", href: "/nusantara" },
    { title: "Peta Budaya", href: "/map" },
    { title: "Timeline", href: "/timeline" },
    { title: "Tentang Kami", href: "/about" },
    { title: "Kontak", href: "/contact" },
  ];

  return (
    <footer className="relative w-full bg-linear-to-b from-primary to-accent-dark text-[#F8F4E1] pt-7 pb-7 px-4 md:px-6 overflow-hidden font-sans">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#AF8F6F]/10 rounded-full blur-[80px] md:blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute top-1/2 -left-24 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-accent-gold/5 rounded-full blur-[60px] md:blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[#543310] rounded-full blur-[100px] md:blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Metric / Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-5">
          {/* Card 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            whileHover={{ y: -5 }}
            className="group p-0 md:p-0 flex flex-col"
          >
            <div className="relative z-10 text-center md:text-left">
              <Link
                href="/"
                className="text-4xl md:text-6xl font-black font-serif tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F8F4E1] to-[#AF8F6F] drop-shadow-sm group-hover:to-[#F8F4E1] transition-all duration-500 py-2 block"
              >
                WIDYATARA
              </Link>
            </div>
            <div className="h-1.5 w-0 md:h-2 bg-linear-to-r from-[#AF8F6F] to-accent-gold rounded-full mt-2 md:mt-4 group-hover:w-96 transition-all duration-700 ease-in-out" />
          </motion.div>

          {/* Card 2: Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              type: "spring",
              bounce: 0.4,
            }}
            className="bg-[#F8F4E1]/5 backdrop-blur-md border border-[#F8F4E1]/10 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-center min-h-[160px] md:min-h-[240px] hover:border-[#AF8F6F]/30 transition-colors duration-300"
          >
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-[#AF8F6F] border-b border-[#F8F4E1]/10 pb-3 md:pb-4 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-gold" />
              Jelajahi
            </h3>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.title} className="overflow-hidden">
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs md:text-base text-[#F8F4E1]/70 hover:text-[#F8F4E1] transition-colors duration-300"
                  >
                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#AF8F6F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 3: Message Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              bounce: 0.4,
            }}
            className="bg-[#F8F4E1]/5 backdrop-blur-md border border-[#F8F4E1]/10 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-center min-h-[180px] md:min-h-[240px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-[#AF8F6F]/10 rounded-bl-[80px] md:rounded-bl-[100px] pointer-events-none" />
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#F8F4E1]">
              Kirim Pesan!
            </h3>
            <div className="flex flex-col gap-3 relative z-10">
              <textarea
                placeholder="Ada ide seru? Tulis di sini..."
                rows={2}
                className="w-full bg-accent-dark/50 border border-[#F8F4E1]/10 rounded-xl md:rounded-2xl px-4 py-3 text-xs md:text-sm text-[#F8F4E1] placeholder:text-[#F8F4E1]/30 focus:outline-none focus:border-[#AF8F6F]/50 focus:bg-accent-dark/70 transition-all resize-none"
              />
              <button className="self-end bg-[#AF8F6F] hover:bg-accent-gold text-accent-dark hover:text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-[#AF8F6F]/10 hover:shadow-accent-gold/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer">
                Kirim Pesan
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-6 border-t border-[#F8F4E1]/10 pt-5"
        >
          <div className="text-[10px] md:text-sm font-medium text-[#F8F4E1]/50 flex items-center gap-2 text-center md:text-left">
            <span>&copy; {currentYear} Widyatara.</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-[#F8F4E1]/30" />
            <span> Dibuat dengan penuh cinta untuk Indonesia.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-[#F8F4E1]/10 backdrop-blur text-[#F8F4E1] p-2.5 rounded-full hover:bg-[#AF8F6F] hover:text-white transition-colors border border-[#F8F4E1]/5"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
