/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/advanced-prompts.ts
import { Locale } from "@/types/game";

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
          hints: ["large", "grey", "African"],
        },
        food: {
          word: "pizza",
          hints: ["Italian", "round", "cheese"],
        },
        objects: {
          word: "hammer",
          hints: ["tool", "metal", "nails"],
        },
        places: {
          word: "library",
          hints: ["quiet", "book", "borrow"],
        },
        professions: {
          word: "chef",
          hints: ["cut", "white", "Tv show"],
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
          hints: ["Säugetier", "Grau", "Afrika"],
        },
        food: {
          word: "Pizza",
          hints: ["italienisch", "rund", "käse"],
        },
        objects: {
          word: "Hammer",
          hints: ["Werkzeug", "Metall", "Nägel"],
        },
        places: {
          word: "Bibliothek",
          hints: ["ruhig", "bücher", "ausleihen"],
        },
        professions: {
          word: "Koch",
          hints: ["schneiden", "weiß", "Fernsehshow"],
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
    const langConfig = this.LANGUAGE_CONFIGS[config.language];
    const difficultyMod =
      this.DIFFICULTY_MODIFIERS[config.difficulty || "medium"];
    const categoryContext =
      this.CATEGORY_CONTEXTS[
        config.category.toLowerCase() as keyof typeof this.CATEGORY_CONTEXTS
      ];

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
- No offensive or inappropriate content
- Ensure words are spell-able and pronounceable
- Mix different subcategories within the main category

HINT CRAFTING RULES:
1. First hint: Broad category or primary function
2. Second hint: Key characteristic or common association  
3. Third hint: Distinctive feature or specific context
4. Each hint should be 1-4 words maximum
5. Progressive difficulty: general → specific → distinctive
6. Avoid rhymes, wordplay, or linguistic tricks
7. No synonyms or direct translations of the target word

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
          (hint: any) => typeof hint === "string" && hint.trim().length > 0
        )
    );
  }
}
