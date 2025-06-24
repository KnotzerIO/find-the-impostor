"use client";

import DiscussionPhase from "./_phases/discussion-phase";
import MobileSetupPhase from "./_phases/mobile-setup-phase";
import { ResultsPhase } from "./_phases/results-phase";
import SetupPhase from "./_phases/setup-phase";
import WordRevealPhase from "./_phases/word-reveal-phase";
import { Button } from "@/src/components/ui/button";
import { useGameStore } from "@/src/stores/game-store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Game() {
  const { gameState, newGame, setPhase, _hasHydrated } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    if (!gameState.phase) {
      setPhase("setup");
    }
  }, [gameState.phase, setPhase]);

  const handleReturn = () => {
    if (gameState.phase === "setup") {
      router.push("/");
    } else {
      newGame();
    }
  };

  if (!gameState.phase || !_hasHydrated) {
    return null;
  }

  return (
    <div className="h-dvh">
      {/* Button - hidden on mobile during setup because it needs different logic */}
      <Button
        onClick={handleReturn}
        variant="ghost"
        size="icon"
        className={`absolute top-6 left-2 z-10 ${
          gameState.phase === "setup" ? "max-md:hidden" : ""
        }`}
      >
        <ArrowLeft className="size-6" />
      </Button>

      {gameState.phase === "setup" && (
        <>
          <div className="hidden md:block">
            <SetupPhase />
          </div>
          <div className="md:hidden">
            <MobileSetupPhase />
          </div>
        </>
      )}

      {gameState.phase === "wordreveal" && <WordRevealPhase />}
      {gameState.phase === "discussion" && <DiscussionPhase />}
      {gameState.phase === "results" && <ResultsPhase />}
    </div>
  );
}
