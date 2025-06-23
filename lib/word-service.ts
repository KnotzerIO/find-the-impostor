import { Locale } from "@/types/game";
import { db } from "./storage";

export interface WordWithHints {
  word: string;
  hints: string[];
}

const FALLBACK_WORDS_WITH_HINTS = {
  en: {
    animals: [
      { word: "elephant", hints: ["large", "gray", "trunk", "africa"] },
      { word: "cat", hints: ["pet", "meow", "furry", "whiskers"] },
      { word: "lion", hints: ["mane", "roar", "king", "safari"] },
      { word: "dolphin", hints: ["smart", "ocean", "playful", "jump"] },
      { word: "tiger", hints: ["stripes", "orange", "fierce", "jungle"] },
      { word: "rabbit", hints: ["hop", "ears", "carrot", "soft"] },
      { word: "wolf", hints: ["pack", "howl", "forest", "wild"] },
      { word: "bear", hints: ["honey", "cave", "strong", "sleep"] },
    ],
    food: [
      { word: "pizza", hints: ["round", "cheese", "italian", "slice"] },
      { word: "sushi", hints: ["raw", "rice", "japanese", "roll"] },
      { word: "burger", hints: ["bun", "meat", "american", "fast"] },
      { word: "pasta", hints: ["noodles", "sauce", "italian", "fork"] },
      { word: "chocolate", hints: ["sweet", "brown", "cocoa", "dessert"] },
      { word: "apple", hints: ["red", "fruit", "tree", "crisp"] },
      { word: "cake", hints: ["sweet", "birthday", "layers", "frosting"] },
      { word: "soup", hints: ["liquid", "warm", "spoon", "bowl"] },
    ],
    objects: [
      { word: "chair", hints: ["sit", "legs", "furniture", "wood"] },
      { word: "lamp", hints: ["light", "bright", "switch", "shade"] },
      { word: "book", hints: ["pages", "read", "story", "paper"] },
      { word: "phone", hints: ["call", "screen", "pocket", "ring"] },
      { word: "car", hints: ["drive", "wheels", "engine", "road"] },
      { word: "computer", hints: ["screen", "keyboard", "digital", "work"] },
      { word: "clock", hints: ["time", "tick", "numbers", "wall"] },
      { word: "mirror", hints: ["reflect", "glass", "image", "see"] },
    ],
  },
  de: {
    animals: [
      { word: "elefant", hints: ["groß", "grau", "rüssel", "afrika"] },
      { word: "katze", hints: ["haustier", "miau", "pelzig", "schnurren"] },
      { word: "löwe", hints: ["mähne", "brüllen", "könig", "safari"] },
      { word: "delfin", hints: ["klug", "ozean", "verspielt", "springen"] },
      { word: "tiger", hints: ["streifen", "orange", "wild", "dschungel"] },
      { word: "hase", hints: ["hüpfen", "ohren", "karotte", "weich"] },
      { word: "wolf", hints: ["rudel", "heulen", "wald", "wild"] },
      { word: "bär", hints: ["honig", "höhle", "stark", "schlafen"] },
    ],
    food: [
      { word: "pizza", hints: ["rund", "käse", "italienisch", "stück"] },
      { word: "sushi", hints: ["roh", "reis", "japanisch", "rolle"] },
      {
        word: "burger",
        hints: ["brötchen", "fleisch", "amerikanisch", "schnell"],
      },
      { word: "nudeln", hints: ["teig", "soße", "italienisch", "gabel"] },
      { word: "schokolade", hints: ["süß", "braun", "kakao", "nachtisch"] },
      { word: "apfel", hints: ["rot", "frucht", "baum", "knackig"] },
      { word: "kuchen", hints: ["süß", "geburtstag", "schichten", "glasur"] },
      { word: "suppe", hints: ["flüssig", "warm", "löffel", "schüssel"] },
    ],
    objects: [
      { word: "stuhl", hints: ["sitzen", "beine", "möbel", "holz"] },
      { word: "lampe", hints: ["licht", "hell", "schalter", "schirm"] },
      { word: "buch", hints: ["seiten", "lesen", "geschichte", "papier"] },
      {
        word: "telefon",
        hints: ["anrufen", "bildschirm", "tasche", "klingeln"],
      },
      { word: "auto", hints: ["fahren", "räder", "motor", "straße"] },
      {
        word: "computer",
        hints: ["bildschirm", "tastatur", "digital", "arbeit"],
      },
      { word: "uhr", hints: ["zeit", "ticken", "zahlen", "wand"] },
      { word: "spiegel", hints: ["spiegeln", "glas", "bild", "sehen"] },
    ],
  },
};

export async function getRandomWordWithHints(
  category: string,
  language: Locale
): Promise<WordWithHints> {
  try {
    // Cache prüfen
    const cached = await db.wordSets
      .where(["category", "language"])
      .equals([category.toLowerCase(), language])
      .first();

    if (cached && cached.wordsWithHints.length > 0) {
      return cached.wordsWithHints[
        Math.floor(Math.random() * cached.wordsWithHints.length)
      ];
    }

    // AI API versuchen
    const response = await fetch("/api/generate-words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, language, count: 15 }),
    });

    if (response.ok) {
      const data = await response.json();

      await db.wordSets.add({
        id: `${category.toLowerCase()}-${language}-${Date.now()}`,
        category: category.toLowerCase(),
        wordsWithHints: data.wordsWithHints,
        language,
        createdAt: new Date(),
        usageCount: 1,
      });

      return data.wordsWithHints[
        Math.floor(Math.random() * data.wordsWithHints.length)
      ];
    }
  } catch (error) {
    console.error("Fehler beim Wörter laden:", error);
  }

  const categoryKey =
    category.toLowerCase() as keyof (typeof FALLBACK_WORDS_WITH_HINTS)[typeof language];
  const fallbackWords = FALLBACK_WORDS_WITH_HINTS[language]?.[categoryKey];

  if (fallbackWords && fallbackWords.length > 0) {
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  }

  return {
    word: language === "en" ? "mystery" : "geheimnis",
    hints:
      language === "en"
        ? ["unknown", "hidden", "secret"]
        : ["unbekannt", "versteckt", "geheim"],
  };
}
