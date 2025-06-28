"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { GameState, TranslationFunction } from "@/src/types/game";
import { ArrowLeft, Users, Plus, X, Edit3, Check } from "lucide-react";
import { useState, useEffect } from "react";

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
          <h1 className="text-3xl font-bold text-white">{t("players")}</h1>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl p-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {localPlayers.length} {t("players")}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {localPlayers.map((player, index) => (
              <div key={index} className="w-full">
                <Card className="rounded-3xl p-0">
                  <CardContent className="p-0">
                    {editingIndex === index ? (
                      <div className="m-4 flex items-center gap-3">
                        <Input
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          onBlur={saveEdit}
                          className="ocus-visible:outline-none h-10 flex-1 bg-transparent text-white focus-visible:ring-2 focus-visible:ring-blue-500"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onMouseDown={e => e.preventDefault()} // Prevents input blur on mousedown - ensures onClick executes before onBlur triggers saveEdit
                            onClick={saveEdit}
                            className="size-9 rounded-xl text-green-400 hover:bg-green-500/10"
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onMouseDown={e => e.preventDefault()} // Prevents input blur on mousedown - ensures onClick executes before onBlur triggers saveEdit
                            onClick={cancelEdit}
                            className="size-9 rounded-xl text-gray-400 hover:bg-gray-500/10"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between px-4 py-5"
                        onClick={() => startEditing(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>

                          <span className="font-medium text-white">
                            {player}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          {index >= 3 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePlayer(index)}
                              className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-500/10"
                            >
                              <X className="size-4" />
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
                <Card className="rounded-3xl p-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-1">
                      <Input
                        placeholder={t("player")}
                        value={newPlayerName}
                        onChange={e => setNewPlayerName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") addPlayer();
                          if (e.key === "Escape") {
                            setShowAddInput(false);
                            setNewPlayerName("");
                          }
                        }}
                        className="ocus-visible:outline-none h-10 flex-1 bg-transparent text-white focus-visible:ring-2 focus-visible:ring-blue-500"
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
                          className="size-9 rounded-xl text-green-400 hover:bg-green-500/10"
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowAddInput(false);
                            setNewPlayerName("");
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
                onClick={() => setShowAddInput(true)}
                disabled={localPlayers.length >= 10}
                className="h-14 w-full bg-white text-lg font-semibold text-black hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
              >
                <Plus className="mr-3 h-5 w-5" />
                {t("addPlayer") || "Add Player"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
