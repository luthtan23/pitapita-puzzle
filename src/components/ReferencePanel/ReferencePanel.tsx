"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ReferencePanel.module.css";
import type { Difficulty } from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

interface ReferencePanelProps {
  imageUrl: string;
  difficulty: Difficulty;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  gameStatus: string;
  moves: number;
  timeStr: string;
}

const DIFFICULTIES = (
  Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]
);

export default function ReferencePanel({
  imageUrl,
  difficulty,
  onSetDifficulty,
  onStart,
  gameStatus,
  moves,
  timeStr,
}: ReferencePanelProps) {
  const [peeking, setPeeking] = useState(false);
  const isPlaying = gameStatus === "playing" || gameStatus === "paused";

  return (
    <aside className={`${styles.panel} glass-card`} aria-label="Reference panel">
      {/* ── Reference image ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>🖼️</span> Reference Image
        </h2>
        <div
          className={`${styles.previewWrapper} ${peeking ? styles.peeking : ""}`}
          onMouseEnter={() => setPeeking(true)}
          onMouseLeave={() => setPeeking(false)}
          onTouchStart={() => setPeeking(true)}
          onTouchEnd={() => setPeeking(false)}
          aria-label="Hover to peek at the reference image"
        >
          <Image
            src={imageUrl}
            alt="Puzzle reference image"
            fill
            className={styles.previewImg}
            style={{ objectFit: "cover" }}
            priority
          />
          {!peeking && (
            <div className={styles.peekOverlay}>
              <span className={styles.peekIcon}>👁️</span>
              <span className={styles.peekLabel}>Peek</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Difficulty selector ──────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>⚙️</span> Difficulty
        </h2>
        <div className={styles.diffGrid}>
          {DIFFICULTIES.map((d) => {
            const cfg = DIFFICULTY_CONFIGS[d];
            return (
              <button
                key={d}
                id={`btn-difficulty-${d}`}
                className={[
                  styles.diffBtn,
                  difficulty === d ? styles.diffBtnActive : "",
                ].join(" ")}
                style={
                  difficulty === d
                    ? ({
                        "--diff-color": cfg.color,
                        borderColor: cfg.color,
                        color: cfg.color,
                        boxShadow: `0 0 16px ${cfg.color}50`,
                      } as React.CSSProperties)
                    : {}
                }
                onClick={() => onSetDifficulty(d)}
                aria-pressed={difficulty === d}
                disabled={isPlaying}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
                <span className={styles.diffGrid2}>
                  {cfg.grid}×{cfg.grid}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Start button ────────────────────────────────────────────── */}
      <section className={styles.section}>
        <button
          id="btn-start"
          className={`btn-primary ${styles.startBtn}`}
          onClick={onStart}
        >
          {gameStatus === "idle" || gameStatus === "won"
            ? "🚀 Start Puzzle"
            : "🔀 New Puzzle"}
        </button>
      </section>

      {/* ── Quick stats (during game) ────────────────────────────────── */}
      {isPlaying && (
        <section className={`${styles.section} ${styles.miniStats}`}>
          <div className={styles.miniStat}>
            <span>🔢</span>
            <span>{moves} moves</span>
          </div>
          <div className={styles.miniStat}>
            <span>⏱️</span>
            <span>{timeStr}</span>
          </div>
        </section>
      )}
    </aside>
  );
}
