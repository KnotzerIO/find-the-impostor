import { Locale, WordWithHints } from "@/types/game";
import { db } from "./storage";
import { FALLBACK_WORDS_WITH_HINTS } from "@/data/fallbackwords";

/**
 * Retrieves a random word with associated hints for a given category and language.
 *
 * Attempts to return a word with hints from a local cache, generating and caching new words via an API if necessary. Falls back to predefined or default words if no data is available.
 *
 * @param category - The category to select a word from
 * @param language - The language of the word and hints
 * @returns A randomly selected word with hints relevant to the specified category and language
 */
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
