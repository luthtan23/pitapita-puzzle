"use client";

import Image from "next/image";
import styles from "./HeroScreen.module.css";
import type { Difficulty } from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

interface HeroScreenProps {
  imageUrl: string;
  difficulty: Difficulty;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  onHowTo: () => void;
}

const DIFFICULTIES = Object.keys(DIFFICULTY_CONFIGS) as Difficulty[];

export default function HeroScreen({
  imageUrl,
  difficulty,
  onSetDifficulty,
  onStart,
  onHowTo,
}: HeroScreenProps) {
  return (
    <div className={styles.hero}>
      {/* Headline */}
      <div className={styles.headline}>
        <div className={styles.badge}>
          <span className="badge badge-primary">🧩 Image Puzzle</span>
        </div>
        <h1 className={styles.title}>
          Drag. Drop.<br />
          <span className={styles.titleAccent}>Solve.</span>
        </h1>
        <p className={styles.desc}>
          Rearrange beautiful picture pieces using drag-and-drop.<br />
          Choose your difficulty and challenge yourself!
        </p>
      </div>

      {/* Preview image floating */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageGlow} />
        <div className={styles.imageBorder}>
          <Image
            src={imageUrl}
            alt="Puzzle preview"
            width={420}
            height={420}
            className={styles.previewImg}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
            priority
          />
          {/* Puzzle grid overlay */}
          <div className={styles.gridOverlay} aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={styles.gridCell} />
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty chooser */}
      <div className={styles.diffSection}>
        <p className={styles.diffLabel}>Choose Difficulty</p>
        <div className={styles.diffRow}>
          {DIFFICULTIES.map((d) => {
            const cfg = DIFFICULTY_CONFIGS[d];
            return (
              <button
                key={d}
                id={`btn-hero-difficulty-${d}`}
                className={[styles.diffBtn, difficulty === d ? styles.diffBtnActive : ""].join(" ")}
                style={difficulty === d ? ({
                  "--diff-color": cfg.color,
                  borderColor: cfg.color,
                  background: `${cfg.color}18`,
                } as React.CSSProperties) : {}}
                onClick={() => onSetDifficulty(d)}
                aria-pressed={difficulty === d}
              >
                <span className={styles.diffEmoji}>{cfg.emoji}</span>
                <span className={styles.diffLabel2}>{cfg.label}</span>
                <span className={styles.diffSize}>{cfg.grid}×{cfg.grid}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className={styles.ctas}>
        <button id="btn-hero-start" className={`btn-primary ${styles.ctaPrimary}`} onClick={onStart}>
          🚀 Start Puzzle
        </button>
        <button id="btn-hero-howto" className="btn-ghost" onClick={onHowTo}>
          ❓ How to Play
        </button>
      </div>

      {/* Feature chips */}
      <div className={styles.features}>
        {["🖱️ Drag & Drop", "📱 Touch Support", "⏱️ Live Timer", "🏆 Leaderboard"].map((f) => (
          <span key={f} className={styles.featureChip}>{f}</span>
        ))}
      </div>
    </div>
  );
}
