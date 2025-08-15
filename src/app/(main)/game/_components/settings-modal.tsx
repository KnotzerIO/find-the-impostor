import LanguageSelector from "./language-selector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { setUserLocale } from "@/src/lib/locale";
import { useGameStore } from "@/src/stores/game-store";
import { Difficulty } from "@/src/types/game";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SettingsModal() {
  const { gameState, setDifficulty } = useGameStore();
  const t = useTranslations("SetupPhase");

  const difficulties = [
    { value: "easy", label: t("easy") },
    { value: "medium", label: t("medium") },
    { value: "hard", label: t("hard") },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 right-2 z-10"
        >
          <Settings className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Label className="text-lg font-semibold text-white">
            {t("language")}
          </Label>
          <LanguageSelector
            triggerClassName="h-14 rounded-2xl"
            onLanguageChange={locale => setUserLocale(locale)}
          />
          <Label className="text-lg font-semibold text-white">
            {t("difficulty")}
          </Label>
          <Select
            value={gameState.difficulty}
            onValueChange={value => setDifficulty(value as Difficulty)}
          >
            <SelectTrigger className="h-14 w-full rounded-2xl border-gray-700 bg-gray-800/50 px-3 py-2 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {difficulties.map(difficulty => (
                <SelectItem
                  key={difficulty.value}
                  value={difficulty.value}
                  className="rounded-xl py-3 text-white"
                >
                  {difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
