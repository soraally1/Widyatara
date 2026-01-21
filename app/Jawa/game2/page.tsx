'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTF } from 'three/addons/loaders/GLTFLoader.js';

// Game Configuration
const CONFIG = {
    noteSpeed: 6.5,
    spawnHeight: 18,
    hitY: 1.5,
    hitWindow: 1.0,
    laneWidth: 2.2
};

const SCALES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C Major

// Song Database
const SONGS = {
    level1: {
        title: "Gundul Gundul Pacul",
        data: [
            { note: 0, time: 1.0 }, { note: 2, time: 2.0 },
            { note: 0, time: 3.0 }, { note: 2, time: 4.0 },
            { note: 3, time: 5.0 }, { note: 4, time: 6.0 }, { note: 4, time: 7.0 },
            { note: 0, time: 9.0 }, { note: 2, time: 10.0 },
            { note: 0, time: 11.0 }, { note: 2, time: 12.0 },
            { note: 3, time: 13.0 }, { note: 4, time: 14.0 }, { note: 4, time: 15.0 },
            { note: 6, time: 17.0 }, { note: 7, time: 17.5 },
            { note: 6, time: 18.5 }, { note: 7, time: 19.0 },
            { note: 5, time: 20.0 }, { note: 4, time: 21.0 },
            { note: 6, time: 23.0 }, { note: 7, time: 23.5 },
            { note: 6, time: 24.5 }, { note: 7, time: 25.0 },
            { note: 5, time: 26.0 }, { note: 4, time: 27.0 },
            { note: 3, time: 28.0 }, { note: 0, time: 29.0 },
        ]
    },
    level2: {
        title: "Cublak Cublak Suweng",
        data: [
            { note: 2, time: 1.0 }, { note: 4, time: 1.5 },
            { note: 2, time: 2.0 }, { note: 4, time: 2.5 },
            { note: 2, time: 3.0 }, { note: 4, time: 3.5 }, { note: 1, time: 4.0 },
            { note: 2, time: 5.0 }, { note: 4, time: 5.5 },
            { note: 6, time: 6.0 }, { note: 6, time: 6.5 }, { note: 6, time: 7.0 },
            { note: 5, time: 7.5 }, { note: 4, time: 8.0 },
            { note: 2, time: 9.0 }, { note: 4, time: 9.5 },
            { note: 2, time: 10.0 }, { note: 4, time: 10.5 },
            { note: 2, time: 11.0 }, { note: 4, time: 11.5 }, { note: 1, time: 12.0 },
            { note: 0, time: 13.0 }, { note: 1, time: 13.5 }, { note: 2, time: 14.0 }, { note: 3, time: 14.5 },
            { note: 2, time: 15.0 }, { note: 1, time: 15.5 }, { note: 0, time: 16.0 },
            { note: 0, time: 17.0 }, { note: 1, time: 17.5 }, { note: 2, time: 18.0 }, { note: 3, time: 18.5 },
            { note: 2, time: 19.0 }, { note: 1, time: 19.5 }, { note: 0, time: 20.0 },
            { note: 0, time: 21.0 }, { note: 2, time: 21.5 },
            { note: 4, time: 22.5 }, { note: 6, time: 23.0 }, { note: 5, time: 23.5 }, { note: 4, time: 24.0 },
            { note: 0, time: 25.0 }, { note: 2, time: 25.5 },
            { note: 4, time: 26.5 }, { note: 6, time: 27.0 }, { note: 5, time: 27.5 }, { note: 4, time: 28.0 },
            { note: 0, time: 30.0 }
        ]
    },
    level3: {
        title: "Suwe Ora Jamu",
        data: [
            { note: 1, time: 1.0 }, { note: 1, time: 1.5 },
            { note: 2, time: 2.0 }, { note: 3, time: 2.5 },
            { note: 4, time: 3.0 }, { note: 4, time: 4.0 },
            { note: 4, time: 5.0 }, { note: 4, time: 5.5 },
            { note: 7, time: 6.0 }, { note: 6, time: 6.5 },
            { note: 4, time: 7.0 }, { note: 3, time: 7.5 }, { note: 2, time: 8.0 },
            { note: 1, time: 9.5 }, { note: 1, time: 10.0 },
            { note: 2, time: 10.5 }, { note: 3, time: 11.0 },
            { note: 4, time: 11.5 }, { note: 4, time: 12.5 },
            { note: 4, time: 13.5 }, { note: 3, time: 14.0 },
            { note: 2, time: 14.5 }, { note: 1, time: 15.0 }, { note: 0, time: 16.0 },
            { note: 4, time: 17.0 }, { note: 3, time: 18.0 },
            { note: 2, time: 19.0 }, { note: 1, time: 20.0 }, { note: 0, time: 21.0 }
        ]
    }
};

// Audio System
class AngklungAudio {
    audioElements: HTMLAudioElement[];
    audioFiles: string[];

    constructor() {
        // Map note indices to audio files
        this.audioFiles = [
            '/nada/Do.m4a',   // 0
            '/nada/Re.m4a',   // 1
            '/nada/Mi.m4a',   // 2
            '/nada/Fa.m4a',   // 3
            '/nada/So.m4a',   // 4
            '/nada/La.m4a',   // 5
            '/nada/Si.m4a',   // 6
            '/nada/DoH.m4a'   // 7
        ];

        // Create HTML5 Audio elements for each note
        this.audioElements = this.audioFiles.map(file => {
            const audio = new Audio(file);
            audio.preload = 'auto';
            audio.volume = 0.8;
            return audio;
        });
    }

    resume() {
        // HTML5 Audio doesn't need resume like AudioContext
    }

    playNote(index: number) {
        if (!this.audioElements[index]) {
            console.warn(`Audio element for note ${index} not available`);
            return;
        }

        const audio = this.audioElements[index];

        // Stop any currently playing instance
        audio.pause();
        audio.currentTime = 0;

        // Play the audio
        audio.play().catch(error => {
            console.error(`Failed to play note ${index}:`, error);
        });

        // Stop audio after 600ms to simulate a single angklung hit
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 600);
    }
}

export default function AngklungGame() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [gameState, setGameState] = useState({
        playing: false,
        score: 0,
        combo: 0,
        currentSong: '',
        showMenu: true,
        showGameOver: false
    });
    const [feedback, setFeedback] = useState({ text: '', visible: false, color: '' });

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const audioRef = useRef<AngklungAudio | null>(null);
    const gameDataRef = useRef<any>({
        startT: 0,
        notePtr: 0,
        currentSongData: [],
        fallingNotes: [],
        angklungModels: [],
        angklungHitboxes: [],
        noteGroup: null,
        animationId: null
    });

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Three.js Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x2d1b3e, 10, 60);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            150
        );
        camera.position.set(0, 8, 20);
        camera.lookAt(0, 2, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Audio System
        audioRef.current = new AngklungAudio();

        // Sky
        const skyGeo = new THREE.SphereGeometry(80, 32, 32);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x1a0b2e) },
                bottomColor: { value: new THREE.Color(0xd97706) },
                offset: { value: 10 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);

        // Lighting
        const ambLight = new THREE.AmbientLight(0xffaa55, 0.3);
        scene.add(ambLight);

        const dirLight = new THREE.DirectionalLight(0xffd700, 1.2);
        dirLight.position.set(-10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        const spotLight = new THREE.SpotLight(0x4c1d95, 2.0);
        spotLight.position.set(20, 10, 0);
        spotLight.lookAt(0, 0, 0);
        scene.add(spotLight);

        // Stage
        const stageGeo = new THREE.BoxGeometry(30, 1, 12);
        const stageMat = new THREE.MeshStandardMaterial({
            color: 0x5c3a21,
            roughness: 0.2,
            metalness: 0.1
        });
        const stage = new THREE.Mesh(stageGeo, stageMat);
        stage.position.y = -0.5;
        stage.receiveShadow = true;
        scene.add(stage);

        const edgeGeo = new THREE.BoxGeometry(30.2, 0.8, 12.2);
        const edgeMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.y = -0.6;
        scene.add(edge);

        // Mountains
        const mtnGeo = new THREE.ConeGeometry(20, 15, 4);
        const mtnMat = new THREE.MeshBasicMaterial({ color: 0x1f1126, fog: true });

        const mtn1 = new THREE.Mesh(mtnGeo, mtnMat);
        mtn1.position.set(-25, 4, -30);
        mtn1.scale.set(2, 1, 1);
        scene.add(mtn1);

        const mtn2 = new THREE.Mesh(mtnGeo, mtnMat);
        mtn2.position.set(20, 5, -40);
        mtn2.scale.set(3, 1.2, 1);
        scene.add(mtn2);

        // Fireflies
        const particleCount = 100;
        const particlesGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSpeeds: any[] = [];

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 50;
            particlePositions[i * 3 + 1] = Math.random() * 20;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

            particleSpeeds.push({
                y: Math.random() * 0.05 + 0.01,
                x: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            });
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0xffe680,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const fireflies = new THREE.Points(particlesGeo, particlesMat);
        scene.add(fireflies);

        // Load Angklung Models
        const loader = new GLTFLoader();
        const angklungGroup = new THREE.Group();
        const startX = -((8 - 1) * CONFIG.laneWidth) / 2;
        const angklungModels: THREE.Group[] = [];
        const angklungHitboxes: THREE.Mesh[] = [];

        for (let i = 0; i < 8; i++) {
            const modelGroup = new THREE.Group();

            loader.load('/model/angklung.glb', (gltf: GLTF) => {
                const model = gltf.scene;
                model.scale.set(2.0, 2.0, 2.0);
                model.position.y = 0;
                model.traverse((child: THREE.Object3D) => {
                    if ((child as THREE.Mesh).isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                modelGroup.add(model);
            });

            // Hitbox
            const hitbox = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 6, 2),
                new THREE.MeshBasicMaterial({ visible: false })
            );
            hitbox.position.y = 3;
            hitbox.userData = { index: i, type: 'angklung' };
            modelGroup.add(hitbox);
            angklungHitboxes.push(hitbox);

            // Target Ring
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(0.6, 0.7, 32),
                new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                })
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.1;
            modelGroup.add(ring);

            modelGroup.position.set(startX + (i * CONFIG.laneWidth), 0, 0);
            angklungGroup.add(modelGroup);
            angklungModels.push(modelGroup);
        }
        scene.add(angklungGroup);

        gameDataRef.current.angklungModels = angklungModels;
        gameDataRef.current.angklungHitboxes = angklungHitboxes;

        // Note Group
        const noteGroup = new THREE.Group();
        scene.add(noteGroup);
        gameDataRef.current.noteGroup = noteGroup;

        // Raycaster for input
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleInput = (x: number, y: number) => {
            if (!gameDataRef.current.playing) return;

            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(angklungHitboxes);

            if (hits.length > 0) {
                hitAngklung(hits[0].object.userData.index);
            }
        };

        const handleMouseDown = (e: MouseEvent) => handleInput(e.clientX, e.clientY);
        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            handleInput(e.touches[0].clientX, e.touches[0].clientY);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });

        // Animation Loop
        const animate = (time: number) => {
            gameDataRef.current.animationId = requestAnimationFrame(animate);

            // Animate Fireflies
            const positions = fireflies.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += particleSpeeds[i].y;
                if (positions[i * 3 + 1] > 20) positions[i * 3 + 1] = 0;
                positions[i * 3] += Math.sin(time * 0.001 + i) * 0.02;
                positions[i * 3 + 2] += Math.cos(time * 0.001 + i) * 0.02;
            }
            fireflies.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);

            if (!gameDataRef.current.playing) return;

            const tGame = (performance.now() - gameDataRef.current.startT) / 1000;
            const songData = gameDataRef.current.currentSongData;
            const travelTime = (CONFIG.spawnHeight - CONFIG.hitY) / CONFIG.noteSpeed;

            while (gameDataRef.current.notePtr < songData.length) {
                const noteInfo = songData[gameDataRef.current.notePtr];
                if (tGame >= noteInfo.time - travelTime) {
                    spawnNote(noteInfo.note);
                    gameDataRef.current.notePtr++;
                } else {
                    break;
                }
            }

            let activeCount = 0;
            gameDataRef.current.fallingNotes.forEach((n: any) => {
                if (!n.active) return;
                activeCount++;

                n.mesh.position.y -= CONFIG.noteSpeed * 0.016;

                if (n.mesh.position.y < -2) {
                    n.active = false;
                    noteGroup.remove(n.mesh);
                    updateHUD(0, 'MBOYAK');
                }
            });

            if (gameDataRef.current.notePtr >= songData.length && activeCount === 0) {
                finishGame();
            }
        };

        animate(0);

        // Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('resize', handleResize);
            if (gameDataRef.current.animationId) {
                cancelAnimationFrame(gameDataRef.current.animationId);
            }
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    const spawnNote = (noteIndex: number) => {
        const startX = -((8 - 1) * CONFIG.laneWidth) / 2;
        const geo = new THREE.SphereGeometry(0.35, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.6,
            roughness: 0.1
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(startX + (noteIndex * CONFIG.laneWidth), CONFIG.spawnHeight, 0);

        gameDataRef.current.noteGroup.add(mesh);
        gameDataRef.current.fallingNotes.push({ mesh, noteIndex, active: true });
    };

    const hitAngklung = (index: number) => {
        audioRef.current?.playNote(index);

        const model = gameDataRef.current.angklungModels[index];
        if (model) {
            // Simple shake animation
            const originalRotation = model.rotation.z;
            model.rotation.z = 0.15;
            setTimeout(() => { model.rotation.z = originalRotation; }, 100);
        }

        let hit = false;
        for (let n of gameDataRef.current.fallingNotes) {
            if (n.active && n.noteIndex === index) {
                const dy = Math.abs(n.mesh.position.y - CONFIG.hitY);
                if (dy < CONFIG.hitWindow) {
                    hit = true;
                    n.active = false;
                    gameDataRef.current.noteGroup.remove(n.mesh);
                    spawnParticles(n.mesh.position, 0xffff00);
                    if (dy < 0.3) updateHUD(100, 'SAE!');
                    else updateHUD(50, 'LUMAYAN');
                    break;
                }
            }
        }
    };

    const spawnParticles = (pos: THREE.Vector3, color: number) => {
        if (!sceneRef.current) return;

        for (let i = 0; i < 10; i++) {
            const p = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.1, 0.1),
                new THREE.MeshBasicMaterial({ color })
            );
            p.position.copy(pos);
            sceneRef.current.add(p);

            setTimeout(() => {
                sceneRef.current?.remove(p);
            }, 600);
        }
    };

    const updateHUD = (points: number, text: string) => {
        setGameState(prev => {
            const newCombo = points > 0 ? prev.combo + 1 : 0;
            return {
                ...prev,
                score: prev.score + points,
                combo: newCombo
            };
        });

        const color = points >= 100 ? '#34d399' : (points > 0 ? '#facc15' : '#ef4444');
        setFeedback({ text, visible: true, color });
        setTimeout(() => setFeedback(prev => ({ ...prev, visible: false })), 400);
    };

    const startGame = (levelId: keyof typeof SONGS) => {
        const song = SONGS[levelId];
        gameDataRef.current.currentSongData = song.data;
        gameDataRef.current.playing = true;
        gameDataRef.current.startT = performance.now();
        gameDataRef.current.notePtr = 0;
        gameDataRef.current.fallingNotes.forEach((n: any) =>
            gameDataRef.current.noteGroup.remove(n.mesh)
        );
        gameDataRef.current.fallingNotes = [];

        setGameState({
            playing: true,
            score: 0,
            combo: 0,
            currentSong: song.title,
            showMenu: false,
            showGameOver: false
        });

        audioRef.current?.resume();
    };

    const finishGame = () => {
        gameDataRef.current.playing = false;
        setTimeout(() => {
            setGameState(prev => ({ ...prev, playing: false, showGameOver: true }));
        }, 1000);
    };

    const showMenu = () => {
        setGameState(prev => ({ ...prev, showMenu: true, showGameOver: false, playing: false }));
        gameDataRef.current.playing = false;
    };

    const replayLevel = () => {
        const levelId = Object.keys(SONGS).find(
            key => SONGS[key as keyof typeof SONGS].title === gameState.currentSong
        ) as keyof typeof SONGS;
        if (levelId) startGame(levelId);
    };

    return (
        <>
            <style jsx global>{`
        body {
          margin: 0;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #1a1a1a;
        }
        
        #canvas-container {
          width: 100vw;
          height: 100vh;
          display: block;
        }
      `}</style>

            <div ref={containerRef} id="canvas-container" />

            {/* UI Layer */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between">
                {/* HUD Top */}
                <div className="flex justify-between p-5 text-white" style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
                }}>
                    <div>
                        <div className="text-xs text-amber-200 tracking-widest uppercase">Tembang</div>
                        <div className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                            {gameState.currentSong || 'Memilih...'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-extrabold font-mono text-white" style={{ textShadow: '0 0 10px #fbbf24' }}>
                            {gameState.score}
                        </div>
                        <div className="text-xs text-gray-400 tracking-widest">BIJI</div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: gameState.combo > 0 ? '#facc15' : '#9ca3af' }}>
                            x{gameState.combo}
                        </div>
                        <div className="text-xs text-gray-400 tracking-widest">COMBO</div>
                    </div>
                </div>

                {/* Feedback */}
                <div
                    className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-black transition-opacity duration-200 whitespace-nowrap"
                    style={{
                        opacity: feedback.visible ? 1 : 0,
                        color: feedback.color,
                        textShadow: '0 0 20px rgba(255,255,255,0.8)',
                        fontFamily: 'serif',
                        letterSpacing: '2px',
                        pointerEvents: 'none'
                    }}
                >
                    {feedback.text}
                </div>
            </div>

            {/* Menu Screen - Glassmorphic Design */}
            {gameState.showMenu && (
                <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-auto"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(26, 11, 46, 0.75), rgba(20, 10, 5, 0.85))',
                        backdropFilter: 'blur(16px)',
                        zIndex: 10
                    }}
                >
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 50% 50%, #fbbf24 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}
                    />

                    {/* Title Section */}
                    <div className="text-center mb-20 relative z-10">
                        <h1
                            className="text-9xl font-bold mb-3"
                            style={{
                                fontFamily: 'serif',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.4))',
                                letterSpacing: '0.02em'
                            }}
                        >
                            ANGKLUNG
                        </h1>
                        <div
                            className="text-3xl font-light tracking-[1em] uppercase"
                            style={{
                                color: 'rgba(254, 243, 199, 0.9)',
                                textShadow: '0 2px 15px rgba(0,0,0,0.6)'
                            }}
                        >
                            Jawi
                        </div>
                    </div>

                    {/* Song Selection - Glass Cards */}
                    <div className="flex flex-col gap-6 relative z-10">
                        {[
                            { id: 'level1', title: 'Gundul Gundul Pacul', region: 'Jawa Tengah', difficulty: '★☆☆' },
                            { id: 'level2', title: 'Cublak Cublak Suweng', region: 'Jawa Timur', difficulty: '★★☆' },
                            { id: 'level3', title: 'Suwe Ora Jamu', region: 'Yogyakarta', difficulty: '★★☆' }
                        ].map((song) => (
                            <button
                                key={song.id}
                                onClick={() => startGame(song.id as keyof typeof SONGS)}
                                className="group relative overflow-hidden transition-all duration-500 ease-out"
                                style={{
                                    background: 'rgba(217, 119, 6, 0.08)',
                                    border: '2px solid rgba(251, 191, 36, 0.25)',
                                    padding: '24px 45px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    width: '420px',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(217, 119, 6, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                                    e.currentTarget.style.transform = 'translateX(12px) scale(1.03)';
                                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(251, 191, 36, 0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(217, 119, 6, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.25)';
                                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="text-left">
                                        <div className="text-2xl font-bold mb-2 text-amber-50" style={{ fontFamily: 'serif' }}>
                                            {song.title}
                                        </div>
                                        <div className="text-sm text-amber-200/70">{song.region}</div>
                                    </div>
                                    <div className="text-3xl ml-6" style={{ color: '#fbbf24' }}>{song.difficulty}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Game Over Screen - Glassmorphic Design */}
            {gameState.showGameOver && (
                <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-auto"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(26, 11, 46, 0.8), rgba(20, 10, 5, 0.9))',
                        backdropFilter: 'blur(20px)',
                        zIndex: 10
                    }}
                >
                    <div className="text-center relative z-10">
                        <h2 className="text-6xl font-bold mb-6 text-amber-100" style={{ fontFamily: 'serif', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                            SAMPUN PARIPURNA
                        </h2>
                        <div className="text-2xl text-amber-200/70 mb-4 uppercase tracking-[0.3em]">Total Biji</div>
                        <div className="text-8xl font-black mb-12" style={{
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.5))'
                        }}>
                            {gameState.score}
                        </div>

                        <div className="flex gap-6 justify-center">
                            <button
                                onClick={showMenu}
                                style={{
                                    background: 'rgba(75, 85, 99, 0.3)',
                                    border: '2px solid rgba(156, 163, 175, 0.4)',
                                    color: 'white',
                                    padding: '16px 48px',
                                    borderRadius: '50px',
                                    fontWeight: 'bold',
                                    fontSize: '1.3rem',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(75, 85, 99, 0.5)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(75, 85, 99, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(75, 85, 99, 0.3)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                                }}
                            >
                                Pilih Lagu
                            </button>
                            <button
                                onClick={replayLevel}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.3), rgba(180, 83, 9, 0.3))',
                                    border: '2px solid rgba(251, 191, 36, 0.5)',
                                    color: 'white',
                                    padding: '16px 48px',
                                    borderRadius: '50px',
                                    fontWeight: 'bold',
                                    fontSize: '1.3rem',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 8px 24px rgba(217, 119, 6, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 119, 6, 0.5), rgba(180, 83, 9, 0.5))';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(251, 191, 36, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 119, 6, 0.3), rgba(180, 83, 9, 0.3))';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(217, 119, 6, 0.3)';
                                }}
                            >
                                Main Meneh
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
