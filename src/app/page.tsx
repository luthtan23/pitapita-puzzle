"use client";

import { useState } from "react";
import { usePuzzleGame } from "@/hooks/usePuzzleGame";
import Header from "@/components/Header/Header";
import StatsBar from "@/components/StatsBar/StatsBar";
import PuzzleBoard from "@/components/PuzzleBoard/PuzzleBoard";
import ReferencePanel from "@/components/ReferencePanel/ReferencePanel";
import HeroScreen from "@/components/HeroScreen/HeroScreen";
import WinModal from "@/components/WinModal/WinModal";
import LeaderboardModal from "@/components/LeaderboardModal/LeaderboardModal";
import HowToModal from "@/components/HowToModal/HowToModal";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

export default function PuzzlePage() {
  const imageUrl = "/puzzle_landscape.png";
  
  const {
    state,
    sortedPieces,
    scores,
    startGame,
    setDifficulty,
    swapPieces,
    togglePause,
    resetGame,
    formatTime,
  } = usePuzzleGame(imageUrl);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const difficultyCfg = DIFFICULTY_CONFIGS[state.difficulty];

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header 
        onLeaderboard={() => setShowLeaderboard(true)} 
        onHowTo={() => setShowHowTo(true)} 
      />

      <main style={{ flex: 1, padding: "24px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {state.status === "idle" ? (
          <HeroScreen
            imageUrl={imageUrl}
            difficulty={state.difficulty}
            onSetDifficulty={setDifficulty}
            onStart={() => startGame()}
            onHowTo={() => setShowHowTo(true)}
          />
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "minmax(300px, 350px) 1fr", 
            gap: "32px",
            alignItems: "start"
          }}>
            {/* Left Panel */}
            <ReferencePanel
              imageUrl={imageUrl}
              difficulty={state.difficulty}
              onSetDifficulty={setDifficulty}
              onStart={() => startGame()}
              gameStatus={state.status}
              moves={state.moves}
              timeStr={formatTime(state.elapsedSecs)}
            />

            {/* Right Side: Stats + Board */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <StatsBar
                moves={state.moves}
                timeStr={formatTime(state.elapsedSecs)}
                difficulty={difficultyCfg.label}
                difficultyColor={difficultyCfg.color}
                status={state.status}
                onPause={togglePause}
                onReset={resetGame}
              />
              
              <div style={{ position: "relative" }}>
                <PuzzleBoard
                  pieces={sortedPieces}
                  grid={difficultyCfg.grid}
                  imageUrl={imageUrl}
                  isPaused={state.status === "paused"}
                  onSwap={swapPieces}
                />

                {/* Pause Overlay */}
                {state.status === "paused" && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(5, 10, 20, 0.6)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20px",
                    zIndex: 50
                  }}>
                    <button className="btn-primary" onClick={togglePause}>
                      ▶ Resume Game
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {state.status === "won" && (
        <WinModal
          moves={state.moves}
          timeSecs={state.elapsedSecs}
          difficulty={state.difficulty}
          onPlayAgain={() => startGame()}
          onLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal 
          scores={scores} 
          onClose={() => setShowLeaderboard(false)} 
        />
      )}

      {showHowTo && (
        <HowToModal 
          onClose={() => setShowHowTo(false)} 
        />
      )}

      {/* Responsive adjustments for the grid layout */}
      <style jsx>{`
        @media (max-width: 1024px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
