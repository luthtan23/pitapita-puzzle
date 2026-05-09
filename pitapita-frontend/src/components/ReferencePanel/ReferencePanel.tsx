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
  const isPlaying = gameStatus === "playing" || gameStatus === "paused";

  return (
    <aside className={`${styles.panel} glass-card`} aria-label={t("game.referenceImage")}>
      {/* ── Reference image ─────────────────────────────────────────── */}
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

      {children}
    </aside>
  );
}
