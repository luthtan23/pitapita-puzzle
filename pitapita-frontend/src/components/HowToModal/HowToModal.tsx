"use client";

import { useTranslation } from "@/i18n/LanguageContext";
import styles from "./HowToModal.module.css";

interface HowToModalProps {
  onClose: () => void;
}

const STEPS = [
  { icon: "🖼️", title: "Choose Difficulty", desc: "Select Easy (3×3), Medium (4×4), Hard (5×5), or Expert (6×6) from the left panel." },
  { icon: "🚀", title: "Start Puzzle", desc: "Click 'Start Puzzle' and the image will be sliced into shuffled pieces on the board." },
  { icon: "✋", title: "Drag & Drop", desc: "Drag any piece and drop it onto another to swap their positions. Works on touch too!" },
  { icon: "✅", title: "Correct Pieces", desc: "A green border and ✓ badge appear on correctly placed pieces. Aim for all green!" },
  { icon: "👁️", title: "Peek at Reference", desc: "Hover (or tap) the reference image in the left panel to reveal the solution." },
  { icon: "🏆", title: "Finish & Score", desc: "Complete the puzzle to see your rating and save your score to the leaderboard." },
];

export default function HowToModal({ onClose }: HowToModalProps) {
  const { t, tRaw } = useTranslation();
  const steps = tRaw("howTo.steps") || [];

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t("howTo.title")}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`${styles.modal} glass-card`}>
        <div className={styles.header}>
          <h2 className={styles.title}><span>❓</span> {t("howTo.title")}</h2>
          <button
            id="btn-close-howto"
            className="btn-ghost"
            onClick={onClose}
            aria-label={t("howTo.close")}
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
          >
            ✕ {t("howTo.close")}
          </button>
        </div>

        <div className={styles.steps}>
          {steps.map((step: any, i: number) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepContent}>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tip}>
          <span>💡</span>
          <span>{t("howTo.tip")} ⭐⭐⭐</span>
        </div>

        <button id="btn-howto-start" className={`btn-primary ${styles.cta}`} onClick={onClose}>
          {t("howTo.gotIt")} 🚀
        </button>
      </div>
    </div>
  );
}
