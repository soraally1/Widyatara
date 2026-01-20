'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTransitionContext } from '@/components/TransitionContext';
import * as THREE from 'three';

// --- TYPE DEFINITIONS ---
type GameState = 'START' | 'PLAYING' | 'WON' | 'LOST';

// --- PROCEDURAL AUDIO ENGINE (ASMR) ---
// Membangkitkan suara desis air & chime kemenangan menggunakan Web Audio API
class AudioManager {
    ctx: AudioContext | null = null;
    pourNode: GainNode | null = null;
    noiseBuffer: AudioBuffer | null = null;

    init() {
        if (typeof window !== 'undefined' && !this.ctx) {
            // Cross-browser support
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();

            // 1. Create White Noise Buffer for "Hissing" steam/water sound
            const bufferSize = this.ctx.sampleRate * 2;
            this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = this.noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        }
    }

    startPourSound() {
        if (!this.ctx || !this.noiseBuffer) return;

        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Create noise source
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        noise.loop = true;

        // Lowpass filter: Makes it sound like flowing water instead of TV static
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        // Gain (Volume control)
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.1);

        // Connect graph: Noise -> Filter -> Gain -> Output
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.pourNode = gain;

        // Attach cleanup helper
        (noise as any).stopNode = () => {
            if (this.ctx) {
                gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
                setTimeout(() => noise.stop(), 150);
            }
        };
    }

    stopPourSound() {
        if (this.pourNode) {
            // Fade out volume
            this.pourNode.gain.linearRampToValueAtTime(0, this.ctx?.currentTime! + 0.1);
            this.pourNode = null;
        }
    }

    playWinChime() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Sound: Simple ascending sine wave (Ding!)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5); // A5

        // Envelope
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
    }

    dispose() {
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
    }
}

// Global instance to persist across re-renders
const audioManager = new AudioManager();

export default function PapedaGame() {
    const { triggerTransition } = useTransitionContext();

    // --- REFS ---
    const mountRef = useRef<HTMLDivElement>(null);

    // Mutable state for the animation loop (High Frequency)
    const paramsRef = useRef({
        angle: 0,
        prevAngle: 0,
        angularVelocity: 0,
        cookingProgress: 0,
        lumpiness: 0,
        spillRisk: 0,
        isDragging: false,
        isPouring: false,
        gameActive: false,
    });

    // --- UI STATE (React) ---
    const [gameState, setGameState] = useState<GameState>('START');
    const [failReason, setFailReason] = useState('');
    const [progress, setProgress] = useState(0);
    const [lumpiness, setLumpiness] = useState(0);
    const [spillRisk, setSpillRisk] = useState(0);
    const [feedback, setFeedback] = useState('Siap...');
    const [isMobile, setIsMobile] = useState(false);

    // Hot reload effect - memastikan halaman selalu fresh
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('papeda-page-reloaded');
        if (!hasReloaded) {
            sessionStorage.setItem('papeda-page-reloaded', 'true');
            window.location.reload();
        }

        return () => {
            // Cleanup saat unmount
            sessionStorage.removeItem('papeda-page-reloaded');
        };
    }, []);

    // --- THREE.JS INIT & LOOP ---
    useEffect(() => {
        // Detect mobile on mount
        setIsMobile(window.innerWidth < 768);

        if (!mountRef.current) return;

        // 1. SETUP SCENE
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 16, 12); // High angle view
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // 2. LIGHTING
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffaa00, 1);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add(dirLight);

        const rimLight = new THREE.SpotLight(0x4444ff, 0.5);
        rimLight.position.set(-10, 10, -5);
        rimLight.lookAt(0, 0, 0);
        scene.add(rimLight);

        // 3. OBJECTS

        // Pot (Sempe / Belanga)
        const potGeo = new THREE.CylinderGeometry(4, 3.5, 3.5, 32, 1, true);
        const potMat = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.castShadow = true;
        pot.receiveShadow = true;
        scene.add(pot);

        // Pot Bottom
        const bottomGeo = new THREE.CircleGeometry(3.5, 32);
        const bottomMesh = new THREE.Mesh(bottomGeo, potMat);
        bottomMesh.rotation.x = -Math.PI / 2;
        bottomMesh.position.y = -1.7;
        bottomMesh.receiveShadow = true;
        scene.add(bottomMesh);

        // Papeda Liquid Surface
        const papedaGeo = new THREE.CircleGeometry(3.8, 64);
        const papedaMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, // Starts white (Raw Sagu)
            transparent: true,
            opacity: 0.95,
            roughness: 0.3,
            transmission: 0, // Starts opaque
            thickness: 1.5,
            clearcoat: 0.5
        });
        const papedaMesh = new THREE.Mesh(papedaGeo, papedaMat);
        papedaMesh.rotation.x = -Math.PI / 2;
        papedaMesh.position.y = 1;
        scene.add(papedaMesh);

        // Spoon (Gata-gata / Wooden Fork)
        const spoonGroup = new THREE.Group();
        // Handle
        const handleGeo = new THREE.CylinderGeometry(0.12, 0.12, 9, 8);
        const woodMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c, roughness: 0.9 });
        const handle = new THREE.Mesh(handleGeo, woodMat);
        handle.position.y = 4.5;
        spoonGroup.add(handle);
        // Blade/Fork part
        const bladeGeo = new THREE.BoxGeometry(0.8, 2, 0.15);
        const blade = new THREE.Mesh(bladeGeo, woodMat);
        blade.position.y = 0.5;
        spoonGroup.add(blade);

        spoonGroup.rotation.x = 0.3;
        spoonGroup.rotation.z = 0.2;
        spoonGroup.castShadow = true;
        scene.add(spoonGroup);

        // Water Pouring Particles (Visual for "Pouring")
        const particleCount = 150;
        const particlesGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        // Initialize particles high up
        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 2; // x
            particlePositions[i * 3 + 1] = 5 + Math.random() * 5;   // y
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0xccf2ff,
            size: 0.15,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        const particleSystem = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleSystem);

        // 4. INTERACTION HELPERS
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const planeTarget = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        // 5. ANIMATION LOOP
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const p = paramsRef.current; // Shortcut to mutable state

            // --- GAMEPLAY LOGIC ---
            if (p.gameActive) {

                // Decay velocity (inertia)
                if (!p.isDragging) p.angularVelocity *= 0.92;

                // --- CORE MECHANIC: COORDINATION ---
                const targetSpeedMin = 0.15;
                const targetSpeedMax = 0.55;

                if (p.isPouring) {
                    // Player is pouring water
                    particlesMat.opacity = 0.7; // Show water

                    if (p.angularVelocity < 0.05) {
                        // FAIL: Pouring without stirring -> Lumps form instantly
                        p.lumpiness += 0.5;
                        setFeedback("⚠️ ADUK! Air panas menggumpalkan sagu diam!");
                    } else if (p.angularVelocity > targetSpeedMax) {
                        // FAIL: Stirring too crazy while pouring -> Splash
                        p.spillRisk += 0.6;
                        setFeedback("⚠️ Tumpah! Terlalu agresif!");
                    } else {
                        // SUCCESS: Perfect coordination
                        p.cookingProgress += 0.12; // Progress gain
                        p.lumpiness = Math.max(0, p.lumpiness - 0.2); // Healing
                        setFeedback("✨ Sempurna! Pertahankan irama...");
                    }
                } else {
                    // Player is NOT pouring
                    particlesMat.opacity = 0; // Hide water

                    if (p.angularVelocity > 0.1) {
                        // Stirring dry flour
                        setFeedback("Tuang air panas (Tahan SPASI)!");
                    } else {
                        // Doing nothing
                        setFeedback("Tahan SPASI & Aduk Mouse");
                    }
                }

                // Clamp values
                p.spillRisk = Math.max(0, p.spillRisk - 0.1); // Cool down spill risk
                p.cookingProgress = Math.min(100, p.cookingProgress);
                p.lumpiness = Math.min(100, p.lumpiness);
                p.spillRisk = Math.min(100, p.spillRisk);

                // Win/Loss Check
                if (p.lumpiness >= 100) handleGameOver("Gagal! Sagu menggumpal keras karena disiram air panas tanpa diaduk.");
                else if (p.spillRisk >= 100) handleGameOver("Gagal! Cipratan air panas membahayakan. Pelan sedikit!");
                else if (p.cookingProgress >= 100) handleWin();

                // Sync to React State (for UI bars)
                setProgress(p.cookingProgress);
                setLumpiness(p.lumpiness);
                setSpillRisk(p.spillRisk);

                // --- VISUAL FEEDBACK (Shader-like effects) ---

                // 1. Papeda Material Transition
                const progressRatio = p.cookingProgress / 100;
                // Opacity drops (becomes translucent glue)
                papedaMesh.material.opacity = 0.95 - (progressRatio * 0.5);
                // Transmission increases (glassy)
                papedaMesh.material.transmission = progressRatio * 0.8;
                // Color: White (1,1,1) -> Gluey Blue-Grey (0.8, 0.8, 0.9)
                const col = 1 - (progressRatio * 0.2);
                papedaMesh.material.color.setRGB(col, col, 0.9 + (progressRatio * 0.1));

                // 2. Dynamic Wobble (Vertex Simulation via Scale)
                // Makes the surface look like it's moving with the spoon
                const wobble = 1 + Math.sin(Date.now() * 0.015) * 0.03 * p.angularVelocity;
                papedaMesh.scale.set(1, wobble, 1);
            } else {
                // Idle animation for spoon
                if (!p.isDragging) {
                    spoonGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
                }
            }

            // --- PARTICLE PHYSICS ---
            if (p.isPouring || particlesMat.opacity > 0) {
                const positions = particleSystem.geometry.attributes.position.array as Float32Array;
                for (let i = 0; i < particleCount; i++) {
                    // Reset particles that fall below pot
                    if (positions[i * 3 + 1] < 0) {
                        positions[i * 3] = (Math.random() - 0.5) * 1.5; // Spread x
                        positions[i * 3 + 1] = 6 + Math.random() * 4;     // Reset height y
                        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5; // Spread z
                    }
                    // Gravity fall
                    positions[i * 3 + 1] -= 0.25;
                }
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        // 6. INPUT HANDLERS
        const handleMouseMove = (e: MouseEvent) => {
            if (!paramsRef.current.gameActive || !paramsRef.current.isDragging) return;

            // Normalize mouse
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeTarget, target);

            if (target) {
                // Constrain spoon to pot radius
                const radius = 2.5;
                const len = Math.min(target.length(), radius);
                target.normalize().multiplyScalar(len);

                // Move Spoon
                spoonGroup.position.set(target.x, 1, target.z);
                // Tilt spoon towards movement direction slightly
                spoonGroup.lookAt(target.x * 0.5, 4, target.z * 0.5);

                // Calculate Circular Velocity
                const currentAngle = Math.atan2(target.z, target.x);
                let delta = currentAngle - paramsRef.current.prevAngle;

                // Handle angle wrap-around (PI to -PI)
                if (delta > Math.PI) delta -= 2 * Math.PI;
                if (delta < -Math.PI) delta += 2 * Math.PI;

                paramsRef.current.angularVelocity = Math.abs(delta);
                paramsRef.current.prevAngle = currentAngle;
            }
        };

        // Keyboard Handlers (Spacebar)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault(); // CRITICAL: Prevent page scroll on spacebar
                if (!paramsRef.current.isPouring && paramsRef.current.gameActive) {
                    paramsRef.current.isPouring = true;
                    audioManager.startPourSound(); // Play Audio
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scroll
                paramsRef.current.isPouring = false;
                audioManager.stopPourSound(); // Stop Audio
            }
        };

        const handleMouseDown = () => paramsRef.current.isDragging = true;
        const handleMouseUp = () => paramsRef.current.isDragging = false;

        // Touch Support
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault(); // Prevent scrolling
            if (!paramsRef.current.gameActive) return;

            const touch = e.touches[0];
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

            // Reuse Raycaster logic... (simplified for brevity, mirrors mouse logic)
            raycaster.setFromCamera(mouse, camera);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeTarget, target);

            if (target) {
                const len = Math.min(target.length(), 2.5);
                target.normalize().multiplyScalar(len);
                spoonGroup.position.set(target.x, 1, target.z);
                spoonGroup.lookAt(target.x * 0.5, 4, target.z * 0.5);

                const currentAngle = Math.atan2(target.z, target.x);
                let delta = currentAngle - paramsRef.current.prevAngle;
                if (delta > Math.PI) delta -= 2 * Math.PI;
                if (delta < -Math.PI) delta += 2 * Math.PI;
                paramsRef.current.angularVelocity = Math.abs(delta);
                paramsRef.current.prevAngle = currentAngle;
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            paramsRef.current.isDragging = true;
        };
        const handleTouchEnd = () => paramsRef.current.isDragging = false;

        // Attach Listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        // Start Loop
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('resize', () => setIsMobile(window.innerWidth < 768));
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);

            audioManager.stopPourSound();
            audioManager.dispose();

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
                renderer.dispose();
            }

            // Dispose Geometries
            potGeo.dispose(); potMat.dispose();
            papedaGeo.dispose(); papedaMat.dispose();
            particleSystem.geometry.dispose();
        };
    }, []);

    // --- GAME CONTROLS ---

    const startGame = () => {
        audioManager.init(); // Init Audio Context on user gesture required by browsers
        resetGameParams();
        paramsRef.current.gameActive = true;
        setGameState('PLAYING');
    };

    const resetGameParams = () => {
        paramsRef.current = {
            ...paramsRef.current,
            angle: 0,
            prevAngle: 0,
            angularVelocity: 0,
            cookingProgress: 0,
            lumpiness: 0,
            spillRisk: 0,
            isDragging: false,
            isPouring: false,
            gameActive: false,
        };
        setProgress(0);
        setLumpiness(0);
        setSpillRisk(0);
        setFeedback("Siap...");
    };

    const handleGameOver = (reason: string) => {
        paramsRef.current.gameActive = false;
        paramsRef.current.isPouring = false;
        audioManager.stopPourSound();
        setFailReason(reason);
        setGameState('LOST');
    };

    const handleWin = () => {
        paramsRef.current.gameActive = false;
        paramsRef.current.isPouring = false;
        audioManager.stopPourSound();
        audioManager.playWinChime();
        setGameState('WON');
    };

    // --- UI RENDERING ---
    return (
        <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-neutral-900 text-white font-sans selection:bg-amber-500 selection:text-black z-50">
            {/* 3D Canvas Mount Point */}
            <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair" />

            {/* GAME UI OVERLAY */}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${gameState === 'PLAYING' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex flex-col h-full justify-between p-4 md:p-6">

                    {/* Back Button (Top Left) */}
                    <div className="absolute top-4 left-4 z-20">
                        <button
                            onClick={() => {
                                triggerTransition('/Papua');
                                setTimeout(() => {
                                    window.location.href = '/Papua';
                                }, 2500);
                            }}
                            className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <span className="text-xl">←</span>
                            <span className="text-sm font-semibold">Kembali</span>
                        </button>
                    </div>

                    {/* HUD */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-6 max-w-5xl mx-auto w-full mt-2 md:mt-4">

                        {/* Left: Progress */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between text-xs md:text-sm mb-2 text-white/80">
                                <span className="font-bold tracking-wider uppercase">Kematangan</span>
                                <span className="font-mono text-green-400">{Math.floor(progress)}%</span>
                            </div>
                            <div className="h-3 md:h-4 w-full bg-black/40 rounded-sm overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-100" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>

                        {/* Center: Feedback Text */}
                        <div className="flex-[1.5] w-full text-center">
                            <h2 className={`text-base md:text-2xl font-bold transition-colors duration-200 ${feedback.includes('Gagal') || feedback.includes('ADUK') ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                                {feedback}
                            </h2>
                        </div>

                        {/* Right: Risk Meters */}
                        <div className="flex-1 w-full space-y-2">
                            {/* Lump Meter */}
                            <div>
                                <div className="flex justify-between text-[10px] md:text-xs text-red-300 mb-1 font-semibold uppercase">
                                    <span>Menggumpal</span>
                                    <span className="font-mono">{Math.floor(lumpiness)}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/40 rounded-sm overflow-hidden">
                                    <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${lumpiness}%`, opacity: lumpiness > 0 ? 1 : 0.3 }}></div>
                                </div>
                            </div>

                            {/* Spill Meter */}
                            <div>
                                <div className="flex justify-between text-[10px] md:text-xs text-yellow-300 mb-1 font-semibold uppercase">
                                    <span>Tumpah</span>
                                    <span className="font-mono">{Math.floor(spillRisk)}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/40 rounded-sm overflow-hidden">
                                    <div className="h-full bg-yellow-500 transition-all duration-100" style={{ width: `${spillRisk}%`, opacity: spillRisk > 0 ? 1 : 0.3 }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="text-center pb-4 md:pb-10">
                        {isMobile ? (
                            // Mobile: Touch button for pouring
                            <div className="space-y-2">
                                <button
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        if (paramsRef.current.gameActive && !paramsRef.current.isPouring) {
                                            paramsRef.current.isPouring = true;
                                            audioManager.startPourSound();
                                        }
                                    }}
                                    onTouchEnd={(e) => {
                                        e.preventDefault();
                                        paramsRef.current.isPouring = false;
                                        audioManager.stopPourSound();
                                    }}
                                    className="pointer-events-auto w-full max-w-sm mx-auto active:scale-95 transition-transform bg-gradient-to-r from-blue-600 to-blue-500 active:from-blue-500 active:to-blue-600 text-white font-extrabold rounded-lg px-8 py-5 text-lg shadow-xl"
                                >
                                    💧 TAHAN UNTUK TUANG AIR
                                </button>
                                <p className="text-xs text-white/60">Drag jari untuk mengaduk</p>
                            </div>
                        ) : (
                            // Desktop: Keyboard + Mouse instructions
                            <div className="inline-flex gap-6 items-center bg-black/30 px-6 py-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-3 py-1 bg-white/90 text-black font-bold rounded text-xs">SPACE</kbd>
                                    <span className="text-sm text-amber-200">Tuang Air</span>
                                </div>
                                <div className="w-px h-5 bg-white/20"></div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-3 py-1 bg-white/90 text-black font-bold rounded text-xs">MOUSE</kbd>
                                    <span className="text-sm text-green-200">Aduk</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* START SCREEN */}
            {gameState === 'START' && (
                <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-4 tracking-tighter drop-shadow-sm">The Art of Papeda</h1>
                    <p className="text-lg md:text-xl text-gray-400 italic mb-6 md:mb-10 max-w-2xl font-light">
                        "Harmoni antara tangan {isMobile ? 'kiri' : 'kiri menuang'} dan tangan kanan mengaduk."
                    </p>

                    <div className="bg-gray-800/60 backdrop-blur p-6 md:p-8 rounded-3xl border border-gray-700 max-w-lg w-full text-left space-y-6 mb-8 md:mb-10 shadow-2xl">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-900/50 p-3 rounded-xl text-3xl">🔥</div>
                            <div>
                                <strong className="text-amber-400 text-lg">Misi Utama</strong>
                                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                                    Papeda terbuat dari sagu mentah yang disiram air mendidih.
                                    <br />
                                    <span className="text-white font-semibold">Tantangan:</span> Kamu harus menuang air {isMobile ? '(tombol biru)' : '(Spasi)'} sambil terus mengaduk {isMobile ? '(drag jari)' : '(Mouse)'} agar matang merata.
                                </p>
                            </div>
                        </div>

                        {isMobile ? (
                            // Mobile Instructions
                            <div className="space-y-3">
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                    <div className="text-center mb-3">
                                        <div className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-full text-sm mb-2">
                                            💧 TAHAN TOMBOL
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 text-center">
                                        Tahan tombol biru untuk menuang air panas
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                                    <div className="text-center mb-2">
                                        <div className="text-3xl mb-2">👆</div>
                                        <div className="text-white font-bold text-sm">DRAG JARI</div>
                                    </div>
                                    <div className="text-xs text-gray-400 text-center">
                                        Gerakkan jari memutar untuk mengaduk sagu
                                    </div>
                                </div>
                                <div className="bg-amber-900/40 border border-amber-600/30 p-3 rounded-xl">
                                    <p className="text-xs text-amber-200 text-center leading-relaxed">
                                        ⚠️ <strong>PENTING:</strong> Harus mengaduk sambil menuang air! Jika diam = menggumpal, terlalu cepat = tumpah.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Desktop Instructions
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 p-4 rounded-xl text-center border border-gray-700 hover:border-amber-500/50 transition-colors">
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">KIRI</div>
                                    <div className="font-bold text-white text-lg">Tahan SPASI</div>
                                    <div className="text-xs text-amber-500 mt-1">Tuang Air</div>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-xl text-center border border-gray-700 hover:border-green-500/50 transition-colors">
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">KANAN</div>
                                    <div className="font-bold text-white text-lg">Putar Mouse</div>
                                    <div className="text-xs text-green-500 mt-1">Aduk Sagu</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={startGame}
                        className="group relative px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full text-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.4)]"
                    >
                        <span className="relative z-10">Mulai Memasak</span>
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                </div>
            )}

            {/* GAME OVER SCREEN */}
            {gameState === 'LOST' && (
                <div className="absolute inset-0 z-50 bg-red-950/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                    <div className="bg-red-500/10 p-6 rounded-full mb-4">
                        <div className="text-6xl">🥣</div>
                    </div>
                    <h2 className="text-5xl font-bold text-red-200 mb-2">Gagal!</h2>
                    <p className="text-xl text-red-300 mb-8 max-w-lg leading-relaxed border-t border-red-800 pt-4 mt-4">
                        {failReason}
                    </p>
                    <button
                        onClick={startGame}
                        className="px-10 py-4 bg-white text-red-900 font-bold rounded-full hover:bg-red-50 transition shadow-xl"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* WIN SCREEN */}
            {gameState === 'WON' && (
                <div className="absolute inset-0 z-50 bg-emerald-950/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                    <div className="bg-emerald-500/10 p-6 rounded-full mb-4 animate-bounce">
                        <div className="text-6xl">✨</div>
                    </div>
                    <h2 className="text-5xl font-bold text-emerald-200 mb-4">Papeda Sempurna!</h2>
                    <p className="text-xl text-emerald-100/80 mb-8 max-w-lg leading-relaxed">
                        Tekstur bening, kenyal, dan matang merata. <br />Siap disajikan dengan Ikan Kuah Kuning.
                    </p>
                    <button
                        onClick={startGame}
                        className="px-10 py-4 bg-white text-emerald-900 font-bold rounded-full hover:bg-emerald-50 transition shadow-xl"
                    >
                        Masak Lagi
                    </button>
                </div>
            )}
        </main>
    );
}