export type Locale = "en" | "de";

export type TranslationFunction = (key: string) => string;

export interface Player {
  id: number;
  name: string;
  role: "player" | "impostor";
}

export interface WordWithHints {
  word: string;
  hints: string[];
}

export interface WordSet {
  id: string;
  category: string;
  wordsWithHints: WordWithHints[];
  language: Locale;
  createdAt: Date;
  usageCount?: number;
}

export interface GameState {
  phase: "setup" | "wordreveal" | "discussion" | "results";
  players: Player[];
  totalPlayers: number;
  impostorCount: number;
  currentWord: string;
  currentHints: string[];
  currentCategory: string;
  selectedCategories: string[];
  customCategory: string;
  language: Locale;
  showHintsToImpostors: boolean;
  currentRevealIndex: number;
  gameStarted: boolean;
}
