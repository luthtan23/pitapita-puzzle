"use client";

import styles from "./StatsBar.module.css";

interface StatsBarProps {
  moves: number;
  timeStr: string;
  difficulty: string;
  difficultyColor: string;
  status: string;
  onPause: () => void;
  onReset: () => void;
  onNewGame: () => void;
}

export default function StatsBar({
  moves,
  timeStr,
  difficulty,
  difficultyColor,
  status,
  onPause,
  onReset,
  onNewGame,
}: StatsBarProps) {
  const isPaused = status === "paused";

  return (
    <div className={styles.bar}>
      {/* Difficulty pill */}
      <div className={styles.stat}>
        <span className={styles.statLabel}>Difficulty</span>
        <span
          className={styles.statValue}
          style={{ color: difficultyColor, textShadow: `0 0 12px ${difficultyColor}80` }}
        >
          {difficulty}
        </span>
      </div>

      <div className={styles.divider} />

      {/* Moves */}
      <div className={styles.stat}>
        <span className={styles.statLabel}>Moves</span>
        <span className={`${styles.statValue} ${styles.movesValue}`}>{moves}</span>
      </div>

      <div className={styles.divider} />

      {/* Timer */}
      <div className={styles.stat}>
        <span className={styles.statLabel}>Time</span>
        <span className={`${styles.statValue} ${styles.timerValue}`}>{timeStr}</span>
      </div>

      <div className={styles.spacer} />

      {/* Controls */}
      <div className={styles.controls}>
        <button
          id="btn-stats-new"
          className={`btn-ghost ${styles.ctrlBtn}`}
          onClick={onNewGame}
          aria-label="Start new puzzle"
        >
          🔀 New Puzzle
        </button>
        {status === "playing" || status === "paused" ? (
          <button
            id="btn-pause"
            className={`btn-ghost ${styles.ctrlBtn}`}
            onClick={onPause}
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
        ) : null}
        <button
          id="btn-reset"
          className={`btn-ghost ${styles.ctrlBtn}`}
          onClick={onReset}
          aria-label="Reset game"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
