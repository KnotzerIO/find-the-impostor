import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRandomWordWithHints } from "@/lib/word-service";
import type { GameState, Locale, Player } from "@/types/game";

interface GameStore {
  gameState: GameState;
  playerNames: string[];
  customCategories: string[];

  setPlayerCount: (count: number, t: (key: string) => string) => void;
  setPlayerName: (index: number, name: string) => void;
  setImpostorCount: (count: number) => void;
  setLanguage: (language: Locale) => void;
  toggleCategory: (category: string) => void;
  addCustomCategory: (category: string) => void;
  setCustomCategory: (category: string) => void;
  toggleHints: () => void;

  startGame: (t: (key: string) => string) => Promise<void>;
  nextRevealPlayer: () => void;
  startDiscussion: () => void;
  endGame: () => void;
  newGame: () => void;
  setPhase: (phase: GameState["phase"]) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: {
        phase: "setup",
        players: [],
        totalPlayers: 3,
        impostorCount: 1,
        currentWord: "",
        currentHints: [],
        currentCategory: "",
        selectedCategories: [],
        customCategory: "",
        language: "de",
        showHintsToImpostors: true,
        currentRevealIndex: 0,
        gameStarted: false,
      },

      playerNames: [],
      customCategories: [],

      setPlayerCount: (count, t) => {
        set((state) => {
          const newPlayerNames = Array.from(
            { length: count },
            (_, i) => state.playerNames[i] || `${t("player")} ${i + 1}`
          );

          return {
            gameState: {
              ...state.gameState,
              totalPlayers: count,
              impostorCount: Math.min(
                state.gameState.impostorCount,
                Math.floor(count / 3)
              ),
            },
            playerNames: newPlayerNames,
          };
        });
      },

      setPlayerName: (index, name) => {
        set((state) => {
          const updatedNames = [...state.playerNames];
          updatedNames[index] = name;
          return { playerNames: updatedNames };
        });
      },

      setImpostorCount: (count) => {
        set((state) => ({
          gameState: { ...state.gameState, impostorCount: count },
        }));
      },

      setLanguage: (language) => {
        set((state) => ({
          gameState: { ...state.gameState, language },
        }));
      },

      toggleCategory: (category) => {
        set((state) => {
          const selected = state.gameState.selectedCategories;
          const newSelected = selected.includes(category)
            ? selected.filter((c) => c !== category)
            : [...selected, category];

          return {
            gameState: { ...state.gameState, selectedCategories: newSelected },
          };
        });
      },

      addCustomCategory: (category) => {
        if (!category.trim()) return;

        set((state) => {
          const newCustomCategories = [...state.customCategories];
          if (!newCustomCategories.includes(category)) {
            newCustomCategories.push(category);
          }

          return {
            customCategories: newCustomCategories,
            gameState: {
              ...state.gameState,
              selectedCategories: [
                ...state.gameState.selectedCategories,
                category,
              ],
              customCategory: "",
            },
          };
        });
      },

      setCustomCategory: (category) => {
        set((state) => ({
          gameState: { ...state.gameState, customCategory: category },
        }));
      },

      toggleHints: () => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            showHintsToImpostors: !state.gameState.showHintsToImpostors,
          },
        }));
      },

      setPhase: (phase) => {
        set((state) => ({
          gameState: { ...state.gameState, phase },
        }));
      },

      startGame: async (t: (key: string) => string) => {
        const { gameState, playerNames } = get();

        if (gameState.selectedCategories.length === 0) {
          alert("Bitte wähle mindestens eine Kategorie aus");
          return;
        }

        const players: Player[] = Array.from(
          { length: gameState.totalPlayers },
          (_, i) => ({
            id: i + 1,
            name: playerNames[i] || `${t("player")} ${i + 1}`,
            role: "player",
          })
        );

        const shuffledIndexes = Array.from(
          { length: gameState.totalPlayers },
          (_, i) => i
        ).sort(() => Math.random() - 0.5);

        for (let i = 0; i < gameState.impostorCount; i++) {
          players[shuffledIndexes[i]].role = "impostor";
        }

        const randomCategory =
          gameState.selectedCategories[
            Math.floor(Math.random() * gameState.selectedCategories.length)
          ];
        const wordWithHints = await getRandomWordWithHints(
          randomCategory,
          gameState.language
        );

        console.log(
          `Starting game with category: ${randomCategory}, word: ${
            wordWithHints.word
          }, hints: ${wordWithHints.hints.join(", ")}`
        );
        set((state) => ({
          gameState: {
            ...state.gameState,
            phase: "wordreveal",
            gameStarted: true,
            players,
            currentWord: wordWithHints.word,
            currentHints: wordWithHints.hints,
            currentCategory: randomCategory,
            currentRevealIndex: 0,
          },
        }));
      },

      nextRevealPlayer: () => {
        set((state) => {
          const nextIndex = state.gameState.currentRevealIndex + 1;
          return {
            gameState: {
              ...state.gameState,
              currentRevealIndex: nextIndex,
            },
          };
        });
      },

      startDiscussion: () => {
        set((state) => ({
          gameState: { ...state.gameState, phase: "discussion" },
        }));
      },

      endGame: () => {
        set((state) => ({
          gameState: { ...state.gameState, phase: "results" },
        }));
      },

      newGame: () => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            phase: "setup",
            gameStarted: false,
            currentRevealIndex: 0,
            players: [],
            currentWord: "",
            currentHints: [],
            currentCategory: "",
          },
        }));
      },
    }),
    {
      name: "party-game-storage",
      partialize: (state) => ({
        customCategories: state.customCategories,
        playerNames: state.playerNames,
        gameState: {
          totalPlayers: state.gameState.totalPlayers,
          impostorCount: state.gameState.impostorCount,
          language: state.gameState.language,
          selectedCategories: state.gameState.selectedCategories,
          showHintsToImpostors: state.gameState.showHintsToImpostors,
        },
      }),
    }
  )
);
