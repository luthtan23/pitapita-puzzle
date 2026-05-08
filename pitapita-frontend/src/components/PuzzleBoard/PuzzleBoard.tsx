"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { PuzzlePiece } from "@/types/puzzle";
import PuzzlePieceItem from "@/components/PuzzleBoard/PuzzlePieceItem";
import styles from "./PuzzleBoard.module.css";

interface PuzzleBoardProps {
  pieces: PuzzlePiece[];         // sorted by currentIndex
  grid: number;                  // NxN grid size
  imageUrl: string;
  isPaused: boolean;
  onSwap: (fromId: string, toId: string) => void;
}

export default function PuzzleBoard({
  pieces,
  grid,
  imageUrl,
  isPaused,
  onSwap,
}: PuzzleBoardProps) {
  const [activePiece, setActivePiece] = useState<PuzzlePiece | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const piece = pieces.find((p) => p.id === event.active.id);
    setActivePiece(piece ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePiece(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onSwap(active.id as string, over.id as string);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
          gridTemplateRows:    `repeat(${grid}, 1fr)`,
        }}
        aria-label={`${grid}×${grid} puzzle board`}
        role="grid"
      >
        {pieces.map((piece) => (
          <PuzzlePieceItem
            key={piece.id}
            piece={piece}
            imageUrl={imageUrl}
            grid={grid}
            disabled={isPaused}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
        {activePiece ? (
          <div
            className={styles.dragOverlay}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize:  activePiece.backgroundSize,
              backgroundPosition: activePiece.backgroundPosition,
              backgroundRepeat: "no-repeat",
              aspectRatio: "1 / 1",
            }}
            aria-hidden="true"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
