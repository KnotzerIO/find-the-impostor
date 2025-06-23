"use client";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/game-store";
import { ArrowLeft } from "lucide-react";
import DiscussionPhase from "./_phases/discussion-phase";
import { ResultsPhase } from "./_phases/results-phase";
import SetupPhase from "./_phases/setup-phase";
import WordRevealPhase from "./_phases/word-reveal-phase";
import { useRouter } from "next/navigation";

const phaseComponents = {
  setup: SetupPhase,
  wordreveal: WordRevealPhase,
  discussion: DiscussionPhase,
  results: ResultsPhase,
};

/**
 * Renders the main game interface, displaying the appropriate phase component and providing navigation controls.
 *
 * Dynamically selects and renders the current game phase component based on the game state. Includes a back button that either navigates to the home page or resets the game, depending on the current phase.
 */
export default function Game() {
  const { gameState, newGame } = useGameStore();
  const router = useRouter();

  const handleReturn = () => {
    if (gameState.phase === "setup") {
      router.push("/");
    } else {
      newGame();
    }
  };

  const PhaseComponent = phaseComponents[gameState.phase] || SetupPhase;

  return (
    <div className="min-h-screen">
      <Button
        onClick={handleReturn}
        variant="ghost"
        size="icon"
        className="absolute top-6 left-2 z-10"
      >
        <ArrowLeft className="size-6" />
      </Button>
      <PhaseComponent />
    </div>
  );
}
