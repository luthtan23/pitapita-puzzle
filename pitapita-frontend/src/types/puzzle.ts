// ─── Puzzle Types ─────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface DifficultyConfig {
  label: string;
  grid: number;       // grid = NxN, e.g. 3 → 3×3 = 9 pieces
  emoji: string;
  color: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy:   { label: "Easy",   grid: 3,  emoji: "🟢", color: "#00d4aa" },
  medium: { label: "Medium", grid: 4,  emoji: "🟡", color: "#ffd700" },
  hard:   { label: "Hard",   grid: 5,  emoji: "🔴", color: "#ff6b6b" },
  expert: { label: "Expert", grid: 6,  emoji: "💀", color: "#a855f7" },
};

export interface PuzzlePiece {
  id: string;        // unique id: "piece-<row>-<col>"
  correctIndex: number;   // the slot index this piece belongs to (row*cols+col)
  currentIndex: number;   // where it currently sits in the grid
  backgroundPosition: string;  // CSS background-position for the slice
  backgroundSize: string;      // CSS background-size
}

export type GameStatus = "idle" | "playing" | "paused" | "won";

export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  pieces: PuzzlePiece[];
  moves: number;
  elapsedSecs: number;
  imageUrl: string;
}

export interface ScoreEntry {
  id: string;
  difficulty: Difficulty;
  moves: number;
  timeSecs: number;
  date: string;
}
