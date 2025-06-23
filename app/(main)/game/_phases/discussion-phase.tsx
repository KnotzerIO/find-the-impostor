import { useGameStore } from "@/store/game-store";
import { Button } from "@/components/ui/button";
import { Play, Eye } from "lucide-react";
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
          <h1 className="text-5xl font-bold">{t("sayYourWords")}</h1>

          <div className="space-y-3">
            <Play className="w-8 h-8 mx-auto text-green-400" />
            <p className="text-2xl font-light text-green-400">
              {startPlayer.name} {t("starts")}
            </p>
          </div>
        </div>

        <Button
          onClick={endGame}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 py-6 px-12 rounded-2xl text-lg font-light transition-all duration-200 backdrop-blur-sm"
        >
          <Eye className="w-5 h-5 mr-3" />
          {t("revealImpostor")}
        </Button>
      </div>
    </div>
  );
}
