"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { PuzzlePiece } from "@/types/puzzle";
import { CSS } from "@dnd-kit/utilities";
import styles from "./PuzzleBoard.module.css";

interface PuzzlePieceItemProps {
  piece: PuzzlePiece;
  imageUrl: string;
  grid: number;
  disabled: boolean;
}

export default function PuzzlePieceItem({
  piece,
  imageUrl,
  grid,
  disabled,
}: PuzzlePieceItemProps) {
  const isCorrect = piece.currentIndex === piece.correctIndex;

  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({ id: piece.id, disabled });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: piece.id,
    disabled,
  });

  const combinedRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: piece.backgroundSize,
    backgroundPosition: piece.backgroundPosition,
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
      ref={combinedRef}
      className={[
        styles.piece,
        isDragging  ? styles.dragging  : "",
        isOver      ? styles.dropTarget : "",
        isCorrect   ? styles.correct   : "",
        disabled    ? styles.disabled  : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...attributes}
      {...listeners}
      role="gridcell"
      aria-label={`Puzzle piece ${piece.id}`}
      aria-grabbed={isDragging}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Corner accent when correct */}
      {isCorrect && <span className={styles.correctBadge} aria-hidden="true">✓</span>}

      {/* Grid lines overlay (faint) */}
      <div className={styles.gridLine} aria-hidden="true" />
    </div>
  );
}
