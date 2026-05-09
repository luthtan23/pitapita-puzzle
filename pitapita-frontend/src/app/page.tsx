"use client";

import { useState, useEffect } from "react";
import { usePuzzleGame } from "@/hooks/usePuzzleGame";
import Header from "@/components/Header/Header";
import StatsBar from "@/components/StatsBar/StatsBar";
import PuzzleBoard from "@/components/PuzzleBoard/PuzzleBoard";
import ReferencePanel from "@/components/ReferencePanel/ReferencePanel";
import HeroScreen from "@/components/HeroScreen/HeroScreen";
import WinModal from "@/components/WinModal/WinModal";
import LeaderboardModal from "@/components/LeaderboardModal/LeaderboardModal";
import HowToModal from "@/components/HowToModal/HowToModal";
import AuthModal from "@/components/AuthModal/AuthModal";
import { authService } from "@/services/auth";
import { DIFFICULTY_CONFIGS } from "@/types/puzzle";

export default function PuzzlePage() {
  const [selectedImage, setSelectedImage] = useState("/puzzle_landscape.png");
  
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
  } = usePuzzleGame(selectedImage);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleAuthSuccess = () => {
    setUser(authService.getUser());
    setShowAuth(false);
  };

  // Register service worker for PWA support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg))
        .catch((err) => console.log("SW error:", err));
    }
  }, []);

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
            imageUrl={selectedImage}
            difficulty={state.difficulty}
            onSetDifficulty={setDifficulty}
            onStart={() => startGame()}
            onHowTo={() => setShowHowTo(true)}
            user={user}
            onAuth={() => setShowAuth(true)}
            onLogout={handleLogout}
            onSetImage={setSelectedImage}
          />
        ) : (
          <div className="game-layout" style={{ 
            display: "grid", 
            gridTemplateColumns: "minmax(300px, 350px) 1fr", 
            gap: "32px",
            alignItems: "start"
          }}>
            {/* Left Panel */}
            <ReferencePanel
              imageUrl={selectedImage}
              gameStatus={state.status}
            >
              <StatsBar
                moves={state.moves}
                timeStr={formatTime(state.elapsedSecs)}
                difficulty={state.difficulty}
                difficultyColor={difficultyCfg.color}
                status={state.status}
                onPause={togglePause}
                onReset={resetGame}
                onNewGame={() => startGame()}
                variant="sidebar"
              />
            </ReferencePanel>

            <div className="puzzle-workplace" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ position: "relative" }}>
                <PuzzleBoard
                  pieces={sortedPieces}
                  grid={difficultyCfg.grid}
                  imageUrl={selectedImage}
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

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Responsive adjustments for the grid layout */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .game-layout {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          
          .puzzle-workplace {
            order: 1;
            width: 100%;
          }
          
          .game-layout :global(aside) {
            order: 2;
            max-width: 420px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
