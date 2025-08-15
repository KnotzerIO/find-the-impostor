import { Locale } from "../config/language";
import { getRandomWordWithHints } from "@/src/lib/word-service";
import type {
  Difficulty,
  GameState,
  Player,
  TranslationFunction,
} from "@/src/types/game";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameStore {
  gameState: GameState;
  playerNames: string[];
  customCategories: string[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  setPlayerCount: (count: number, t: TranslationFunction) => void;
  setPlayerName: (index: number, name: string) => void;
  setImpostorCount: (count: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  toggleCategory: (category: string) => void;
  addCustomCategory: (category: string) => void;
  setCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
  toggleHints: () => void;

  startGame: (t: TranslationFunction, language: Locale) => Promise<void>;
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
        selectedCategories: ["animals", "food", "movies"],
        customCategory: "",
        difficulty: "medium",
        showHintsToImpostors: true,
        currentRevealIndex: 0,
        gameStarted: false,
      },

      playerNames: [],
      customCategories: [],
      _hasHydrated: false,
      setHasHydrated: state => set({ _hasHydrated: state }),
      setPlayerCount: (count, t) => {
        set(state => {
          const newPlayerNames = Array.from(
            { length: count },
            (_, i) => state.playerNames[i] || `${t("player")} ${i + 1}`,
          );

          return {
            gameState: {
              ...state.gameState,
              totalPlayers: count,
              impostorCount: Math.min(
                state.gameState.impostorCount,
                Math.floor(count / 3),
              ),
            },
            playerNames: newPlayerNames,
          };
        });
      },

      setPlayerName: (index, name) => {
        set(state => {
          const updatedNames = [...state.playerNames];
          updatedNames[index] = name;
          return { playerNames: updatedNames };
        });
      },

      setImpostorCount: count => {
        set(state => ({
          gameState: { ...state.gameState, impostorCount: count },
        }));
      },

      setDifficulty: difficulty => {
        set(state => ({
          gameState: { ...state.gameState, difficulty },
        }));
      },

      toggleCategory: category => {
        set(state => {
          const selected = state.gameState.selectedCategories;
          const newSelected = selected.includes(category)
            ? selected.filter(c => c !== category)
            : [...selected, category];

          return {
            gameState: { ...state.gameState, selectedCategories: newSelected },
          };
        });
      },

      addCustomCategory: category => {
        if (!category.trim()) return;

        set(state => {
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

      removeCustomCategory: category => {
        set(state => {
          const newCustomCategories = state.customCategories.filter(
            c => c !== category,
          );
          const newSelectedCategories =
            state.gameState.selectedCategories.filter(c => c !== category);

          return {
            customCategories: newCustomCategories,
            gameState: {
              ...state.gameState,
              selectedCategories: newSelectedCategories,
            },
          };
        });
      },

      setCustomCategory: category => {
        set(state => ({
          gameState: { ...state.gameState, customCategory: category },
        }));
      },

      toggleHints: () => {
        set(state => ({
          gameState: {
            ...state.gameState,
            showHintsToImpostors: !state.gameState.showHintsToImpostors,
          },
        }));
      },

      setPhase: phase => {
        set(state => ({
          gameState: { ...state.gameState, phase },
        }));
      },

      startGame: async (t: TranslationFunction, language: Locale) => {
        const { gameState, playerNames } = get();

        if (gameState.selectedCategories.length === 0) {
          console.error("No categories selected");
          return;
        }

        const players: Player[] = Array.from(
          { length: gameState.totalPlayers },
          (_, i) => ({
            id: i + 1,
            name: playerNames[i] || `${t("player")} ${i + 1}`,
            role: "player",
          }),
        );

        const shuffledIndexes = Array.from(
          { length: gameState.totalPlayers },
          (_, i) => i,
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
          language,
          gameState.difficulty,
        );

        console.log(
          `Starting game with category: ${randomCategory}, word: ${
            wordWithHints.word
          }, hints: ${wordWithHints.hints.join(", ")}`,
        );
        set(state => ({
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
        set(state => {
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
        set(state => ({
          gameState: { ...state.gameState, phase: "discussion" },
        }));
      },

      endGame: () => {
        set(state => ({
          gameState: { ...state.gameState, phase: "results" },
        }));
      },

      newGame: () => {
        set(state => ({
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
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<GameStore>;
        if (version === 0) {
          return {
            ...state,
            gameState: {
              ...state.gameState,
              difficulty: "medium",
            },
          };
        }
        return state;
      },
      partialize: state => ({
        customCategories: state.customCategories,
        playerNames: state.playerNames,
        gameState: {
          totalPlayers: state.gameState.totalPlayers,
          impostorCount: state.gameState.impostorCount,

          difficulty: state.gameState.difficulty,
          selectedCategories: state.gameState.selectedCategories,
          showHintsToImpostors: state.gameState.showHintsToImpostors,
        },
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
