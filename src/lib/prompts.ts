/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locale } from "../config/language";

export interface PromptConfig {
  category: string;
  language: Locale;
  count: number;
  difficulty?: "easy" | "medium" | "hard";
  culturalContext?: "universal" | "local";
}

export class PromptEngine {
  private static readonly LANGUAGE_CONFIGS = {
    en: {
      name: "English",
      culturalNote:
        "Focus on universally known terms in English-speaking countries.",
      examples: {
        animals: {
          word: "elephant",
          hints: ["memory", "circus", "large"],
        },
        food: {
          word: "pizza",
          hints: ["delivery", "triangle", "teenage"],
        },
        objects: {
          word: "hammer",
          hints: ["judge", "thunder", "construction"],
        },
        places: {
          word: "library",
          hints: ["silence", "overdue", "research"],
        },
        professions: {
          word: "chef",
          hints: ["temperature", "creativity", "white"],
        },
      },
    },
    de: {
      name: "German",
      culturalNote:
        "Fokussiere auf universell bekannte Begriffe im deutschsprachigen Raum.",
      examples: {
        animals: {
          word: "Elefant",
          hints: ["Gedächtnis", "Zirkus", "Groß"],
        },
        food: {
          word: "Pizza",
          hints: ["Lieferung", "Dreieck", "Jugendlicher"],
        },
        objects: {
          word: "Hammer",
          hints: ["Richter", "Donner", "Bauen"],
        },
        places: {
          word: "Bibliothek",
          hints: ["Stille", "Überfällig", "Forschung"],
        },
        professions: {
          word: "Koch",
          hints: ["Temperatur", "Kreativität", "Weiß"],
        },
      },
    },
  };

  private static readonly DIFFICULTY_MODIFIERS = {
    easy: "Choose very common, everyday words that most people would recognize immediately.",
    medium:
      "Choose moderately common words that require some thinking but are still well-known.",
    hard: "Choose less common but still recognizable words that provide a good challenge.",
  };

  private static readonly CATEGORY_CONTEXTS = {
    animals:
      "Include domestic, wild, and exotic animals. Mix common pets with wildlife.",
    food: "Include dishes, ingredients, cooking methods, and food items from various cuisines.",
    objects:
      "Include household items, tools, furniture, technology, and everyday objects.",
    places:
      "Include buildings, locations, geographical features, and establishments.",
    professions:
      "Include traditional and modern jobs, skilled trades, and professional roles.",
    movies: "Include popular films, classic movies, and well-known franchises.",
    sports:
      "Include popular sports, equipment, positions, and game terminology.",
    music:
      "Include instruments, genres, musical terms, and performance concepts.",
    nature:
      "Include natural phenomena, landscapes, weather, and environmental features.",
    technology:
      "Include devices, software, digital concepts, and modern innovations.",
  };

  static createPrompt(config: PromptConfig): string {
    const langConfig = PromptEngine.LANGUAGE_CONFIGS[config.language];
    const difficultyMod =
      PromptEngine.DIFFICULTY_MODIFIERS[config.difficulty || "medium"];
    const categoryContext =
      PromptEngine.CATEGORY_CONTEXTS[
        config.category.toLowerCase() as keyof typeof PromptEngine.CATEGORY_CONTEXTS
      ] || null;

    const example =
      langConfig.examples[
        config.category.toLowerCase() as keyof typeof langConfig.examples
      ];
    const exampleJson = example
      ? JSON.stringify({ wordsWithHints: [example] }, null, 2)
      : "";

    return `Generate ${config.count} words for the category "${
      config.category
    }" in ${langConfig.name}.

CATEGORY CONTEXT: ${
      categoryContext || "Generate appropriate words for this category."
    }

DIFFICULTY LEVEL: ${difficultyMod}

CULTURAL CONSIDERATION: ${langConfig.culturalNote}

WORD SELECTION CRITERIA:
- Words must be nouns (things, not actions or descriptions)
- Avoid abbreviations, acronyms, or technical jargon
- Ensure words are spell-able and pronounceable
- Mix different subcategories within the main category
- Include a variety of word lengths and complexities
- Ensure words are culturally relevant to the specified language
- Avoid overly obscure or niche terms

HINT CRAFTING RULES:
1. Each hint should be 1 word maximum
2. Hints should be indirect associations, not direct descriptors
3. Use broad categories, feelings, or abstract connections
4. Avoid physical descriptions (color, size, shape)
5. Avoid location-specific or functional hints
6. No synonyms, rhymes, or wordplay
7. Think of distant but logical connections

HINT STRATEGY:
- Use emotional or conceptual associations rather than literal descriptions
- Reference broader categories or themes
- Use contextual clues from completely different domains
- Aim for "aha!" moments rather than obvious connections
- Each hint should feel like a puzzle piece, not a direct clue
- Include playful, unexpected, or mildly humorous associations
- Think of pop culture references, internet culture, or amusing situations
- Use ironic or contrasting concepts that create surprise

QUALITY ASSURANCE:
- Each word must have exactly 3 hints
- Hints must be helpful for guessing but not too obvious
- Test mentally: Could someone reasonably guess the word from these hints?
- Ensure variety in word length and complexity within the set

${example ? `EXAMPLE FORMAT:\n${exampleJson}` : ""}

Generate exactly ${
      config.count
    } words following this structure. Respond only with valid JSON in this exact format:

{
  "wordsWithHints": [
    {
      "word": "example",
      "hints": ["hint one", "hint two", "hint three"]
    }
  ]
}`;
  }

  static validateResponse(response: any, expectedCount: number): boolean {
    if (!response?.wordsWithHints || !Array.isArray(response.wordsWithHints)) {
      return false;
    }

    if (response.wordsWithHints.length !== expectedCount) {
      return false;
    }

    return response.wordsWithHints.every(
      (item: any) =>
        typeof item.word === "string" &&
        item.word.trim().length > 0 &&
        Array.isArray(item.hints) &&
        item.hints.length === 3 &&
        item.hints.every(
          (hint: any) => typeof hint === "string" && hint.trim().length > 0,
        ),
    );
  }
}
