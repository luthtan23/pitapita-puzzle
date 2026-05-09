"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ReferencePanel.module.css";

interface ReferencePanelProps {
  imageUrl: string;
  gameStatus: string;
}


export default function ReferencePanel({
  imageUrl,
  gameStatus,
}: ReferencePanelProps) {
  const [peeking, setPeeking] = useState(false);
  const isPlaying = gameStatus === "playing" || gameStatus === "paused";

  return (
    <aside className={`${styles.panel} glass-card`} aria-label="Reference panel">
      {/* ── Reference image ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>🖼️</span> Reference Image
        </h2>
        <div
          className={`${styles.previewWrapper} ${peeking ? styles.peeking : ""}`}
          onMouseEnter={() => setPeeking(true)}
          onMouseLeave={() => setPeeking(false)}
          onTouchStart={() => setPeeking(true)}
          onTouchEnd={() => setPeeking(false)}
          aria-label="Hover to peek at the reference image"
        >
          <Image
            src={imageUrl}
            alt="Puzzle reference image"
            fill
            className={styles.previewImg}
            style={{ objectFit: "cover" }}
            priority
          />
          {!peeking && (
            <div className={styles.peekOverlay}>
              <span className={styles.peekIcon}>👁️</span>
              <span className={styles.peekLabel}>Peek</span>
            </div>
          )}
        </div>
      </section>


    </aside>
  );
}
