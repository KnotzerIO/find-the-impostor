import { Button } from "@/src/components/ui/button";
import { useGameStore } from "@/src/stores/game-store";
import { Eye, Play } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DiscussionPhase() {
  const { gameState, endGame } = useGameStore();
  const t = useTranslations("DiscussionPhase");

  const startPlayerIndex = Math.floor(Math.random() * gameState.players.length);
  const startPlayer = gameState.players[startPlayerIndex];

  return (
    <div className="h-dvh flex justify-center items-center p-6">
      <div className="max-w-sm mx-auto text-center space-y-16">
        <div className="space-y-6">
          <p className="text-gray-400 text-2xl leading-relaxed">
            {t("sayYourWords")}
          </p>
          <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-white fill-white" />
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
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200"
        >
          <Eye className="w-5 h-5 mr-3" />
          {t("revealImpostor")}
        </Button>
      </div>
    </div>
  );
}
