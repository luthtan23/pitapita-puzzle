"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  Difficulty,
  GameState,
  GameStatus,
  PuzzlePiece,
  ScoreEntry,
} from "@/types/puzzle";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

// ─── Helpers ────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPieces(difficulty: Difficulty, imageUrl: string): PuzzlePiece[] {
  const { grid } = DIFFICULTY_CONFIGS[difficulty];
  const total = grid * grid;
  const pct = (1 / grid) * 100;

  const ordered: PuzzlePiece[] = Array.from({ length: total }, (_, idx) => {
    const row = Math.floor(idx / grid);
    const col = idx % grid;
    return {
      id: `piece-${row}-${col}`,
      correctIndex: idx,
      currentIndex: idx,
      backgroundPosition: `${(col / (grid - 1)) * 100}% ${(row / (grid - 1)) * 100}%`,
      backgroundSize: `${grid * 100}% ${grid * 100}%`,
    };
  });

  void imageUrl; // used in component
  void pct;

  // Shuffle until not already solved
  let shuffled: PuzzlePiece[];
  do {
    const positions = shuffleArray(Array.from({ length: total }, (_, i) => i));
    shuffled = ordered.map((piece, i) => ({
      ...piece,
      currentIndex: positions[i],
    }));
  } while (shuffled.every((p) => p.currentIndex === p.correctIndex));

  return shuffled;
}

function isSolved(pieces: PuzzlePiece[]): boolean {
  return pieces.every((p) => p.currentIndex === p.correctIndex);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

import { scoreService } from "@/services/score";
import { authService } from "@/services/auth";

const SCORES_KEY = "pitapita_scores";

function loadScores(): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

async function saveScore(entry: ScoreEntry) {
  // Always save locally as fallback
  const scores = loadScores();
  scores.unshift(entry);
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, 50)));

  // Try to save to backend if authenticated
  const token = authService.getToken();
  if (token) {
    try {
      await scoreService.submitScore(entry.difficulty, entry.moves, entry.timeSecs);
    } catch (error) {
      console.error("Failed to submit score to backend:", error);
    }
  }
}

export function usePuzzleGame(imageUrl: string) {
  const [state, setState] = useState<GameState>({
    status: "idle",
    difficulty: "medium",
    pieces: [],
    moves: 0,
    elapsedSecs: 0,
    imageUrl,
  });
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load scores on mount
  useEffect(() => {
    setScores(loadScores());
  }, []);

  // Timer
  useEffect(() => {
    if (state.status === "playing") {
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, elapsedSecs: s.elapsedSecs + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status]);

  const startGame = useCallback(
    (difficulty?: Difficulty) => {
      const diff = difficulty ?? state.difficulty;
      const pieces = buildPieces(diff, imageUrl);
      setState({
        status: "playing",
        difficulty: diff,
        pieces,
        moves: 0,
        elapsedSecs: 0,
        imageUrl,
      });
    },
    [imageUrl, state.difficulty]
  );

  const setDifficulty = useCallback((d: Difficulty) => {
    setState((s) => ({ ...s, difficulty: d }));
  }, []);

  const swapPieces = useCallback(
    (fromId: string, toId: string) => {
      if (state.status !== "playing") return;

      const pieces = state.pieces.map((p) => ({ ...p }));
      const fromPiece = pieces.find((p) => p.id === fromId);
      const toPiece = pieces.find((p) => p.id === toId);
      
      if (!fromPiece || !toPiece) return;
      
      const tmp = fromPiece.currentIndex;
      fromPiece.currentIndex = toPiece.currentIndex;
      toPiece.currentIndex = tmp;

      const nextMoves = state.moves + 1;
      const won = isSolved(pieces);

      if (won) {
        const entry: ScoreEntry = {
          id: Date.now().toString(),
          difficulty: state.difficulty,
          moves: nextMoves,
          timeSecs: state.elapsedSecs,
          date: new Date().toISOString(),
        };
        saveScore(entry).then(() => {
          setScores(loadScores());
        });
      }

      setState((prev) => ({
        ...prev,
        pieces,
        moves: nextMoves,
        status: won ? "won" : "playing",
      }));
    },
    [state.status, state.pieces, state.moves, state.difficulty, state.elapsedSecs]
  );

  const togglePause = useCallback(() => {
    setState((s) => ({
      ...s,
      status: s.status === "playing" ? "paused" : "playing",
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "idle",
      pieces: [],
      moves: 0,
      elapsedSecs: 0,
    }));
  }, []);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, []);

  // Sorted grid: slot index → piece
  const sortedPieces = [...state.pieces].sort(
    (a, b) => a.currentIndex - b.currentIndex
  );

  return {
    state,
    sortedPieces,
    scores,
    startGame,
    setDifficulty,
    swapPieces,
    togglePause,
    resetGame,
    formatTime,
  };
}
