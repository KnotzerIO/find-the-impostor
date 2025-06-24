"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Plus, X, Edit3, Check } from "lucide-react";
import { GameState, TranslationFunction } from "@/types/game";

interface MobilePlayerManagementProps {
  onBack: () => void;
  gameState: GameState;
  playerNames: string[];
  setPlayerCount: (count: number, t: TranslationFunction) => void;
  setPlayerName: (index: number, name: string) => void;
  t: TranslationFunction;
}

export default function MobilePlayerManagement({
  onBack,
  gameState,
  playerNames,
  setPlayerCount,
  setPlayerName,
  t,
}: MobilePlayerManagementProps) {
  const [localPlayers, setLocalPlayers] = useState<string[]>(() => {
    const players = [];
    for (let i = 0; i < gameState.totalPlayers; i++) {
      players.push(playerNames[i] || `${t("player")} ${i + 1}`);
    }
    return players;
  });
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  // Auto-save changes
  useEffect(() => {
    setPlayerCount(localPlayers.length, t);
    localPlayers.forEach((name, index) => {
      setPlayerName(index, name);
    });
  }, [localPlayers, setPlayerCount, setPlayerName, t]);

  const addPlayer = () => {
    if (newPlayerName.trim() && localPlayers.length < 10) {
      setLocalPlayers([...localPlayers, newPlayerName.trim()]);
      setNewPlayerName("");
      setShowAddInput(false);
    }
  };

  const removePlayer = (index: number) => {
    if (index < 3) return;
    setLocalPlayers(localPlayers.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingName(localPlayers[index]);
  };

  const saveEdit = () => {
    if (editingName.trim() && editingIndex !== null) {
      const updatedPlayers = [...localPlayers];
      updatedPlayers[editingIndex] = editingName.trim();
      setLocalPlayers(updatedPlayers);
    }
    setEditingIndex(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingName("");
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
          <h1 className="text-3xl font-bold text-white">{t("players")}</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-0 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {localPlayers.length} {t("players")}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {localPlayers.map((player, index) => (
              <div key={index} className="w-full">
                <Card className="p-0 rounded-3xl">
                  <CardContent className="p-4">
                    {editingIndex === index ? (
                      <div className="flex items-center gap-3">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="flex-1 h-10 bg-transparent text-white ocus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={saveEdit}
                            className="size-8 text-green-400 hover:bg-green-500/10 rounded-xl"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                            className="size-8 text-gray-400 hover:bg-gray-500/10 rounded-xl"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                          <span className="font-medium text-white">
                            {player}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(index)}
                            className="h-8 w-8 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          {index >= 3 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePlayer(index)}
                              className="h-8 w-8 text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div>
            {showAddInput ? (
              <div>
                <Card className="p-0 rounded-3xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-1">
                      <Input
                        placeholder={t("player")}
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addPlayer();
                          if (e.key === "Escape") {
                            setShowAddInput(false);
                            setNewPlayerName("");
                          }
                        }}
                        className="flex-1 h-10 bg-transparent text-white ocus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={addPlayer}
                          disabled={
                            !newPlayerName.trim() || localPlayers.length >= 10
                          }
                          className="size-8 text-green-400 hover:bg-green-500/10 rounded-xl"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowAddInput(false);
                            setNewPlayerName("");
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
                onClick={() => setShowAddInput(true)}
                disabled={localPlayers.length >= 10}
                className="w-full h-14 text-lg font-semibold bg-white text-black hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-3" />
                {t("addPlayer") || "Add Player"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
