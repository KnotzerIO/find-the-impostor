import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { useGameStore } from "@/src/stores/game-store";
import {
  Drama,
  Eye,
  EyeOff,
  MessageCircle,
  RotateCcw,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function WordRevealPhase() {
  const { gameState, nextRevealPlayer, startDiscussion } = useGameStore();
  const t = useTranslations("WordRevealPhase");
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [randomHint, setRandomHint] = useState<string>("");
  const [revealedPlayers, setRevealedPlayers] = useState<number[]>([]);
  const allPlayersRevealed = revealedPlayers.length >= gameState.players.length;

  const handleCardSelect = (index: number) => {
    setSelectedCardIndex(index);
    setIsCardFlipped(false);

    //TODO: integrate dialog instead of view
    // Force scroll to top immediately on user interaction
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // Safari iOS
    document.documentElement.scrollTop = 0;
  };

  const handleCardFlip = () => {
    if (isCardFlipped) return;

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
      <div className="flex h-dvh items-center justify-center overflow-hidden p-6 text-white">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <Users className="mx-auto h-16 w-16 text-green-400" />
            <h1 className="text-3xl font-bold">{t("allCardsRevealed")}</h1>
            <p className="text-zinc-400">{t("everyPlayerSeen")}</p>
          </div>
          <div className="mb-6">
            <Button
              onClick={startDiscussion}
              className="w-full rounded-xl bg-green-600 py-6 text-lg font-medium text-white transition-all duration-200 hover:bg-green-700"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t("startDiscussion")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCardIndex === null) {
    return (
      <div className="min-h-dvh p-6 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{t("chooseYourCard")}</h1>
            <p className="hidden text-zinc-400 md:block">
              {t("selectAnyCard")}
            </p>
            <Badge variant="outline" className="border-zinc-600 text-zinc-300">
              {revealedPlayers.length} {t("of")} {gameState.players.length}{" "}
              {t("playersRevealed")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {gameState.players.map((player, index) => {
              const hasBeenRevealed = revealedPlayers.includes(index);

              return (
                <Card
                  key={index}
                  className={`py-0 transition-all duration-300 md:py-6 ${
                    hasBeenRevealed
                      ? "pointer-events-none border-gray-700 bg-gray-800/30 opacity-60"
                      : "hover:scale-105 hover:border-gray-600 hover:bg-gray-800/50"
                  } cursor-pointer`}
                  onClick={() => handleCardSelect(index)}
                >
                  <CardContent className="space-y-4 p-3 text-center sm:p-6">
                    <div className="bg-purple mx-auto flex h-16 w-16 items-center justify-center rounded-xl text-2xl">
                      {hasBeenRevealed ? (
                        <Eye className="h-8 w-8 text-zinc-500" />
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
    <div className="flex h-dvh items-center justify-center p-6 text-white">
      <div className="mx-auto max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">{selectedPlayer.name}</h2>
        </div>

        <div className="relative">
          <Card
            className={`min-w-xs transform border-zinc-700 bg-zinc-900/70 backdrop-blur-sm transition-all duration-500 ${
              isCardFlipped ? "scale-105" : ""
            }`}
            onClick={handleCardFlip}
          >
            <CardContent className="w-full p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                {!isCardFlipped ? (
                  // Card Back
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800">
                      <EyeOff className="h-12 w-12 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400">{t("readyToReveal")}</p>
                  </div>
                ) : (
                  // Card Front
                  <div className="space-y-4 text-center">
                    {isImpostor ? (
                      <div className="space-y-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-600/20">
                          <Drama className="h-10 w-10 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-purple text-3xl font-light tracking-wide">
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
                              <div className="flex flex-wrap justify-center gap-2">
                                <Badge className="border-purple-600/30 bg-purple-600/20 text-purple-300">
                                  {randomHint}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-600/20">
                          <Eye className="h-10 w-10 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-zinc-400">{t("yourWordIs")}</p>
                          <p className="text-purple text-3xl font-light tracking-wide">
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

        <div className="mb-6">
          {!isCardFlipped ? (
            <Button
              onClick={handleCardFlip}
              className="w-full rounded-xl bg-blue-600 py-6 text-lg font-medium text-white transition-all duration-200 hover:bg-blue-700"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              {t("flipCard")}
            </Button>
          ) : (
            <Button
              onClick={handleNextPlayer}
              className="w-full rounded-xl bg-green-600 py-6 text-lg font-medium text-white transition-all duration-200 hover:bg-green-700"
            >
              {t("nextPlayer")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
