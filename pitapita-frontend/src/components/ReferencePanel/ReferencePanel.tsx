import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import styles from "./ReferencePanel.module.css";

interface ReferencePanelProps {
  imageUrl: string;
  gameStatus: string;
  children?: React.ReactNode;
}


export default function ReferencePanel({
  imageUrl,
  gameStatus,
  children,
}: ReferencePanelProps) {
  const { t } = useTranslation();
  const [peeking, setPeeking] = useState(false);
  const isStoryMission = imageUrl.includes("cyber_trace_puzzle");

  return (
    <aside className={`${styles.panel} glass-card`} aria-label={t("game.referenceImage")}>
      {/* ── Reference image ─────────────────────────────────────────── */}
      {!isStoryMission && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span>🖼️</span> {t("game.referenceImage")}
          </h2>
          <div
            className={`${styles.previewWrapper} ${peeking ? styles.peeking : ""}`}
            onMouseEnter={() => setPeeking(true)}
            onMouseLeave={() => setPeeking(false)}
            onTouchStart={() => setPeeking(true)}
            onTouchEnd={() => setPeeking(false)}
            aria-label={t("game.peek")}
          >
            <Image
              src={imageUrl}
              alt={t("game.referenceImage")}
              fill
              className={styles.previewImg}
              style={{ objectFit: "cover" }}
              priority
            />
            {!peeking && (
              <div className={styles.peekOverlay}>
                <span className={styles.peekIcon}>👁️</span>
                <span className={styles.peekLabel}>{t("game.peek")}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {isStoryMission && (
        <section className={styles.section}>
          <div className={styles.missionActiveBadge}>
            <span className={styles.missionIcon}>👾</span>
            <div className={styles.missionText}>
              <p className={styles.missionTitle}>{t("story.title")}</p>
              <p className={styles.missionSubtitle}>{t("story.role")}</p>
            </div>
          </div>
        </section>
      )}

      {children}
    </aside>
  );
}
