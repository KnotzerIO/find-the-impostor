import { useGameStore } from "@/store/game-store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  RotateCcw,
  Users,
  MessageCircle,
  Eye,
  EyeOff,
  Drama,
} from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Displays the word reveal phase of the game, allowing players to sequentially reveal their assigned words or roles.
 *
 * Renders a UI for selecting and revealing player cards, showing either the assigned word or impostor status with optional hints. Progresses through all players and transitions to the discussion phase once all cards have been revealed.
 */
export default function WordRevealPhase() {
  const { gameState, nextRevealPlayer, startDiscussion } = useGameStore();
  const t = useTranslations("WordRevealPhase");
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [randomHint, setRandomHint] = useState<string>("");
  const [revealedPlayers, setRevealedPlayers] = useState<number[]>([]);
  const allPlayersRevealed = revealedPlayers.length >= gameState.players.length;

  const handleCardSelect = (index: number) => {
    setSelectedCardIndex(index);
    setIsCardFlipped(false);
  };

  const handleCardFlip = () => {
    setIsCardFlipped(true);

    if (selectedPlayer?.role === "impostor" && gameState.showHintsToImpostors) {
      const hints = gameState.currentHints;
      const randomIndex = Math.floor(Math.random() * hints.length);
      setRandomHint(hints[randomIndex]);
    }
  };

  const handleNextPlayer = () => {
    if (!revealedPlayers.includes(selectedCardIndex!)) {
      setRevealedPlayers([...revealedPlayers, selectedCardIndex!]);
    }

    setSelectedCardIndex(null);
    setIsCardFlipped(false);

    if (revealedPlayers.length < gameState.players.length - 1) {
      nextRevealPlayer();
    }
  };

  if (allPlayersRevealed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="space-y-2">
            <Users className="w-16 h-16 mx-auto text-green-400" />
            <h1 className="text-3xl font-bold">{t("allCardsRevealed")}</h1>
            <p className="text-zinc-400">{t("everyPlayerSeen")}</p>
          </div>

          <Button
            onClick={startDiscussion}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t("startDiscussion")}
          </Button>
        </div>
      </div>
    );
  }

  if (selectedCardIndex === null) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{t("chooseYourCard")}</h1>
            <p className="text-zinc-400">{t("selectAnyCard")}</p>
            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
              {revealedPlayers.length} {t("of")} {gameState.players.length}{" "}
              {t("playersRevealed")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gameState.players.map((player, index) => {
              const hasBeenRevealed = revealedPlayers.includes(index);

              return (
                <Card
                  key={index}
                  className={`
                   transition-all duration-300
                  ${
                    hasBeenRevealed
                      ? "bg-gray-800/30 border-gray-700 opacity-60 pointer-events-none"
                      : "hover:bg-gray-800/50 hover:border-gray-600 hover:scale-105"
                  }
                  cursor-pointer
                `}
                  onClick={() => handleCardSelect(index)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-purple rounded-xl flex items-center justify-center text-2xl">
                      {hasBeenRevealed ? (
                        <Eye className="w-8 h-8 text-zinc-500" />
                      ) : player.name.includes(t("player")) ? (
                        player.id
                      ) : (
                        player.name[0].toUpperCase()
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-xs text-zinc-500">
                        {!hasBeenRevealed && t("tapToReveal")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedPlayer = gameState.players[selectedCardIndex];
  const isImpostor = selectedPlayer?.role === "impostor";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{selectedPlayer.name}</h2>
          <Badge variant="outline" className="border-zinc-600 text-zinc-300">
            {t("player")} {selectedCardIndex + 1} {t("of")}{" "}
            {gameState.players.length}
          </Badge>
        </div>

        <div className="relative">
          <Card
            className={`bg-zinc-900/70 border-zinc-700 backdrop-blur-sm transition-all duration-500 transform min-w-xs ${
              isCardFlipped ? "scale-105" : ""
            }`}
          >
            <CardContent className="p-8 w-full">
              <div className="flex flex-col justify-center items-center space-y-6">
                {!isCardFlipped ? (
                  // Card Back
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                      <EyeOff className="w-12 h-12 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400">{t("readyToReveal")}</p>
                  </div>
                ) : (
                  // Card Front
                  <div className="text-center space-y-4">
                    {isImpostor ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-purple-600/20 rounded-full flex items-center justify-center border-2 border-pruple-500">
                          <Drama className="w-10 h-10 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-light text-purple tracking-wide">
                            IMPOSTOR
                          </p>
                        </div>

                        {gameState.showHintsToImpostors && (
                          <div className="space-y-3">
                            <Separator className="bg-zinc-700" />
                            <div className="space-y-2">
                              <p className="text-sm text-zinc-400">
                                {t("yourHint")}
                              </p>
                              <div className="flex flex-wrap gap-2 justify-center">
                                <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                                  {randomHint}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-purple-600/20 rounded-full flex items-center justify-center border-2 border-purple-500">
                          <Eye className="w-10 h-10 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-zinc-400">{t("yourWordIs")}</p>
                          <p className="text-3xl font-light text-purple tracking-wide">
                            {gameState.currentWord}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {!isCardFlipped ? (
            <Button
              onClick={handleCardFlip}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t("flipCard")}
            </Button>
          ) : (
            <Button
              onClick={handleNextPlayer}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200"
            >
              {t("nextPlayer")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
