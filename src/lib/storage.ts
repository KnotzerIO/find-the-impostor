import { WordWithHints } from "@/src/types/game";
import Dexie, { Table } from "dexie";

export interface WordSet {
  id?: string;
  category: string;
  language: string;
  wordsWithHints: WordWithHints[];
  createdAt: Date;
  usageCount?: number;
}

export class GameDatabase extends Dexie {
  wordSets!: Table<WordSet>;

  constructor() {
    super("FindTheImpostorDB");

    this.version(1).stores({
      wordSets: "++id, category, language, createdAt, [category+language]",
    });
  }
}

export const db = new GameDatabase();
