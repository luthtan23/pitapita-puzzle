"use client";

import styles from "./Header.module.css";

interface HeaderProps {
  onLeaderboard: () => void;
  onHowTo: () => void;
}

export default function Header({ onLeaderboard, onHowTo }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">🧩</span>
          <span className={styles.logoText}>
            Pita<strong>Pita</strong>
          </span>
          <span className="badge badge-accent" style={{ fontSize: "0.65rem" }}>Beta</span>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <button
            id="btn-leaderboard"
            className={`btn-ghost ${styles.navBtn}`}
            onClick={onLeaderboard}
            aria-label="Open leaderboard"
          >
            <span aria-hidden="true">🏆</span> Leaderboard
          </button>
          <button
            id="btn-howto"
            className={`btn-ghost ${styles.navBtn}`}
            onClick={onHowTo}
            aria-label="How to play"
          >
            <span aria-hidden="true">❓</span> How to Play
          </button>
        </nav>
      </div>
    </header>
  );
}
