import { useTranslation } from "@/i18n/LanguageContext";
import styles from "./StatsBar.module.css";

interface StatsBarProps {
  moves: number;
  timeStr: string;
  difficulty: string; // This will now be the difficulty key ("easy", etc.)
  difficultyColor: string;
  status: string;
  onPause: () => void;
  onReset: () => void;
  onNewGame: () => void;
  variant?: "default" | "sidebar";
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
  variant = "default",
}: StatsBarProps) {
  const { t } = useTranslation();
  const isSidebar = variant === "sidebar";
  const isPaused = status === "paused";

  return (
    <div className={`${styles.bar} ${isSidebar ? styles.barSidebar : ""}`}>
      <div className={styles.statsContent}>
        {/* Difficulty + Moves Group */}
        <div className={styles.statGroup}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t("common.difficulty")}</span>
            <span
              className={styles.statValue}
              style={{ color: difficultyColor, textShadow: `0 0 12px ${difficultyColor}80` }}
            >
              {t(`difficulty.${difficulty.toLowerCase()}`)}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={`${styles.stat} ${styles.movesStat}`}>
            <span className={styles.statLabel}>{t("common.moves")}</span>
            <span className={`${styles.statValue} ${styles.movesValue}`}>{moves}</span>
          </div>
        </div>

        <div className={styles.dividerMain} />

        {/* Timer */}
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("common.time")}</span>
          <span className={`${styles.statValue} ${styles.timerValue}`}>{timeStr}</span>
        </div>
      </div>

      {!isSidebar && <div className={styles.spacer} />}

      {/* Controls */}
      <div className={styles.controls}>
        <button
          id="btn-stats-new"
          className={`btn-ghost ${styles.ctrlBtn}`}
          onClick={onNewGame}
          aria-label={t("game.newPuzzle")}
        >
          🔀 {t("game.newPuzzle")}
        </button>
        {status === "playing" || status === "paused" ? (
          <button
            id="btn-pause"
            className={`btn-ghost ${styles.ctrlBtn}`}
            onClick={onPause}
            aria-label={isPaused ? t("game.resume") : t("game.pause")}
          >
            {isPaused ? `▶ ${t("game.resume")}` : `⏸ ${t("game.pause")}`}
          </button>
        ) : null}
        <button
          id="btn-reset"
          className={`btn-ghost ${styles.ctrlBtn}`}
          onClick={onReset}
          aria-label={t("game.reset")}
        >
          🔄 {t("game.reset")}
        </button>
      </div>
    </div>
  );
}
