/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Plus, X } from "lucide-react";

interface MobileCategorySelectionProps {
  onBack: () => void;
  gameState: any;
  customCategories: string[];
  toggleCategory: (category: string) => void;
  addCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
  setCustomCategory: (category: string) => void;
  t: any;
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
    ...defaultCategories.map((cat) => ({ ...cat, isCustom: false })),
    ...customCategories.map((cat) => ({
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
    <div className="min-h-dvh bg-black">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute top-6 left-2 z-10"
      >
        <ArrowLeft className="size-6" />
      </Button>
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">{t("categories")}</h1>
        </div>
        <div className="space-y-4">
          {/* All Categories */}
          {allCategories.map((category) => (
            <div key={category.id}>
              <Card
                className={`p-0 rounded-3xl ${
                  gameState.selectedCategories.includes(category.id)
                    ? category.isCustom
                      ? "bg-purple-500/20 border-purple-500/50"
                      : "bg-blue-500/20 border-blue-500/50"
                    : "bg-gray-900/50 border-gray-700 hover:bg-gray-800/60"
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{category.emoji}</div>
                    <div className="flex-1">
                      <div
                        className={`font-semibold text-lg ${
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
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            category.isCustom ? "bg-purple-500" : "bg-blue-500"
                          }`}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {category.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomCategory(category.id);
                          }}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
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
              <Card className="p-0 rounded-3xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-1">
                    <Input
                      placeholder={t("customCategoryPlaceholder")}
                      value={gameState.customCategory || ""}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCustomCategory();
                        if (e.key === "Escape") {
                          setShowAddCustom(false);
                        }
                      }}
                      className="flex-1 h-10 bg-transparent text-white ocus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={handleAddCustomCategory}
                        disabled={!gameState.customCategory}
                        size="icon"
                        className="size-8 text-green-400 hover:bg-green-500/10 rounded-xl"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowAddCustom(false);
                        }}
                        className="size-8 text-gray-400 hover:bg-gray-500/10 rounded-xl"
                      >
                        <X className="w-3 h-3" />
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
              className="w-full h-14 text-lg font-medium rounded-2xl bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/60"
            >
              <Plus className="w-5 h-5 mr-3" />
              {t("addCustomCategory") || "Add Custom"}
            </Button>
          )}

          <div className="pt-4">
            <Button
              onClick={onBack}
              disabled={gameState.selectedCategories.length === 0}
              className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 rounded-2xl"
            >
              {t("done") || "Done"} ({gameState.selectedCategories.length})
            </Button>
          </div>

          {gameState.selectedCategories.length === 0 && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30">
              <p className="text-red-400 text-sm text-center">
                {t("selectCategory")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
