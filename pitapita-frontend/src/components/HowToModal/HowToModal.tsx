"use client";

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
  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`${styles.modal} glass-card`}>
        <div className={styles.header}>
          <h2 className={styles.title}><span>❓</span> How to Play</h2>
          <button
            id="btn-close-howto"
            className="btn-ghost"
            onClick={onClose}
            aria-label="Close how to play"
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
          >
            ✕ Close
          </button>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, i) => (
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
          <span>Tip: Fewer moves = more stars ⭐⭐⭐</span>
        </div>

        <button id="btn-howto-start" className={`btn-primary ${styles.cta}`} onClick={onClose}>
          Got it — Let&apos;s Play! 🚀
        </button>
      </div>
    </div>
  );
}
