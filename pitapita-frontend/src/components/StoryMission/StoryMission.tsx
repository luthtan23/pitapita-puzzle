"use client";

import React from "react";
import styles from "./StoryMission.module.css";
import { useTranslation } from "@/i18n/LanguageContext";

interface StoryMissionProps {
  onStart: (imageUrl: string) => void;
  missionImageUrl: string;
}

export default function StoryMission({ onStart, missionImageUrl }: StoryMissionProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.missionCard} glass-card`}>
      <div className={styles.badge}>
        <span className="badge badge-accent">NEW MISSION</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.textSide}>
          <h2 className={styles.title}>{t("story.title")}</h2>
          <div className={styles.meta}>
            <span className={styles.tag}>📍 {t("story.year")}</span>
            <span className={styles.tag}>👤 {t("story.role")}</span>
          </div>
          
          <p className={styles.description}>
            {t("story.mission")}
          </p>
          
          <div className={styles.riddleBox}>
            <span className={styles.riddleIcon}>💡</span>
            <p className={styles.riddleText}>
              &ldquo;{t("story.riddle")}&rdquo;
            </p>
          </div>
          
          <button 
            className={`btn-primary ${styles.startBtn}`}
            onClick={() => onStart(missionImageUrl)}
          >
            👾 {t("story.startMission")}
          </button>
        </div>
        
        <div className={styles.imageSide}>
          <div 
            className={styles.imagePreview} 
            style={{ backgroundImage: `url(${missionImageUrl})` }}
          >
            <div className={styles.scanline} />
            <div className={styles.noise} />
          </div>
        </div>
      </div>
    </div>
  );
}
