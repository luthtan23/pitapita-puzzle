import React from "react";
import Image from "next/image";
import { useTranslation } from "@/i18n/LanguageContext";
import styles from "./HeroScreen.module.css";
import type { Difficulty } from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";
import PuzzleCatalog from "@/components/PuzzleCatalog/PuzzleCatalog";
import StoryMission from "@/components/StoryMission/StoryMission";

interface HeroScreenProps {
  imageUrl: string;
  difficulty: Difficulty;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
  onHowTo: () => void;
  user: any;
  onAuth: () => void;
  onLogout: () => void;
  onSetImage: (url: string) => void;
}

const DIFFICULTIES = Object.keys(DIFFICULTY_CONFIGS) as Difficulty[];
const STORY_MISSION_IMAGE = "/cyber_trace_puzzle_1778345372080.png";

export default function HeroScreen({
  imageUrl,
  difficulty,
  onSetDifficulty,
  onStart,
  onHowTo,
  user,
  onAuth,
  onLogout,
  onSetImage,
}: HeroScreenProps) {
  const { t } = useTranslation();

  const handleStartMission = (img: string) => {
    onSetImage(img);
    onSetDifficulty("hard"); // Default to hard for mission
    setTimeout(() => {
      onStart();
    }, 100);
  };

  return (
    <div className={styles.hero}>
      {/* Top Bar / Auth */}
      <div className={styles.topBar}>
        {user ? (
          <div className={styles.userProfile}>
            <span className={styles.userName}>👋 {user.username}</span>
            <button className="btn-link" onClick={onLogout} style={{ fontSize: '0.8rem' }}>{t("header.logout")}</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={onAuth} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            🔑 {t("header.login")}
          </button>
        )}
      </div>

      {/* Headline */}
      <div className={styles.headline}>
        <div className={styles.badge}>
          <span className="badge badge-primary">🧩 PitaPita Puzzle</span>
        </div>
        <h1 className={styles.title}>
          Drag. Drop.<br />
          <span className={styles.titleAccent}>Solve.</span>
        </h1>
        <p className={styles.desc}>
          {t("hero.description")}
        </p>
      </div>

      {/* Story Mission */}
      <StoryMission 
        missionImageUrl={STORY_MISSION_IMAGE} 
        onStart={handleStartMission} 
      />

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
      
      {/* Puzzle Catalog */}
      <div className={styles.catalogSection}>
        <p className={styles.sectionLabel}>{t("hero.selectPuzzle")}</p>
        <PuzzleCatalog 
          currentImageUrl={imageUrl}
          onSelect={onSetImage}
        />
      </div>

      {/* Difficulty chooser */}
      <div className={styles.diffSection}>
        <p className={styles.diffLabel}>{t("hero.chooseDifficulty")}</p>
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
                <span className={styles.diffLabel2}>{t(`difficulty.${d}`)}</span>
                <span className={styles.diffSize}>{t("difficulty.size", { n: cfg.grid })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      <div className={styles.ctas}>
        <button id="btn-hero-start" className={`btn-primary ${styles.ctaPrimary}`} onClick={onStart}>
          🚀 {t("hero.startPuzzle")}
        </button>
        <button id="btn-hero-howto" className="btn-ghost" onClick={onHowTo}>
          ❓ {t("header.howToPlay")}
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
