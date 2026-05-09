import { useState, useEffect } from "react";
import styles from "./LeaderboardModal.module.css";
import type { ScoreEntry, Difficulty } from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";
import { scoreService } from "@/services/score";

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

export default function LeaderboardModal({ scores: localScores, onClose }: LeaderboardModalProps) {
  const [tab, setTab] = useState<"local" | "global">("local");
  const [globalScores, setGlobalScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");

  useEffect(() => {
    if (tab === "global") {
      fetchGlobalScores();
    }
  }, [tab, selectedDifficulty]);

  const fetchGlobalScores = async () => {
    setLoading(true);
    try {
      const data = await scoreService.getLeaderboard(selectedDifficulty === "all" ? undefined : selectedDifficulty);
      setGlobalScores(data || []);
    } catch (error) {
      console.error("Failed to fetch global scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentScores = tab === "local" 
    ? (selectedDifficulty === "all" ? localScores : localScores.filter(s => s.difficulty === selectedDifficulty)).slice(0, 20)
    : globalScores;

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

        {/* Tabs */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${tab === "local" ? styles.activeTab : ""}`}
            onClick={() => setTab("local")}
          >
            Local
          </button>
          <button 
            className={`${styles.tab} ${tab === "global" ? styles.activeTab : ""}`}
            onClick={() => setTab("global")}
          >
            Global
          </button>
        </div>

        {/* Difficulty Filter */}
        <div className={styles.filters}>
          {(["all", "easy", "medium", "hard", "expert"] as const).map(d => (
            <button
              key={d}
              className={`${styles.filterBtn} ${selectedDifficulty === d ? styles.activeFilter : ""}`}
              onClick={() => setSelectedDifficulty(d)}
            >
              {d === "all" ? "All" : DIFFICULTY_CONFIGS[d].label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : currentScores.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎮</span>
            <p>No scores yet. {tab === "local" ? "Complete a puzzle to appear here!" : "Be the first to top the global charts!"}</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  {tab === "global" && <th>Player</th>}
                  <th>Difficulty</th>
                  <th>Moves</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentScores.map((entry, i) => {
                  const cfg = DIFFICULTY_CONFIGS[entry.difficulty as Difficulty];
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                  return (
                    <tr key={entry.id} className={i < 3 ? styles.topRow : ""}>
                      <td className={styles.rank}>
                        {medal ?? <span className={styles.rankNum}>{i + 1}</span>}
                      </td>
                      {tab === "global" && (
                        <td className={styles.playerCell}>
                          {entry.user?.username || "Anonymous"}
                        </td>
                      )}
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

        <p className={styles.note}>
          {tab === "local" ? "Scores are saved locally in your browser." : "Global rankings across all players."}
        </p>
      </div>
    </div>
  );
}
