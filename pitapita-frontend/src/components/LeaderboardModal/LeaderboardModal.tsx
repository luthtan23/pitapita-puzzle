"use client";

import styles from "./LeaderboardModal.module.css";
import type { ScoreEntry, Difficulty } from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

interface LeaderboardModalProps {
  scores: ScoreEntry[];
  onClose: () => void;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function LeaderboardModal({ scores, onClose }: LeaderboardModalProps) {
  const top = scores.slice(0, 20);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Leaderboard"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`${styles.modal} glass-card`}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span>🏆</span> Leaderboard
          </h2>
          <button
            id="btn-close-leaderboard"
            className="btn-ghost"
            onClick={onClose}
            aria-label="Close leaderboard"
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
          >
            ✕ Close
          </button>
        </div>

        {/* Table */}
        {top.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎮</span>
            <p>No scores yet. Complete a puzzle to appear here!</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Difficulty</th>
                  <th>Moves</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {top.map((entry, i) => {
                  const cfg = DIFFICULTY_CONFIGS[entry.difficulty as Difficulty];
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                  return (
                    <tr key={entry.id} className={i < 3 ? styles.topRow : ""}>
                      <td className={styles.rank}>
                        {medal ?? <span className={styles.rankNum}>{i + 1}</span>}
                      </td>
                      <td>
                        <span
                          className={styles.diffPill}
                          style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}15` }}
                        >
                          {cfg.emoji} {cfg.label}
                        </span>
                      </td>
                      <td className={styles.numCell}>{entry.moves}</td>
                      <td className={styles.numCell}>{formatTime(entry.timeSecs)}</td>
                      <td className={styles.dateCell}>{formatDate(entry.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className={styles.note}>Scores are saved locally in your browser.</p>
      </div>
    </div>
  );
}
