"use client";

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useTransitionContext } from "@/components/TransitionContext";

export default function KayuMaleleGame() {
    const { triggerTransition } = useTransitionContext();

    // State
    const [distance, setDistance] = useState(0);
    const [score, setScore] = useState(0);
    const [gameTitle, setGameTitle] = useState("Kayu Malele");
    const [gameSubtitle, setGameSubtitle] = useState("Tap layar untuk mulai melempar");
    const [showResetBtn, setShowResetBtn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showScoreboard, setShowScoreboard] = useState(true);

    // Refs for Three.js objects
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const indukStickRef = useRef<THREE.Mesh | null>(null);
    const anakStickRef = useRef<THREE.Mesh | null>(null);
    const spectatorsRef = useRef<THREE.Group[]>([]);
    const groundRef = useRef<THREE.Mesh | null>(null);

    // Game state refs
    const stateRef = useRef("START");
    const anakVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const anakRotationVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const isSwipingRef = useRef(false);
    const swipeStartPosRef = useRef({ x: 0, y: 0 });
    const swipeStartTimeRef = useRef(0);
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const animationIdRef = useRef<number | null>(null);

    // CONFIG
    const CONFIG = {
        indukLength: 4,
        anakLength: 1.5,
        gravity: 0.025,
        tossForce: 0.55,
        hitZoneHeight: { min: 1.5, max: 7 },
        swipeThreshold: 5,
        airResistance: 0.985,
    };

    // Hot reload effect - memastikan halaman selalu fresh
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('kayumalele-page-reloaded');
        if (!hasReloaded) {
            sessionStorage.setItem('kayumalele-page-reloaded', 'true');
            window.location.reload();
        }

        return () => {
            // Cleanup saat unmount
            sessionStorage.removeItem('kayumalele-page-reloaded');
        };
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;

        // Detect mobile
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
            setIsMobile(mobile);
            // Hide scoreboard initially on mobile
            if (mobile && stateRef.current === 'START') {
                setShowScoreboard(false);
            }
        };
        checkMobile();

        // Initialize Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0x87ceeb, 20, 100);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // Adjusted camera for better mobile view
        const isMobileView = window.innerWidth < 768;
        camera.position.set(0, isMobileView ? 3 : 5, isMobileView ? 15 : 12);
        camera.lookAt(0, isMobileView ? 1.5 : 3, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        scene.add(dirLight);

        createEnvironment();
        createSticks();
        setupInput();

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            updatePhysics();

            const t = Date.now() * 0.002;
            spectatorsRef.current.forEach((s, i) => (s.position.y = Math.sin(t + i) * 0.1));

            if (rendererRef.current && cameraRef.current) {
                rendererRef.current.render(scene, camera);
            }
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (rendererRef.current && mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
        };
    }, []);

    const createEnvironment = () => {
        if (!sceneRef.current) return;

        const groundGeo = new THREE.PlaneGeometry(200, 200);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x5c8a45, roughness: 0.9 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        sceneRef.current.add(ground);
        groundRef.current = ground;

        for (let i = 0; i < 40; i++) createTree(); // More trees for better environment
        // Spectators loaded asynchronously - balanced distribution
        for (let i = 0; i < 4; i++) createSpectator(); // 4 spectators (2 cewe, 2 cowo)
    };

    const createTree = () => {
        if (!sceneRef.current) return;

        const x = (Math.random() - 0.5) * 120;
        const z = (Math.random() - 0.5) * 120;
        if (Math.abs(x) < 15 && Math.abs(z) < 30) return;

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.9, 4, 6),
            new THREE.MeshStandardMaterial({ color: 0x5c4033 })
        );
        trunk.position.set(x, 2, z);
        trunk.castShadow = true;

        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(3.5, 9, 7),
            new THREE.MeshStandardMaterial({ color: 0x2e8b57 })
        );
        leaves.position.y = 5;
        trunk.add(leaves);
        sceneRef.current.add(trunk);
    };

    const createSpectator = async () => {
        if (!sceneRef.current) return;

        const x = (Math.random() - 0.5) * 40;
        const z = -12 - Math.random() * 10;
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        // Load GLB model for spectators - balanced 50/50
        const loader = new GLTFLoader();
        const spectatorCount = spectatorsRef.current.length;
        // Alternate between male and female for balanced distribution
        const modelPath = spectatorCount % 2 === 0 ? "/model/Cewe.glb" : "/model/Cowo.glb";

        try {
            const gltf = await loader.loadAsync(modelPath);
            const model = gltf.scene;
            model.scale.set(3, 3, 3);
            model.position.y = 0;

            // Enable shadows
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            group.add(model);
        } catch (error) {
            console.log("Failed to load spectator model, using fallback");
            // Fallback to simple geometry
            const body = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.4, 1.6, 8),
                new THREE.MeshStandardMaterial({ color: Math.random() > 0.5 ? 0xd32f2f : 0x1976d2 })
            );
            body.position.y = 0.8;
            body.castShadow = true;
            group.add(body);
        }

        group.lookAt(0, 2, 0);
        sceneRef.current.add(group);
        spectatorsRef.current.push(group);
    };

    const createSticks = () => {
        if (!sceneRef.current) return;

        const woodMat = new THREE.MeshStandardMaterial({ color: 0xa0522d });

        const indukStick = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, CONFIG.indukLength, 8),
            woodMat
        );
        indukStick.geometry.translate(0, CONFIG.indukLength / 2 - 0.5, 0);
        indukStick.rotation.set(0, 0, -Math.PI / 3);
        indukStick.position.set(3, 1, 6);
        indukStick.castShadow = true;
        sceneRef.current.add(indukStick);
        indukStickRef.current = indukStick;

        const anakStick = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.09, CONFIG.anakLength, 8),
            woodMat
        );
        resetAnakPosition();
        anakStick.castShadow = true;
        sceneRef.current.add(anakStick);
        anakStickRef.current = anakStick;
    };

    const resetAnakPosition = () => {
        if (!anakStickRef.current) return;

        anakStickRef.current.position.set(0, 0.5, 5);
        anakStickRef.current.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        anakVelocityRef.current.set(0, 0, 0);
        anakRotationVelocityRef.current.set(0, 0, 0);

        if (indukStickRef.current) {
            indukStickRef.current.rotation.set(0, 0, -Math.PI / 3);
            indukStickRef.current.position.set(3, 1, 6);
        }
    };

    const setupInput = () => {
        if (!mountRef.current) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (stateRef.current === "LANDED") return;

            if (stateRef.current === "START" || stateRef.current === "RESET") {
                tossStick();
                // Show scoreboard on mobile after toss
                if (isMobile) setShowScoreboard(true);
            } else if (stateRef.current === "TOSSING") {
                isSwipingRef.current = true;
                const pos = { x: e.clientX, y: e.clientY };
                swipeStartPosRef.current = pos;
                lastMousePosRef.current = pos;
                swipeStartTimeRef.current = Date.now();

                if (indukStickRef.current) {
                    (indukStickRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xc19a6b);
                }
            }
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!isSwipingRef.current || stateRef.current !== "TOSSING") return;
            e.preventDefault();

            const pos = { x: e.clientX, y: e.clientY };
            const sensitivity = 0.02;
            const deltaX = (pos.x - swipeStartPosRef.current.x) * sensitivity;
            const deltaY = (pos.y - swipeStartPosRef.current.y) * sensitivity;

            if (indukStickRef.current) {
                indukStickRef.current.rotation.z = Math.max(Math.min(-Math.PI / 3 - deltaY, 0), -Math.PI);
                indukStickRef.current.rotation.y = -deltaX;
                indukStickRef.current.position.x = 3 + deltaX * 3;
                indukStickRef.current.position.y = 1 - deltaY * 3;
            }

            lastMousePosRef.current = pos;
        };

        const handlePointerUp = (e: PointerEvent) => {
            if (!isSwipingRef.current) return;
            isSwipingRef.current = false;

            if (indukStickRef.current) {
                (indukStickRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xa0522d);
            }

            const endTime = Date.now();
            const duration = (endTime - swipeStartTimeRef.current) / 1000;

            const deltaX = lastMousePosRef.current.x - swipeStartPosRef.current.x;
            const deltaY = lastMousePosRef.current.y - swipeStartPosRef.current.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const speed = distance / (duration * 1000);

            const stickHeight = anakStickRef.current?.position.y || 0;
            const inHitZone =
                stickHeight >= CONFIG.hitZoneHeight.min && stickHeight <= CONFIG.hitZoneHeight.max;

            const isFastEnough = speed > 0.15;
            const isLongEnough = distance > 30;

            if (inHitZone && isFastEnough && isLongEnough) {
                const dirX = deltaX / distance;
                const dirY = deltaY / distance;

                const power = Math.min(speed * 0.8, 1.2);

                const hitVector = new THREE.Vector3(
                    dirX * power * 0.4,
                    Math.abs(dirY) * power * 0.5 + 0.2,
                    -power * 1.5
                );

                performHit(hitVector);
            } else {
                if (!inHitZone) {
                    setGameSubtitle(stickHeight < CONFIG.hitZoneHeight.min ? "Terlambat!" : "Kecepatan!");
                } else if (!isFastEnough || !isLongEnough) {
                    setGameSubtitle("Geser lebih kencang!");
                }
                resetIndukStick();
            }
        };

        mountRef.current.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
    };

    const tossStick = () => {
        stateRef.current = "TOSSING";
        setGameTitle("");
        setGameSubtitle("GESER (SWIPE) SEKARANG!");

        anakVelocityRef.current.set(0, CONFIG.tossForce, 0);
        anakRotationVelocityRef.current.set(0.1, 0, 0.05);
    };

    const performHit = (vector: THREE.Vector3) => {
        stateRef.current = "FLYING";
        setGameSubtitle("PUKULAN BAGUS!");
        playSound("hit");

        anakVelocityRef.current.copy(vector);
        anakRotationVelocityRef.current.set(Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8);
        if (cameraRef.current) cameraRef.current.position.y += 0.2;
    };

    const resetIndukStick = () => {
        if (!indukStickRef.current) return;

        const startRotZ = indukStickRef.current.rotation.z;
        const startRotY = indukStickRef.current.rotation.y;
        let progress = 0;

        const back = () => {
            if (stateRef.current === "TOSSING" && isSwipingRef.current) return;
            progress += 0.1;
            if (progress <= 1 && indukStickRef.current) {
                indukStickRef.current.rotation.z = THREE.MathUtils.lerp(startRotZ, -Math.PI / 3, progress);
                indukStickRef.current.rotation.y = THREE.MathUtils.lerp(startRotY, 0, progress);
                indukStickRef.current.position.lerp(new THREE.Vector3(3, 1, 6), 0.1);
                requestAnimationFrame(back);
            }
        };
        back();
    };

    const updatePhysics = () => {
        if (!anakStickRef.current) return;

        if (stateRef.current === "TOSSING" || stateRef.current === "FLYING") {
            anakVelocityRef.current.y -= CONFIG.gravity;

            if (stateRef.current === "FLYING") {
                anakVelocityRef.current.multiplyScalar(CONFIG.airResistance);
            }

            anakStickRef.current.position.add(anakVelocityRef.current);

            anakStickRef.current.rotation.x += anakRotationVelocityRef.current.x;
            anakStickRef.current.rotation.y += anakRotationVelocityRef.current.y;
            anakStickRef.current.rotation.z += anakRotationVelocityRef.current.z;

            anakRotationVelocityRef.current.multiplyScalar(0.99);

            if (anakStickRef.current.position.y <= 0.1) {
                anakStickRef.current.position.y = 0.1;

                if (stateRef.current === "FLYING") {
                    anakVelocityRef.current.set(0, 0, 0);
                    anakRotationVelocityRef.current.set(0, 0, 0);
                    stateRef.current = "LANDED";
                    calculateScore();
                } else if (stateRef.current === "TOSSING") {
                    anakVelocityRef.current.set(0, 0, 0);
                    anakRotationVelocityRef.current.set(0, 0, 0);
                    stateRef.current = "LANDED";
                    failGame();
                }
            }
        }

        if (stateRef.current === "FLYING" && cameraRef.current && anakStickRef.current) {
            const targetPos = new THREE.Vector3(
                anakStickRef.current.position.x,
                anakStickRef.current.position.y + 6,
                anakStickRef.current.position.z + 12
            );
            cameraRef.current.position.lerp(targetPos, 0.1);
            cameraRef.current.lookAt(anakStickRef.current.position);
        }
    };

    const calculateScore = () => {
        if (!anakStickRef.current || !sceneRef.current) return;

        const startPos = new THREE.Vector3(0, 0, 5);
        const distance = startPos.distanceTo(anakStickRef.current.position);
        const scoreValue = distance / CONFIG.indukLength;

        const lineGeo = new THREE.BufferGeometry().setFromPoints([startPos, anakStickRef.current.position]);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffff00 }));
        sceneRef.current.add(line);

        setDistance(parseFloat(distance.toFixed(2)));
        setScore(parseFloat(scoreValue.toFixed(1)));

        setGameTitle("MANTAP!");
        setGameSubtitle(`Jarak: ${scoreValue.toFixed(1)} Kayu`);
        setShowResetBtn(true);
    };

    const failGame = () => {
        setGameTitle("YAH, JATUH!");
        setGameSubtitle("Tap Main Lagi untuk mencoba.");
        setShowResetBtn(true);
    };

    const resetGame = () => {
        stateRef.current = "START";
        resetAnakPosition();

        if (cameraRef.current) {
            const isMobileView = window.innerWidth < 768;
            cameraRef.current.position.set(0, isMobileView ? 3 : 5, isMobileView ? 15 : 12);
            cameraRef.current.lookAt(0, isMobileView ? 1.5 : 3, 0);
        }

        setGameTitle("Kayu Malele");
        setGameSubtitle("Tap layar untuk melempar");
        setShowResetBtn(false);
        setDistance(0);
        setScore(0);

        // Hide scoreboard on mobile reset
        if (isMobile) setShowScoreboard(false);

        if (sceneRef.current) {
            sceneRef.current.children = sceneRef.current.children.filter((o) => o.type !== "Line");
        }
    };

    const playSound = (type: string) => {
        if (typeof window === "undefined") return;

        if (window.AudioContext || (window as any).webkitAudioContext) {
            const ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === "hit") {
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            }
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        }
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden font-sans touch-none z-50">
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-30">
                <button
                    onClick={() => {
                        triggerTransition('/Papua');
                        setTimeout(() => {
                            window.location.href = '/Papua';
                        }, 2500);
                    }}
                    className="bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-xl border border-white/20"
                >
                    <span className="text-xl">←</span>
                    <span className="text-sm font-semibold">Kembali</span>
                </button>
            </div>

            {/* UI Layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between items-end p-5 z-10">
                {/* Score Board - Right Side, Hidden on Mobile Start */}
                {showScoreboard && (
                    <div className="bg-black/50 text-white p-4 rounded-xl text-lg max-w-xs">
                        <strong>Kayu Malele (Swipe Mode)</strong>
                        <br />
                        Jarak: <span>{distance}</span> meter
                        <br />
                        Skor: <span>{score}</span> Kayu
                        <div className="bg-black/70 p-2 rounded-lg mt-2 text-sm">
                            1. <b>Klik/Tap</b> untuk Melempar ke atas.
                            <br />
                            2. Tempel jari & <b>GESER CEPAT</b> untuk memukul!
                        </div>
                    </div>
                )}

                {/* Center Message */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white pointer-events-none">
                    {gameTitle && <h1 className="m-0 text-5xl text-yellow-400 drop-shadow-lg">{gameTitle}</h1>}
                    <p className="text-xl mt-2 drop-shadow-lg font-bold text-yellow-300">{gameSubtitle}</p>
                    {showResetBtn && (
                        <button
                            onClick={resetGame}
                            className="pointer-events-auto bg-green-600 hover:bg-green-700 text-white border-none px-5 py-3 text-lg cursor-pointer rounded-lg mt-4 transition-colors"
                        >
                            Main Lagi
                        </button>
                    )}
                </div>
            </div>

            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="w-full h-full block touch-none" />
        </div>
    );
}