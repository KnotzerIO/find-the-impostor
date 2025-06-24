"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useGameStore } from "@/src/stores/game-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  Play,
  Tag,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MobileCategorySelection from "../_components/mobile-category-selection";
import MobileGameSettings from "../_components/mobile-game-settings";
import MobilePlayerManagement from "../_components/mobile-player-management";
import { Switch } from "@/src/components/ui/switch";

export default function MobileSetupPhase() {
  const {
    gameState,
    playerNames,
    customCategories,
    setPlayerCount,
    setPlayerName,
    setImpostorCount,
    setLanguage,
    toggleCategory,
    addCustomCategory,
    removeCustomCategory,
    setCustomCategory,
    toggleHints,
    startGame,
  } = useGameStore();

  const [currentScreen, setCurrentScreen] = useState<
    "main" | "players" | "categories" | "settings"
  >("main");
  const [isStarting, setIsStarting] = useState(false);
  const t = useTranslations("SetupPhase");
  const router = useRouter();

  const handleStartGame = async () => {
    setIsStarting(true);
    await startGame(t);
    setIsStarting(false);
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

  if (currentScreen === "settings") {
    return (
      <MobileGameSettings
        onBack={() => setCurrentScreen("main")}
        gameState={gameState}
        setImpostorCount={setImpostorCount}
        setLanguage={setLanguage}
        toggleHints={toggleHints}
        t={t}
      />
    );
  }

  return (
    <div className="h-dvh max-dvh bg-black">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="icon"
        className="absolute top-6 left-2 z-10"
      >
        <ArrowLeft className="size-6" />
      </Button>
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">{t("gameSetup")}</h1>
        </div>

        <div className="space-y-6">
          <Card
            className="p-0 rounded-3xl"
            onClick={() => setCurrentScreen("players")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-lg">
                      {t("players")}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {gameState.totalPlayers} {t("ready")}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="p-0 rounded-3xl"
            onClick={() => setCurrentScreen("categories")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-lg">
                      {t("categories")}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {getCategoryDisplayText()}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-0 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-lg">
                      Impostors
                    </div>
                    <div className="text-gray-400 text-sm">
                      {gameState.impostorCount} {t("of")}{" "}
                      {gameState.totalPlayers}
                    </div>
                  </div>
                </div>
                <div className="flex items-center w-20">
                  <Select
                    value={gameState.impostorCount.toString()}
                    onValueChange={(value) => setImpostorCount(Number(value))}
                  >
                    <SelectTrigger className="w-full h-10 bg-zinc-800/50 border-zinc-700 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {Array.from(
                        { length: gameState.totalPlayers - 1 },
                        (_, i) => i + 1
                      ).map((num) => (
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

          <Card className="p-0 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-lg">
                      {t("hints")}
                    </div>
                    <div className="text-gray-400 text-sm">
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
              className="w-full h-16 text-lg font-semibold bg-white text-black hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 rounded-2xl"
            >
              <Play className="w-6 h-6 mr-3" />
              {isStarting ? t("generateWords") : t("startGame")}
            </Button>

            {!canStartGame && gameState.selectedCategories.length === 0 && (
              <p className="text-red-400 text-sm text-center mt-3">
                {t("selectCategory")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
