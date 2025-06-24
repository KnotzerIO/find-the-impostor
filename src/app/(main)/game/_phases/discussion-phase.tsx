import { Button } from "@/src/components/ui/button";
import { useSound } from "@/src/hooks/use-sound";
import { useGameStore } from "@/src/stores/game-store";
import { Eye, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function DiscussionPhase() {
  const { gameState, endGame } = useGameStore();
  const t = useTranslations("DiscussionPhase");
  const playImpostorSound = useSound("/sounds/impostor-sound.mp3", 1);
  const startPlayerIndex = Math.floor(Math.random() * gameState.players.length);
  const startPlayer = gameState.players[startPlayerIndex];

  useEffect(() => {
    playImpostorSound();
  }, [playImpostorSound]);

  return (
    <div className="flex h-dvh items-center justify-center p-6">
      <div className="mx-auto max-w-sm space-y-16 text-center">
        <div className="space-y-6">
          <p className="text-2xl leading-relaxed text-gray-400">
            {t("sayYourWords")}
          </p>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
            <Play className="h-10 w-10 fill-white text-white" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-green-400">
              {startPlayer.name}
            </h1>
            <p className="text-xl text-gray-300">{t("starts")}</p>
          </div>
        </div>

        <Button
          onClick={endGame}
          className="w-full rounded-xl bg-red-600 py-6 text-lg font-medium text-white transition-all duration-200 hover:bg-red-700"
        >
          <Eye className="mr-3 h-5 w-5" />
          {t("revealImpostor")}
        </Button>
      </div>
    </div>
  );
}
