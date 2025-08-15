import { Locale } from "../config/language";
import { db } from "./storage";
import { FALLBACK_WORDS_WITH_HINTS } from "@/src/data/fallbackwords";
import { Difficulty, WordWithHints } from "@/src/types/game";

export async function getRandomWordWithHints(
  category: string,
  language: Locale,
  difficulty: Difficulty = "medium",
): Promise<WordWithHints> {
  try {
    const cached = await db.wordSets
      .where(["category", "language"])
      .equals([category.toLowerCase(), language])
      .first();

    if (cached && cached.wordsWithHints.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * cached.wordsWithHints.length,
      );
      const selectedWord = cached.wordsWithHints[randomIndex];
      const remainingWords = cached.wordsWithHints.filter(
        (_, index) => index !== randomIndex,
      );

      // Remove the selected word from the cache
      if (remainingWords.length > 0) {
        await db.wordSets.update(cached.id, {
          wordsWithHints: remainingWords,
          usageCount: (cached.usageCount || 0) + 1,
        });
      } else {
        await db.wordSets.delete(cached.id);
      }

      return selectedWord;
    }
    const response = await fetch("/api/generate-words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, language, count: 15, difficulty }),
    });

    if (response.ok) {
      const data = await response.json();
      const randomIndex = Math.floor(
        Math.random() * data.wordsWithHints.length,
      );
      const selectedWord = data.wordsWithHints[randomIndex];
      const remainingWords: WordWithHints[] = data.wordsWithHints.filter(
        (_: WordWithHints, index: number) => index !== randomIndex,
      );
      if (remainingWords.length > 0) {
        await db.wordSets.add({
          id: `${category.toLowerCase()}-${language}-${Date.now()}`,
          category: category.toLowerCase(),
          wordsWithHints: remainingWords,
          language,
          createdAt: new Date(),
          usageCount: 1,
        });
      }

      return selectedWord;
    }
  } catch (error) {
    console.error("Error loading words:", error);
  }

  const categoryKey =
    category.toLowerCase() as keyof (typeof FALLBACK_WORDS_WITH_HINTS)[typeof language];
  const fallbackWords = FALLBACK_WORDS_WITH_HINTS[language]?.[categoryKey];

  if (fallbackWords && fallbackWords.length > 0) {
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  }

  throw new Error(
    `No words available for category "${category}" in language "${language}"`,
  );
}
