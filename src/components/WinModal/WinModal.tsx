"use client";

import { useEffect, useRef } from "react";
import styles from "./WinModal.module.css";
import type { Difficulty } from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

interface WinModalProps {
  moves: number;
  timeSecs: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
}

const CONFETTI_COLORS = [
  "#6c63ff","#a855f7","#00d4aa","#ffd700","#ff6b6b","#0099ff","#ff8c00",
];

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function WinModal({
  moves,
  timeSecs,
  difficulty,
  onPlayAgain,
  onLeaderboard,
}: WinModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cfg = DIFFICULTY_CONFIGS[difficulty];

  // Confetti
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const pieces: HTMLDivElement[] = [];

    for (let i = 0; i < 60; i++) {
      const c = document.createElement("div");
      c.className = styles.confetti;
      c.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${2 + Math.random() * 3}s;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        transform: rotate(${Math.random() * 360}deg);
      `;
      el.appendChild(c);
      pieces.push(c);
    }

    return () => pieces.forEach((p) => p.remove());
  }, []);

  // Star rating based on moves and difficulty
  const maxMoves = cfg.grid * cfg.grid * 4;
  const ratio = moves / maxMoves;
  const stars = ratio < 0.5 ? 3 : ratio < 0.8 ? 2 : 1;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Puzzle solved">
      <div ref={containerRef} className={`${styles.modal} glass-card`}>
        {/* Trophy */}
        <div className={styles.trophy}>🏆</div>

        {/* Title */}
        <h2 className={styles.title}>Puzzle Solved!</h2>
        <p className={styles.subtitle}>Incredible! You nailed it.</p>

        {/* Stars */}
        <div className={styles.stars} aria-label={`${stars} star rating`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`${styles.star} ${n <= stars ? styles.starActive : styles.starDim}`}
              style={{ animationDelay: `${(n - 1) * 0.15}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔢</span>
            <span className={styles.statNum}>{moves}</span>
            <span className={styles.statLbl}>Moves</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>⏱️</span>
            <span className={styles.statNum}>{formatTime(timeSecs)}</span>
            <span className={styles.statLbl}>Time</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>{cfg.emoji}</span>
            <span className={styles.statNum} style={{ color: cfg.color, fontSize: "1rem" }}>
              {cfg.label}
            </span>
            <span className={styles.statLbl}>Difficulty</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button id="btn-play-again" className="btn-primary" onClick={onPlayAgain}>
            🔀 Play Again
          </button>
          <button id="btn-view-leaderboard" className="btn-ghost" onClick={onLeaderboard}>
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
