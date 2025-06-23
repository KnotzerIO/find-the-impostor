import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGameStore } from "@/store/game-store";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export function ResultsPhase() {
  const { gameState, newGame } = useGameStore();
  const t = useTranslations("ResultsPhase");
  const impostors = gameState.players.filter((p) => p.role === "impostor");

  return (
    <div className="h-dvh bg-black text-white flex items-center justify-center p-6">
      <div className="w-md mx-auto text-center space-y-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">{t("results")}</h1>
        </div>

        <div className="space-y-3">
          <p className="text-zinc-500 uppercase tracking-wider">
            {t("theWordWas")}
          </p>
          <p className="text-3xl font-light text-blue-400">
            {gameState.currentWord}
          </p>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="space-y-4">
          <p className="text-zinc-500 uppercase tracking-wider">
            {impostors.length === 1 ? "Impostor" : "Impostors"}
          </p>
          <div className="space-y-3">
            {impostors.map((impostor) => (
              <div
                key={impostor.id}
                className="bg-red-600/10 border border-red-600/20 rounded-xl p-4"
              >
                <p className="text-xl font-light text-red-400">
                  {impostor.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <Button
          onClick={newGame}
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 py-6 px-8 rounded-2xl text-lg font-light transition-all duration-200 backdrop-blur-sm"
        >
          <RotateCcw className="w-5 h-5 mr-3" />
          {t("newGame")}
        </Button>
      </div>
    </div>
  );
}
