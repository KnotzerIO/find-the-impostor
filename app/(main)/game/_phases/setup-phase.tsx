import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGameStore } from "@/store/game-store";
import { Locale } from "@/types/game";
import { Plus, Settings, Tag, User } from "lucide-react";
import { useState } from "react";
import { IconBox } from "../_components/icon-box";
import { useTranslations } from "next-intl";

export default function SetupPhase() {
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
    setCustomCategory,
    toggleHints,
    startGame,
  } = useGameStore();

  const [isStarting, setIsStarting] = useState(false);
  const t = useTranslations("SetupPhase");

  const categoryTranslations = {
    animals: `🐾 ${t("animals")}`,
    food: `🍕 ${t("food")}`,
    objects: `📱 ${t("objects")}`,
    movies: `🎬 ${t("movies")}`,
    places: `🌍 ${t("places")}`,
    professions: `💼 ${t("professions")}`,
  };

  const allCategories = [
    ...["animals", "food", "objects", "movies", "places", "professions"],
    ...customCategories,
  ];

  const languages = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "de", label: "Deutsch", flag: "🇦🇹" },
  ];

  const handleLanguageChange = (language: string) => {
    setLanguage(language as Locale);

    if (typeof window !== "undefined") {
      document.cookie = `locale=${language}; path=/; max-age=31536000`; // 1 year
      window.location.reload();
    }
  };

  const handleStartGame = async () => {
    setIsStarting(true);
    await startGame(t);
    setIsStarting(false);
  };

  const handleAddCustomCategory = () => {
    if (gameState.customCategory.trim()) {
      addCustomCategory(gameState.customCategory.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{t("gameSetup")}</h1>
          <p className="text-zinc-400 text-sm">{t("configureSettings")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-medium">
              <IconBox icon={User} color="blue" />
              {t("players")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-zinc-300">
                {t("numberOfPlayers")}
              </Label>
              <Select
                value={gameState.totalPlayers.toString()}
                onValueChange={(value) => setPlayerCount(Number(value), t)}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {Array.from({ length: 8 }, (_, i) => i + 3).map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="text-white focus:bg-zinc-800"
                    >
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-zinc-300">
                {t("playerNames")}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: gameState.totalPlayers }, (_, i) => (
                  <Input
                    key={`player-${gameState.totalPlayers}-${i}`}
                    placeholder={`${t("player")} ${i + 1}`}
                    value={playerNames[i] || ""}
                    onChange={(e) => setPlayerName(i, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-400 transition-colors"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-medium">
              <IconBox icon={Settings} color="purple" />
              {t("gameSettings")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-300">
                  🎭 Impostors
                </Label>
                <Select
                  value={gameState.impostorCount.toString()}
                  onValueChange={(value) => setImpostorCount(Number(value))}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
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
                        className="text-white focus:bg-zinc-800"
                      >
                        {num} Impostor{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-300 flex items-center">
                  🌐 {t("language")}
                </Label>
                <Select
                  value={gameState.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {languages.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        className="text-white focus:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          {lang.flag} {lang.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-zinc-700" />

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hints"
                  checked={gameState.showHintsToImpostors}
                  onCheckedChange={toggleHints}
                  className="border-zinc-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-purple-500"
                />
                <Label
                  htmlFor="hints"
                  className="text-sm font-medium text-zinc-300 cursor-pointer"
                >
                  {t("showHints")}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-medium">
              <IconBox icon={Tag} color="green" /> {t("categories")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <Checkbox
                    checked={gameState.selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="border-zinc-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Label className="text-sm font-medium text-zinc-300 capitalize cursor-pointer">
                    {categoryTranslations[
                      category as keyof typeof categoryTranslations
                    ] || `🏷️ ${category}`}
                  </Label>
                </div>
              ))}
            </div>

            <Separator className="bg-zinc-700" />

            <div className="space-y-3">
              <Label className="text-sm font-medium text-zinc-300">
                {t("addCustomCategory")}
              </Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter custom category..."
                  value={gameState.customCategory || ""}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddCustomCategory()
                  }
                  className="flex-1 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-green-400 transition-colors"
                />
                <Button
                  onClick={handleAddCustomCategory}
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {gameState.selectedCategories.length === 0 && (
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30">
                <p className="text-red-400 text-sm">
                  Please select at least one category
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={handleStartGame}
          disabled={isStarting || gameState.selectedCategories.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200 disabled:bg-zinc-700 disabled:cursor-not-allowed"
        >
          {isStarting ? "Starting Game..." : "Start Game"}
        </Button>
      </div>
    </div>
  );
}
