import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { GameState, Locale, TranslationFunction } from "@/src/types/game";
import { ArrowLeft, Eye, Globe } from "lucide-react";

interface MobileGameSettingsProps {
  onBack: () => void;
  gameState: GameState;
  setImpostorCount: (count: number) => void;
  setLanguage: (language: Locale) => void;
  toggleHints: () => void;
  t: TranslationFunction;
}

export default function MobileGameSettings({
  onBack,
  gameState,
  setImpostorCount,
  setLanguage,
  toggleHints,
  t,
}: MobileGameSettingsProps) {
  const languages = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "de", label: "Deutsch", flag: "🇦🇹" },
  ];

  const handleLanguageChange = (language: string) => {
    setLanguage(language as Locale);

    if (typeof window !== "undefined") {
      document.cookie = `locale=${language}; path=/; max-age=31536000`;
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">{t("gameSettings")}</h1>
        </div>

        <div className="space-y-6">
          {/* Impostors */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                🎭 {t("impostors")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={gameState.impostorCount.toString()}
                onValueChange={(value) => setImpostorCount(Number(value))}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 rounded-xl">
                  {Array.from(
                    { length: gameState.totalPlayers - 1 },
                    (_, i) => i + 1
                  ).map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className="text-white focus:bg-zinc-800 rounded-lg"
                    >
                      {num} Impostor{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                🌐 {t("language")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={gameState.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 rounded-xl">
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="text-white focus:bg-zinc-800 rounded-lg"
                    >
                      <span className="flex items-center gap-2">
                        {lang.flag} {lang.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Hints Toggle */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="hints"
                    checked={gameState.showHintsToImpostors}
                    onCheckedChange={toggleHints}
                    className="border-zinc-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label
                    htmlFor="hints"
                    className="text-white font-medium cursor-pointer"
                  >
                    {t("showHints")}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
