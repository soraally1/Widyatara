import LogoLoop, { logos } from "@/components/HeroPage/LogoLoop";
import FeatureHighlights from "../components/HeroPage/FeatureHighlights";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import AnimatedLink from "../components/HeroPage/AnimatedLink";
import Mascot3D from "../components/HeroPage/Mascot3D";
import CloudDivider from "@/components/HeroPage/CloudDivider";

export default function HeroPage() {
  return (
    <div className="flex flex-col w-full font-plus-jakarta relative overflow-x-hidden">
      <section className="relative w-full min-h-screen bg-background flex items-center overflow-hidden px-6 lg:px-20 py-20 lg:py-0">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center z-10">
          <Mascot3D className="order-2 lg:order-1" />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-6 lg:gap-8 text-primary text-center lg:text-left cursor-default order-1 lg:order-2"
          >
            <div className="flex flex-col gap-4">
              <p className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">
                Merawat Budaya Menyapa Nusantara
                <br />
                Bersama
                <span className="text-accent-gold underline-highlight">
                  {" "}
                  Widyatara
                </span>
              </p>

              <p className="text-base lg:text-lg text-primary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Pelajari sejarah dan kearifan lokal melalui pengalaman belajar
                yang interaktif dan imersif. Platform edukasi budaya masa depan
                untuk generasi penerus bangsa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <AnimatedLink
                href="/Nusantara"
                className="w-full sm:w-auto px-8 py-4 bg-accent-gold hover:bg-accent-gold/90 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:translate-y-[-2px] shadow-lg shadow-accent-gold/20 cursor-pointer text-sm lg:text-base"
              >
                Mulai Petualangan
                <MoveRight size={20} />
              </AnimatedLink>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative h-0 z-20">
        <CloudDivider />
      </div>

      <section className="bg-accent/10 relative overflow-hidden py-24 lg:pt-52 pb-10 lg:pb-32">
        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center items-center gap-6">
          <p className="text-4xl lg:text-6xl font-bold text-center">
            Apa itu <span className="text-accent-gold">Widyatara?</span>
          </p>
          <p className="text-md lg:text-xl max-w-3xl text-center leading-relaxed">
            Widyatara adalah platform edukasi budaya yang dirancang untuk
            memperkenalkan kekayaan budaya Indonesia kepada generasi muda
            melalui pengalaman belajar yang interaktif dan imersif.
          </p>
        </div>
      </section>

      <FeatureHighlights />

      <section className="py-20 bg-[#F8F4E1] flex flex-col items-center gap-12 overflow-hidden border-t border-[#543310]/10">
        <p className="text-xl lg:text-2xl font-bold text-[#543310] uppercase tracking-widest text-center px-6">
          Dipercaya Oleh Institusi Pendidikan & Kebudayaan
        </p>

        <div className="w-full opacity-90 transition-opacity hover:opacity-100">
          <LogoLoop
            logos={logos}
            direction="left"
            speed={40}
            gap={60}
            logoHeight={70}
            pauseOnHover={false}
            grayscale={true}
          />
        </div>
      </section>
    </div>
  );
}
