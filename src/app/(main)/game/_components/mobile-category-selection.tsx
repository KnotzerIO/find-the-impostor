"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { GameState, TranslationFunction } from "@/src/types/game";
import { ArrowLeft, Check, Plus, X } from "lucide-react";
import { useState } from "react";

interface MobileCategorySelectionProps {
  onBack: () => void;
  gameState: GameState;
  customCategories: string[];
  toggleCategory: (category: string) => void;
  addCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
  setCustomCategory: (category: string) => void;
  t: TranslationFunction;
}

const defaultCategories = [
  { id: "animals", name: "animals", emoji: "🐾" },
  { id: "food", name: "food", emoji: "🍕" },
  { id: "objects", name: "objects", emoji: "📦" },
  { id: "movies", name: "movies", emoji: "🎬" },
  { id: "places", name: "places", emoji: "🌍" },
  { id: "professions", name: "professions", emoji: "💼" },
];

export default function MobileCategorySelection({
  onBack,
  gameState,
  customCategories,
  toggleCategory,
  addCustomCategory,
  removeCustomCategory,
  setCustomCategory,
  t,
}: MobileCategorySelectionProps) {
  const [showAddCustom, setShowAddCustom] = useState(false);

  const allCategories = [
    ...defaultCategories.map(cat => ({ ...cat, isCustom: false })),
    ...customCategories.map(cat => ({
      id: cat,
      name: cat,
      emoji: "🎯",
      isCustom: true,
    })),
  ];

  const handleCategorySelect = (categoryId: string) => {
    toggleCategory(categoryId);
  };

  const handleAddCustomCategory = () => {
    if (gameState.customCategory.trim()) {
      addCustomCategory(gameState.customCategory.trim());

      setShowAddCustom(false);
    }
  };

  const handleRemoveCustomCategory = (categoryId: string) => {
    removeCustomCategory(categoryId);
  };

  return (
    <div className="min-h-dvh">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute top-6 left-2 z-10"
      >
        <ArrowLeft className="size-6" />
      </Button>
      <div className="container mx-auto space-y-8 px-4 py-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">{t("categories")}</h1>
        </div>
        <div className="space-y-4">
          {/* All Categories */}
          {allCategories.map(category => (
            <div key={category.id}>
              <Card
                className={`rounded-3xl p-0 ${
                  gameState.selectedCategories.includes(category.id)
                    ? category.isCustom
                      ? "border-purple-500/50 bg-purple-500/20"
                      : "border-blue-500/50 bg-blue-500/20"
                    : "border-gray-700 bg-gray-900/50 hover:bg-gray-800/60"
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{category.emoji}</div>
                    <div className="flex-1">
                      <div
                        className={`text-lg font-semibold ${
                          gameState.selectedCategories.includes(category.id)
                            ? category.isCustom
                              ? "text-purple-400"
                              : "text-blue-400"
                            : "text-white"
                        }`}
                      >
                        {category.isCustom ? category.name : t(category.name)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {gameState.selectedCategories.includes(category.id) && (
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            category.isCustom ? "bg-purple-500" : "bg-blue-500"
                          }`}
                        >
                          <Check className="size-4 text-white" />
                        </div>
                      )}
                      {category.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveCustomCategory(category.id);
                          }}
                          className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {showAddCustom ? (
            <div>
              <Card className="rounded-3xl p-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-1">
                    <Input
                      placeholder={t("customCategoryPlaceholder")}
                      value={gameState.customCategory || ""}
                      onChange={e => setCustomCategory(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") handleAddCustomCategory();
                        if (e.key === "Escape") {
                          setShowAddCustom(false);
                        }
                      }}
                      onBlur={() => {
                        handleAddCustomCategory();
                        setShowAddCustom(false);
                      }}
                      className="h-10 flex-1 bg-transparent text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={handleAddCustomCategory}
                        disabled={!gameState.customCategory}
                        size="icon"
                        className="size-9 rounded-xl text-green-400 hover:bg-green-500/10"
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowAddCustom(false);
                        }}
                        className="size-9 rounded-xl text-gray-400 hover:bg-gray-500/10"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddCustom(true)}
              variant="outline"
              className="h-14 w-full rounded-2xl border-gray-700 bg-gray-900/50 text-lg font-medium text-white hover:bg-gray-800/60"
            >
              <Plus className="mr-3 h-5 w-5" />
              {t("addCustomCategory") || "Add Custom"}
            </Button>
          )}

          <div className="pt-4">
            <Button
              onClick={onBack}
              disabled={gameState.selectedCategories.length === 0}
              className="h-14 w-full rounded-2xl bg-white text-lg font-semibold text-black hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
            >
              {t("done") || "Done"} ({gameState.selectedCategories.length})
            </Button>
          </div>

          {gameState.selectedCategories.length === 0 && (
            <div className="rounded-xl border border-red-900/30 bg-red-950/20 p-4">
              <p className="text-center text-sm text-red-400">
                {t("selectCategory")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
