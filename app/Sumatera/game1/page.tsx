"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Piece, GameState } from "./types";
import { PIECES_DATA } from "./constants";
import GameHeader from "./components/GameHeader";
import GameTimer from "./components/GameTimer";
import TargetOutlines from "./components/TargetOutlines";
import SnappedPieces from "./components/SnappedPieces";
import PieceShelf from "./components/PieceShelf";
import IdleOverlay from "./components/IdleOverlay";
import WinOverlay from "./components/WinOverlay";
import LostOverlay from "./components/LostOverlay";
import GameFooter from "./components/GameFooter";

export default function RumahGadangBuilder() {
  const [pieces, setPieces] = useState<Piece[]>(PIECES_DATA);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [showHint, setShowHint] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // --- Game Loop ---
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // --- Hint Logic ---
  useEffect(() => {
    if (gameState !== "playing") return;

    const hintInterval = setInterval(() => {
      if (Date.now() - lastActionTime > 5000) {
        const nextPiece = pieces.find((p) => !p.isSnapped);
        if (nextPiece) {
          setShowHint(nextPiece.id);
        }
      } else {
        setShowHint(null);
      }
    }, 1000);

    return () => clearInterval(hintInterval);
  }, [gameState, lastActionTime, pieces]);

  // --- Handlers ---
  const handleDrag = () => {
    setLastActionTime(Date.now());
    setShowHint(null);
  };

  const checkSnap = (id: string, x: number, y: number) => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;

    const distance = Math.sqrt(
      Math.pow(x - piece.targetX, 2) + Math.pow(y - piece.targetY, 2)
    );

    if (distance < 50) {
      setPieces((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, isSnapped: true } : p));
        if (updated.every((p) => p.isSnapped)) {
          setGameState("won");
        }
        return updated;
      });
    }
  };

  const startGame = () => {
    setPieces(PIECES_DATA.map(p => ({ ...p, isSnapped: false })));
    setTimeLeft(90);
    setGameState("playing");
    setLastActionTime(Date.now());
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      <GameHeader />

      <div 
        ref={canvasRef}
        className="relative w-full max-w-[850px] h-[600px] bg-white rounded-[2.5rem] border-4 border-[var(--secondary)]/20 shadow-[0_20px_50px_rgba(84,51,16,0.1)] overflow-hidden flex items-center justify-center transition-all duration-700"
      >
        <GameTimer timeLeft={timeLeft} />

        <TargetOutlines pieces={pieces} showHint={showHint} />

        <SnappedPieces pieces={pieces} />

        <PieceShelf 
          pieces={pieces} 
          canvasRef={canvasRef} 
          onDrag={handleDrag} 
          checkSnap={checkSnap} 
        />

        <AnimatePresence>
          {gameState === "idle" && <IdleOverlay onStart={startGame} />}
          {gameState === "won" && <WinOverlay onRestart={startGame} />}
          {gameState === "lost" && <LostOverlay onRestart={startGame} />}
        </AnimatePresence>
      </div>

      <GameFooter />
    </div>
  );
}
