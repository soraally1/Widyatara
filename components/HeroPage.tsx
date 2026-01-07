"use client";

import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  useGLTF, 
  Environment, 
  ContactShadows, 
  Float, 
  Html,
  PerspectiveCamera,
  Stars,
  OrbitControls
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const ISLANDS = [
  { name: "Sumatera", url: "./PulauSumatera.glb", initialScale: 15, mapX: -14, mapZ: -5 },
  { name: "Jawa", url: "./PulauJawa.glb", initialScale: 10, mapX: -4, mapZ: 6 },
  { name: "Kalimantan", url: "./PulauKalimantan.glb", initialScale: 15, mapX: 2, mapZ: -10 },
  { name: "Sulawesi", url: "./PulauSulawesi.glb", initialScale: 11, mapX: 7, mapZ: 5 },
  { name: "Papua", url: "./PulauPapua.glb", initialScale: 12, mapX: 20, mapZ: 2 },
];

function Model({ url, isHovered, initialScale = 1 }: { url: string; isHovered: boolean; initialScale?: number }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene ? scene.clone() : null, [scene]);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = isHovered ? initialScale * 1.3 : initialScale;
      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
      groupRef.current.scale.set(s, s, s);
    }
  });

  if (!scene) return null; // ga ada kotak

return (
  <group ref={groupRef}>
    {clonedScene && (
      <primitive
        object={clonedScene}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    )}
  </group>
);

}

function Island({ 
  name, 
  url, 
  index, 
  total, 
  activeName, 
  setActiveName,
  initialScale,
  mapX,
  mapZ
}: { 
  name: string; 
  url: string; 
  index: number; 
  total: number;
  activeName: string | null;
  setActiveName: (name: string | null) => void;
  initialScale: number;
  mapX: number;
  mapZ: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = activeName === name;

  const x = mapX;
  const z = mapZ;
  const y = 0.5; 

  const labelPosition: [number, number, number] = name === "Papua" ? [6, 1, 0] : [2.5, 1, 0];

  return (
    <group 
      position={[x, y, z]} 
      onClick={(e) => {
        e.stopPropagation();
        setActiveName(isSelected ? null : name);
      }}
      onPointerEnter={() => !activeName && setActiveName(name)} // Preview jika belum ada yang fix dipilih
      onPointerLeave={() => activeName === name && !isSelected && setActiveName(null)}
    >
      <Float 
        speed={isSelected ? 2 : 1.5} 
        rotationIntensity={isSelected ? 0.3 : 0.1} 
        floatIntensity={isSelected ? 0.4 : 0.1}
      >
        <Model url={url} isHovered={isSelected} initialScale={initialScale} />
      </Float>

      <Html
        position={labelPosition}
        center
        distanceFactor={10}
        pointerEvents="none"
      >
        <div className="flex flex-col items-start select-none">
          <motion.h3 
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
                opacity: 1, 
                x: 0,
                scale: isSelected ? 1.3 : 1,
            }}
            className={`text-2xl md:text-4xl font-black whitespace-nowrap drop-shadow-lg uppercase tracking-tighter transition-colors duration-300 ${isSelected ? 'text-[#543310]' : 'text-[#74512D]/60'}`}
          >
            {name}
          </motion.h3>
          <motion.div 
            animate={{ width: isSelected ? "100%" : "0%" }}
            className="h-2 bg-[#AF8F6F] rounded-full mt-0" 
          />
        </div>
      </Html>

      {/* Tombolbawah pulau */}
      <Html
        position={[0, -5, 0]}
        center
        distanceFactor={10}
      >
        <AnimatePresence>
          {isSelected && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              // whileHover={{ scale: 1.05, backgroundColor: "#543310" }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-10 bg-[#74512D] text-[#F8F4E1] rounded-full font-black shadow-[0_20px_50px_rgba(84,51,16,0.6)] border-4 border-[#AF8F6F] whitespace-nowrap uppercase tracking-widest text-4xl z-50 pointer-events-auto mb-12"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Navigating to ${name}`);
              }}
            >
              Eksplorasi {name}
            </motion.button>
          )}
        </AnimatePresence>
      </Html>
    </group>
  );
}

function IslandCarousel() {
  const groupRef = useRef<THREE.Group>(null);
  const [activeName, setActiveName] = useState<string | null>(null);

  return (
    <group ref={groupRef} position={[-1, 0, 0]}> {/* pusat tiik map biar tengah */}
      {ISLANDS.map((island, index) => (
        <Island 
          key={island.name} 
          {...island} 
          index={index} 
          total={ISLANDS.length} 
          activeName={activeName}
          setActiveName={setActiveName}
        />
      ))}
    </group>
  );
}

export default function HeroPage() {
  return (
    <section className="relative w-full h-screen bg-[#F8F4E1] overflow-hidden">
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-[#543310] tracking-tighter uppercase"
          >
          Widyatara
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#74512D] italic font-serif text-lg tracking-widest mt-4"
          >
            Menjelajahi Budaya Indonesia dengan Widyatara
          </motion.p>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10 overflow-hidden bg-[#F8F4E1]"> {/* atur camera awal */}
        <Canvas shadows gl={{ antialias: true }} camera={{ position: [0, 0, 20], fov: 40 }}>
          <OrbitControls 
            makeDefault 
            enablePan={true} 
            minDistance={30} 
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.5} // ga 360 atas bawah
            minPolarAngle={0}
            maxAzimuthAngle={Math.PI / 4} // 180 derajat max
            minAzimuthAngle={-Math.PI / 4}
          />
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[0, 100, 0]} intensity={2} castShadow />
          <Environment preset="city" />

          <Suspense fallback={<Html center><div className="bg-[#543310] text-[#F8F4E1] px-8 py-4 rounded-full font-bold shadow-2xl animate-pulse">Menyiapkan Peta Nusantara...</div></Html>}>
            <group position={[-5, 0, 0]}> 
              <IslandCarousel />
            </group>
            <ContactShadows 
              opacity={0.8} scale={150} blur={3} far={90} resolution={1024} color="#543310" position={[0, -0.2, 0]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-1 h-12 bg-gradient-to-b from-[#543310] to-transparent rounded-full" />
          <p className="text-[#543310] text-[10px] tracking-[0.4em] uppercase font-bold">
            Dekati Pulau Untuk Eksplorasi
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Preload the island models
ISLANDS.forEach(island => useGLTF.preload(island.url));
