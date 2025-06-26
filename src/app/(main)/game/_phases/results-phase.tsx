import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { useGameStore } from "@/src/stores/game-store";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export function ResultsPhase() {
  const { gameState, newGame } = useGameStore();
  const t = useTranslations("ResultsPhase");
  const impostors = gameState.players.filter(p => p.role === "impostor");

  return (
    <div className="flex h-dvh items-center justify-center p-6 text-white">
      <div className="mx-auto w-md space-y-12 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">{t("results")}</h1>
        </div>

        <div className="space-y-3">
          <p className="tracking-wider text-zinc-500 uppercase">
            {t("theWordWas")}
          </p>
          <p className="text-3xl font-light text-blue-400">
            {gameState.currentWord}
          </p>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="space-y-4">
          <p className="tracking-wider text-zinc-500 uppercase">
            {impostors.length === 1 ? "Impostor" : "Impostors"}
          </p>
          <div className="space-y-3">
            {impostors.map(impostor => (
              <div
                key={impostor.id}
                className="rounded-xl border border-red-600/20 bg-red-600/10 p-4"
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
          className="w-full rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-lg font-light text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/20"
        >
          <RotateCcw className="mr-3 h-5 w-5" />
          {t("newGame")}
        </Button>
      </div>
    </div>
  );
}
