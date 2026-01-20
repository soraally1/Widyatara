"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RendangGame() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progressWidth, setProgressWidth] = useState(0);
    const [instruction, setInstruction] = useState("Tarik <b>Santan</b> ke dalam kuali!");
    const [showStirLabel, setShowStirLabel] = useState(false);

    // Refs for "global" variables in the game scope
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const kualiRef = useRef<THREE.Mesh | null>(null);
    const kualiGroupRef = useRef<THREE.Group | null>(null);
    const spatulaRef = useRef<THREE.Group | null>(null);
    const bowlRef = useRef<THREE.Group | null>(null);
    const fireGroupRef = useRef<THREE.Group | null>(null);
    const mixMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const ingredientMeshesRef = useRef<{ [key: string]: THREE.Mesh }>({});
    const originalPositionsRef = useRef<{ [key: string]: THREE.Vector3 }>({});
    const cookedMeatMeshesRef = useRef<THREE.Mesh[]>([]);
    const fireParticlesRef = useRef<THREE.Mesh[]>([]);
    const stepRef = useRef(0); // Mutable ref for logic access without re-renders
    const stirProgressRef = useRef(0);
    const draggedObjectRef = useRef<THREE.Object3D | null>(null);
    const mouseRef = useRef(new THREE.Vector2());
    const raycasterRef = useRef(new THREE.Raycaster());
    const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5));
    const animIdRef = useRef<number | null>(null);
    const intervalIdsRef = useRef<NodeJS.Timeout[]>([]);

    const steps = ["santan", "rempah", "cabai", "daging"];

    useEffect(() => {
        if (!mountRef.current) return;

        // INIT
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x4a321f);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 8, 12);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ENVIRONMENT
        const tableGeo = new THREE.BoxGeometry(60, 2, 40);
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x5d3a24, roughness: 0.6 });
        const counterTop = new THREE.Mesh(tableGeo, tableMat);
        counterTop.position.y = -2;
        counterTop.receiveShadow = true;
        scene.add(counterTop);

        const wallGeo = new THREE.PlaneGeometry(60, 30);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f });
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.z = -12;
        wall.position.y = 8;
        scene.add(wall);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xfff4e0, 1.0);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        scene.add(mainLight);

        const fireGroup = new THREE.Group();
        scene.add(fireGroup);
        fireGroupRef.current = fireGroup;
        createKitchenFire(fireGroup);

        // KUALI
        const kualiGroup = new THREE.Group();
        kualiGroupRef.current = kualiGroup;

        const wokGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const wokMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide, metalness: 0.7, roughness: 0.3 });
        const kuali = new THREE.Mesh(wokGeo, wokMat);
        kuali.position.y = 1;
        kualiRef.current = kuali;
        kualiGroup.add(kuali);

        const handleGeo = new THREE.TorusGeometry(0.35, 0.1, 16, 32, Math.PI);
        const hL = new THREE.Mesh(handleGeo, wokMat);
        hL.position.set(-1.9, 1.1, 0); hL.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
        kualiGroup.add(hL);
        const hR = hL.clone();
        hR.position.set(1.9, 1.1, 0); hR.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
        kualiGroup.add(hR);
        scene.add(kualiGroup);

        // MIX TEXTURE
        const mixGeo = new THREE.CircleGeometry(1.85, 32);
        const mixMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, roughness: 0.9 });
        mixMaterialRef.current = mixMaterial;
        const mix = new THREE.Mesh(mixGeo, mixMaterial);
        mix.rotation.x = -Math.PI / 2;
        mix.position.y = 0.45;
        kualiGroup.add(mix);

        // SPATULA
        const spatGroup = new THREE.Group();
        const spatHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), new THREE.MeshStandardMaterial({ color: 0x4d3b2f }));
        spatHandle.position.y = 2;
        spatGroup.add(spatHandle);
        const spatHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.05), new THREE.MeshStandardMaterial({ color: 0x777777 }));
        spatHead.rotation.x = Math.PI / 4;
        spatGroup.add(spatHead);
        spatulaRef.current = spatGroup;
        spatGroup.visible = false;
        scene.add(spatGroup);

        createDecorativeBowl(scene);

        // INGREDIENTS
        createDraggable(scene, "santan", 0xeeeeee, new THREE.Vector3(-6, 0, 2));
        createDraggable(scene, "rempah", 0x8b4513, new THREE.Vector3(-4, 0, 4));
        createDraggable(scene, "cabai", 0xff0000, new THREE.Vector3(4, 0, 4));
        createDraggable(scene, "daging", 0x7c3a23, new THREE.Vector3(6, 0, 2));

        // ANIMATION LOOP
        const animate = () => {
            animIdRef.current = requestAnimationFrame(animate);

            // Fire
            fireParticlesRef.current.forEach((p) => {
                p.position.y += p.userData.speed;
                p.userData.life -= 0.025;
                p.scale.multiplyScalar(0.965);
                // @ts-ignore
                p.material.opacity = p.userData.life * 0.7;
                if (p.userData.life <= 0) {
                    p.position.set((Math.random() - 0.5) * 1.8, -0.9, (Math.random() - 0.5) * 1.8);
                    p.userData.life = 1.0;
                    p.scale.set(1, 1, 1);
                }
            });

            // Kuali idle
            if (stepRef.current < 5 && kualiGroupRef.current) {
                kualiGroupRef.current.rotation.y = Math.sin(Date.now() * 0.0006) * 0.06;
            } else if (bowlRef.current && stepRef.current === 5) {
                bowlRef.current.rotation.y += 0.004;
            }

            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
            intervalIdsRef.current.forEach(clearInterval);
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current?.dispose();
        };
    }, []); // Only run once on mount

    // HELPER FUNCTIONS
    const createKitchenFire = (group: THREE.Group) => {
        for (let i = 0; i < 25; i++) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(0.1 + Math.random() * 0.2),
                new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
            );
            p.position.set((Math.random() - 0.5) * 1.8, -0.9, (Math.random() - 0.5) * 1.8);
            p.userData = { speed: 0.03 + Math.random() * 0.05, life: 1.0 };
            group.add(p);
            fireParticlesRef.current.push(p);
        }
    };

    const createDecorativeBowl = (scene: THREE.Scene) => {
        const bGroup = new THREE.Group();
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(0.9, 0.1));
        points.push(new THREE.Vector2(1.6, 0.8));
        points.push(new THREE.Vector2(1.9, 1.5));

        const bGeo = new THREE.LatheGeometry(points, 32);
        const bMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, metalness: 0.05, roughness: 0.2 });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bGroup.add(bMesh);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.2, 32), bMat);
        base.position.y = -0.1;
        bGroup.add(base);

        bowlRef.current = bGroup;
        bGroup.position.set(13, -0.8, -1);
        scene.add(bGroup);
    };

    const createDraggable = (scene: THREE.Scene, type: string, color: number, pos: THREE.Vector3) => {
        let geo;
        if (type === "santan") geo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
        else if (type === "rempah") geo = new THREE.DodecahedronGeometry(0.35);
        else if (type === "cabai") geo = new THREE.ConeGeometry(0.12, 0.9, 8);
        else geo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 }));
        mesh.position.copy(pos);
        mesh.userData.type = type;
        scene.add(mesh);
        ingredientMeshesRef.current[type] = mesh;
        originalPositionsRef.current[type] = pos.clone();
    };

    // INTERACTION HANDLERS
    const updateMousePos = (clientX: number, clientY: number) => {
        mouseRef.current.x = (clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(clientY / window.innerHeight) * 2 + 1;
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        updateMousePos(e.clientX, e.clientY);
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);
        const hits = raycasterRef.current.intersectObjects(Object.values(ingredientMeshesRef.current));

        // Check if the hit object matches the current step
        if (hits.length > 0 && hits[0].object.userData.type === steps[stepRef.current]) {
            draggedObjectRef.current = hits[0].object;
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        updateMousePos(e.clientX, e.clientY);

        // Dragging Logic
        if (draggedObjectRef.current && cameraRef.current) {
            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
            const p = new THREE.Vector3();
            raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, p);
            draggedObjectRef.current.position.copy(p);
        }

        // Stirring Logic
        if (stepRef.current === 4 && spatulaRef.current) {
            spatulaRef.current.position.set(mouseRef.current.x * 5, 0.7 + Math.sin(Date.now() * 0.01) * 0.2, -mouseRef.current.y * 5);
            spatulaRef.current.rotation.y += 0.2;

            // If mouse is near center, increase progress
            if (Math.abs(mouseRef.current.x) < 0.6 && Math.abs(mouseRef.current.y) < 0.6) {
                stirProgressRef.current += 0.3;
                if (stirProgressRef.current > 100) stirProgressRef.current = 100;
                updateStirVisuals();
            }
        }
    };

    const handlePointerUp = () => {
        if (!draggedObjectRef.current) return;

        if (draggedObjectRef.current.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 2.5) {
            addIngredientToPot(draggedObjectRef.current.userData.type);
        } else {
            draggedObjectRef.current.position.copy(originalPositionsRef.current[draggedObjectRef.current.userData.type]);
        }
        draggedObjectRef.current = null;
    };

    const addIngredientToPot = (type: string) => {
        const m = ingredientMeshesRef.current[type];
        const mixMat = mixMaterialRef.current;

        if (type === "santan") {
            if (mixMat) { mixMat.opacity = 0.8; mixMat.color.set(0xffffff); }
            sceneRef.current?.remove(m);
        } else if (type === "rempah") {
            if (mixMat) mixMat.color.lerp(new THREE.Color(0xd2b48c), 0.5);
            sceneRef.current?.remove(m);
        } else if (type === "cabai") {
            if (mixMat) mixMat.color.lerp(new THREE.Color(0xff4500), 0.4);
            sceneRef.current?.remove(m);
        } else if (type === "daging") {
            m.position.set(0, 0.4, 0);
            m.scale.set(0.6, 0.6, 0.6);
            kualiRef.current?.parent?.add(m);
            cookedMeatMeshesRef.current.push(m);
            // add variations
            for (let i = 0; i < 4; i++) {
                const c = m.clone();
                c.position.set((Math.random() - 0.5) * 1.8, 0.4, (Math.random() - 0.5) * 1.8);
                c.rotation.set(Math.random(), Math.random(), Math.random());
                kualiRef.current?.parent?.add(c);
                cookedMeatMeshesRef.current.push(c);
            }
        }

        delete ingredientMeshesRef.current[type];

        // Update State for UI
        const nextStepIndex = stepRef.current + 1;
        stepRef.current = nextStepIndex;
        setCurrentStep(nextStepIndex);

        if (nextStepIndex < 4) {
            const next = steps[nextStepIndex];
            setInstruction(`Lanjut! Masukkan <b>${next.charAt(0).toUpperCase() + next.slice(1)}</b>.`);
        } else {
            setInstruction("Bagus! Sekarang <b>ADUK</b> sampai asat!");
            setShowProgressBar(true);
            setShowStirLabel(true);
            if (spatulaRef.current) spatulaRef.current.visible = true;
        }

        burstSteam(8);
    };

    const updateStirVisuals = () => {
        const prog = stirProgressRef.current;
        setProgressWidth(prog);

        if (mixMaterialRef.current) mixMaterialRef.current.color.lerp(new THREE.Color(0x321605), 0.015);

        cookedMeatMeshesRef.current.forEach((m) => {
            // @ts-ignore
            m.material.color.lerp(new THREE.Color(0x280f00), 0.015);
            m.position.y = 0.4 + Math.sin(Date.now() * 0.015 + m.id) * 0.06;
        });

        if (Math.random() < 0.15) burstSteam(1);
        if (prog >= 100 && stepRef.current === 4) {
            startPouringAnimation();
        }
    };

    const burstSteam = (n: number) => {
        for (let i = 0; i < n; i++) {
            const s = new THREE.Mesh(
                new THREE.SphereGeometry(0.1 + Math.random() * 0.15),
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
            );
            s.position.set((Math.random() - 0.5) * 3.5, 1.2, (Math.random() - 0.5) * 3.5);
            sceneRef.current?.add(s);

            let l = 0;
            const id = setInterval(() => {
                s.position.y += 0.08;
                s.scale.multiplyScalar(1.03);
                // @ts-ignore
                s.material.opacity -= 0.01;
                if (++l > 30) {
                    clearInterval(id);
                    sceneRef.current?.remove(s);
                }
            }, 30);
            intervalIdsRef.current.push(id); // track to clear on unmount
        }
    };

    const startPouringAnimation = () => {
        stepRef.current = 5; // Prevent re-trigger
        setCurrentStep(5); // UI update
        if (spatulaRef.current) spatulaRef.current.visible = false;

        let p = 0;
        const anim = setInterval(() => {
            if (!kualiGroupRef.current) return;
            p += 0.012;

            if (p < 0.4) {
                kualiGroupRef.current.position.x += 0.32;
                kualiGroupRef.current.position.y += 0.08;
            } else if (p < 0.75) {
                kualiGroupRef.current.rotation.z -= 0.05;
                if (Math.random() > 0.6) dropRendangParticle();
            } else if (p < 1.0) {
                kualiGroupRef.current.rotation.z += 0.05;
                kualiGroupRef.current.position.x -= 0.32;
                kualiGroupRef.current.position.y -= 0.08;
                if (p > 0.98) {
                    kualiGroupRef.current.rotation.z = 0;
                    kualiGroupRef.current.position.set(0, 0, 0);
                }
            }
            if (p >= 1.0) {
                clearInterval(anim);
                showFinalResult();
            }
        }, 20);
        intervalIdsRef.current.push(anim);
    };

    const dropRendangParticle = () => {
        if (!kualiGroupRef.current) return;
        const d = new THREE.Mesh(new THREE.SphereGeometry(0.18), new THREE.MeshBasicMaterial({ color: 0x321605 }));
        d.position.set(kualiGroupRef.current.position.x + 0.5, kualiGroupRef.current.position.y + 1, 0);
        sceneRef.current?.add(d);

        let l = 0;
        const a = setInterval(() => {
            d.position.y -= 0.18;
            d.position.x += 0.05;
            if (++l > 15) {
                clearInterval(a);
                sceneRef.current?.remove(d);
            }
        }, 20);
        intervalIdsRef.current.push(a);
    };

    const showFinalResult = () => {
        // MOVE RENDANG TO BOWL
        const sMix = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshStandardMaterial({ color: 0x321605 }));
        sMix.rotation.x = -Math.PI / 2;
        sMix.position.y = 1.0;
        bowlRef.current?.add(sMix);

        cookedMeatMeshesRef.current.forEach((m) => {
            const mc = m.clone();
            mc.position.set((Math.random() - 0.5) * 1.2, 1.15, (Math.random() - 0.5) * 1.2);
            mc.scale.set(0.5, 0.5, 0.5);
            bowlRef.current?.add(mc);
            m.visible = false;
        });
        if (mixMaterialRef.current) mixMaterialRef.current.visible = false;

        // CAMERA ANIMATION
        const camTarget = new THREE.Vector3(13, 1, -1);
        const camPos = new THREE.Vector3(13, 5, 5);

        let p = 0;
        const camAnim = setInterval(() => {
            if (!cameraRef.current) return;
            p += 0.02;
            cameraRef.current.position.lerp(camPos, 0.12);
            cameraRef.current.lookAt(camTarget);
            if (p >= 1.2) {
                clearInterval(camAnim);
                setShowFinishModal(true);
            }
        }, 20);
        intervalIdsRef.current.push(camAnim);
    };

    const reloadGame = () => {
        window.location.reload();
    };

    const isCooking = stepRef.current >= 4;

    return (
        <div className="relative w-full h-screen bg-[#2c1a10] overflow-hidden font-sans touch-none">
            {/* 3D Container */}
            <div
                ref={mountRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-full h-full"
            />

            {/* UI Layer */}
            {!showFinishModal && currentStep < 5 && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-4 z-10 text-white">
                    <div className="bg-[#2d190a]/90 p-4 rounded-2xl text-center max-w-[450px] mx-auto border-2 border-yellow-500 shadow-xl pointer-events-auto">
                        <h1 className="text-xl md:text-2xl font-bold mb-1 text-yellow-500 italic">Dapur Tradisi Minang</h1>

                        <div className="mb-2">
                            {steps.map((s, idx) => (
                                <span
                                    key={s}
                                    className={`inline-block px-2 py-0.5 rounded-xl text-[0.7rem] m-0.5 border border-[#553311] 
                     ${idx <= currentStep && currentStep < 4 && steps[currentStep] === s ? "bg-yellow-500 text-black font-bold border-white opacity-100" : ""}
                     ${idx < currentStep ? "bg-green-600 text-white opacity-100" : ""}
                     ${idx > currentStep ? "bg-[#3d2211] text-[#fde68a] opacity-80" : ""}
                   `}
                                >
                                    {s === 'santan' ? '🥥 Santan' : s === 'rempah' ? '🌿 Rempah' : s === 'cabai' ? '🌶️ Cabai' : '🥩 Daging'}
                                </span>
                            ))}
                        </div>

                        <p className="text-base md:text-lg" dangerouslySetInnerHTML={{ __html: instruction }} />

                        {showProgressBar && (
                            <div className="w-full bg-[#442211] h-2.5 rounded-full mt-2.5 overflow-hidden border border-[#663311]">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-800 transition-all duration-100"
                                    style={{ width: `${progressWidth}%` }}
                                />
                            </div>
                        )}

                        {showStirLabel && (
                            <p className="mt-2 text-yellow-300 font-bold animate-pulse text-sm">
                                Gunakan jari/mouse untuk mengaduk!
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Finish Modal */}
            {showFinishModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white/98 p-6 rounded-2xl border-l-8 border-orange-800 shadow-2xl max-w-[450px] w-full text-left text-[#2d1a0d]">
                        <h2 className="text-2xl font-black mb-2 text-orange-800">MAHAKARYA SELESAI!</h2>
                        <p className="mb-4 opacity-80">Rendang telah tersaji sempurna.</p>

                        <div className="border-t border-orange-200 pt-4 mb-4">
                            <h3 className="font-bold mb-2 underline text-orange-700">Sejarah Rendang</h3>
                            <p className="leading-relaxed mb-3 text-sm">
                                Berasal dari <b>Minangkabau</b>, Sumatera Barat. Rendang lahir dari kebutuhan membawa bekal yang tahan lama saat merantau.
                            </p>
                            <h3 className="font-bold mb-2 underline text-orange-700">Filosofi 4 Unsur</h3>
                            <ul className="leading-relaxed space-y-1 text-sm">
                                <li><b>1. Daging:</b> Simbol Pemimpin Adat.</li>
                                <li><b>2. Santan:</b> Simbol Kaum Intelektual.</li>
                                <li><b>3. Cabai:</b> Simbol Ulama yang tegas.</li>
                                <li><b>4. Bumbu:</b> Simbol keharmonisan masyarakat.</li>
                            </ul>
                        </div>

                        <div className="text-center mt-6">
                            <button
                                onClick={reloadGame}
                                className="bg-orange-700 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:bg-orange-800 transition-colors"
                                type="button"
                            >
                                Masak Lagi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
