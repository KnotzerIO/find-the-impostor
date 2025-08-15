"use client";

import MobileCategorySelection from "../_components/mobile-category-selection";
import MobilePlayerManagement from "../_components/mobile-player-management";
import SettingsModal from "../_components/settings-modal";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Locale } from "@/src/config/language";
import { useGameStore } from "@/src/stores/game-store";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  Play,
  Tag,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MobileSetupPhase() {
  const {
    gameState,
    playerNames,
    customCategories,
    setPlayerCount,
    setPlayerName,
    setImpostorCount,
    toggleCategory,
    addCustomCategory,
    removeCustomCategory,
    setCustomCategory,
    toggleHints,
    startGame,
  } = useGameStore();

  const [currentScreen, setCurrentScreen] = useState<
    "main" | "players" | "categories"
  >("main");
  const [isStarting, setIsStarting] = useState(false);
  const t = useTranslations("SetupPhase");
  const tError = useTranslations("Error");
  const router = useRouter();
  const locale = useLocale() as Locale;

  const handleStartGame = async () => {
    try {
      if (isStarting) return;
      if (gameState.gameStarted) return;
      setIsStarting(true);
      await startGame(t, locale);
    } catch (error) {
      console.error(error);
      toast.error(tError("somethingWentWrong"));
    } finally {
      setIsStarting(false);
    }
  };

  const canStartGame =
    gameState.selectedCategories.length > 0 && gameState.totalPlayers >= 3;

  const getCategoryDisplayText = () => {
    if (gameState.selectedCategories.length === 1) {
      const category = gameState.selectedCategories[0];
      return customCategories.includes(category)
        ? category
        : t(category, { fallback: category });
    }
    return `${gameState.selectedCategories.length} ${t("selected")}`;
  };

  if (currentScreen === "players") {
    return (
      <MobilePlayerManagement
        onBack={() => setCurrentScreen("main")}
        gameState={gameState}
        playerNames={playerNames}
        setPlayerCount={setPlayerCount}
        setPlayerName={setPlayerName}
        t={t}
      />
    );
  }

  if (currentScreen === "categories") {
    return (
      <MobileCategorySelection
        onBack={() => setCurrentScreen("main")}
        gameState={gameState}
        customCategories={customCategories}
        toggleCategory={toggleCategory}
        addCustomCategory={addCustomCategory}
        removeCustomCategory={removeCustomCategory}
        setCustomCategory={setCustomCategory}
        t={t}
      />
    );
  }

  return (
    <div className="max-dvh h-dvh">
      {/* Disable overlay blocks all user interactions while game is starting */}
      {isStarting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center"></div>
      )}

      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="icon"
        className="absolute top-6 left-2 z-10"
      >
        <ArrowLeft className="size-6" />
      </Button>

      <SettingsModal />

      <div className="container mx-auto space-y-8 px-4 py-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">{t("gameSetup")}</h1>
        </div>

        <div className="space-y-6">
          <Card
            className="rounded-3xl p-0"
            onClick={() => setCurrentScreen("players")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-white">
                      {t("players")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {gameState.totalPlayers} {t("ready")}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="rounded-3xl p-0"
            onClick={() => setCurrentScreen("categories")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-white">
                      {t("categories")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {getCategoryDisplayText()}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-white">
                      Impostors
                    </div>
                    <div className="text-sm text-gray-400">
                      {gameState.impostorCount} {t("of")}{" "}
                      {gameState.totalPlayers}
                    </div>
                  </div>
                </div>
                <div className="flex w-20 items-center">
                  <Select
                    value={gameState.impostorCount.toString()}
                    onValueChange={value => setImpostorCount(Number(value))}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-zinc-700 bg-zinc-800/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      {Array.from(
                        { length: gameState.totalPlayers - 1 },
                        (_, i) => i + 1,
                      ).map(num => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="text-white focus:bg-zinc-800 focus:text-white"
                        >
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      gameState.showHintsToImpostors
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-white">
                      {t("hints")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {gameState.showHintsToImpostors
                        ? t("enabled")
                        : t("disabled")}
                    </div>
                  </div>
                </div>
                <Switch
                  className="h-6 w-12"
                  checked={gameState.showHintsToImpostors}
                  onCheckedChange={toggleHints}
                />
              </div>
            </CardContent>
          </Card>

          <div className="pt-6">
            <Button
              onClick={handleStartGame}
              disabled={!canStartGame || isStarting}
              className="h-16 w-full rounded-2xl bg-white text-lg font-semibold text-black hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:opacity-50"
            >
              <Play className="mr-3 h-6 w-6" />
              {isStarting ? t("generateWords") : t("startGame")}
            </Button>

            {!canStartGame && gameState.selectedCategories.length === 0 && (
              <p className="mt-3 text-center text-sm text-red-400">
                {t("selectCategory")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
