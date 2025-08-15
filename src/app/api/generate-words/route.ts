/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locale } from "@/src/config/language";
import { openAIService } from "@/src/lib/openai-service";
import { PromptEngine } from "@/src/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

interface RateLimitTier {
  windowMs: number;
  maxRequests: number;
  description: string;
}

const RATE_LIMIT_TIERS: Record<string, RateLimitTier> = {
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 2, // 2 requests per minute
    description: "Standard rate limit",
  },
  burst: {
    windowMs: 10 * 1000, // 10 seconds
    maxRequests: 1, // Max 1 requests in 10 seconds
    description: "Burst protection",
  },
  hourly: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 requests per hour
    description: "Hourly limit",
  },
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cloudflareIP = request.headers.get("cf-connecting-ip");

  return cloudflareIP || realIP || forwarded?.split(",")[0] || "unknown";
}

function validateInput(body: any): {
  isValid: boolean;
  error?: string;
  data?: any;
} {
  const { category, language, count, difficulty } = body;

  if (!category || typeof category !== "string") {
    return {
      isValid: false,
      error: "Category is required and must be a string",
    };
  }

  if (!language) {
    return { isValid: false, error: "Language is required" };
  }

  if (!count || typeof count !== "number" || count < 1 || count > 15) {
    return { isValid: false, error: "Count must be a number between 1 and 15" };
  }

  if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
    return {
      isValid: false,
      error: 'Difficulty must be "easy", "medium", or "hard"',
    };
  }

  const sanitizedCategory = category.toLowerCase().trim();
  if (sanitizedCategory.length > 50) {
    return {
      isValid: false,
      error: "Category name too long (max 50 characters)",
    };
  }

  return {
    isValid: true,
    data: {
      category: sanitizedCategory,
      language: language as Locale,
      count: Math.min(count, 15),
      difficulty: difficulty || "medium",
    },
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    // Multi-tier rate limiting
    //! NOTE: Implement Redis or similar for distributed rate limiting
    for (const [tierName, tier] of Object.entries(RATE_LIMIT_TIERS)) {
      if (
        !openAIService.checkRateLimit(
          `${clientIP}:${tierName}`,
          tier.windowMs,
          tier.maxRequests,
        )
      ) {
        console.warn(
          `Rate limit exceeded for ${clientIP} on ${tier.description}`,
        );
        return NextResponse.json(
          {
            error: `Rate limit exceeded: ${tier.description}. Please try again later.`,
            retryAfter: Math.ceil(tier.windowMs / 1000),
          },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil(tier.windowMs / 1000).toString(),
              "X-RateLimit-Limit": tier.maxRequests.toString(),
              "X-RateLimit-Window": tier.windowMs.toString(),
            },
          },
        );
      }
    }

    // Validate and sanitize input
    const body = await request.json();
    const validation = validateInput(body);

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { category, language, count, difficulty } = validation.data!;

    const prompt = PromptEngine.createPrompt({
      category,
      language,
      count,
      difficulty,
      culturalContext: "universal",
    });

    console.log(
      `Generating ${count} words for category "${category}" in ${language} (${difficulty} difficulty) for IP: ${clientIP.substring(
        0,
        8,
      )}...`,
    );

    const result = await openAIService.generateWords(prompt, {});

    if (!PromptEngine.validateResponse(result, count)) {
      throw new Error(
        "Generated response does not match expected format or count",
      );
    }

    const wordsWithHints = result.wordsWithHints;
    const validWords = wordsWithHints.filter((item: any) => {
      const word = item.word.toLowerCase().trim();
      const hints = item.hints;

      const wordInHints = hints.some(
        (hint: string) =>
          hint.toLowerCase().includes(word) ||
          word.includes(hint.toLowerCase()),
      );

      return !wordInHints && word.length > 1;
    });

    if (validWords.length < Math.ceil(count * 0.8)) {
      throw new Error("Generated words quality below threshold");
    }

    const responseTime = Date.now() - startTime;

    console.log(
      `Successfully generated ${validWords.length}/${count} words in ${responseTime}ms for ${category}:${language}`,
    );

    return NextResponse.json(
      {
        wordsWithHints: validWords.slice(0, count), // Ensure exact count
        metadata: {
          category,
          language,
          difficulty,
          generatedAt: new Date().toISOString(),
          responseTime,
          requestedCount: count,
          actualCount: Math.min(validWords.length, count),
          clientIP: clientIP.substring(0, 8) + "...", // Partial IP for logging
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600", // 30min cache, 1hr stale
          "Content-Type": "application/json",
          "X-Response-Time": responseTime.toString(),
        },
      },
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`Word generation failed for ${clientIP}:`, error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const isAPIError = errorMessage.includes("OpenRouter API error");
    const isRateLimitError = errorMessage.includes("rate limit");

    return NextResponse.json(
      {
        error:
          isAPIError || isRateLimitError
            ? errorMessage
            : "Failed to generate words. Please try again.",
        fallback: true,
        metadata: {
          responseTime,
          timestamp: new Date().toISOString(),
          errorType: isAPIError
            ? "api_error"
            : isRateLimitError
              ? "rate_limit"
              : "generation_error",
        },
      },
      {
        status: isRateLimitError ? 429 : isAPIError ? 502 : 500,
        headers: {
          "X-Response-Time": responseTime.toString(),
        },
      },
    );
  }
}

// Health check endpoint
export async function GET() {
  const stats = openAIService.getUsageStats();

  return NextResponse.json({
    status: "healthy",
    service: "word-generation",
    timestamp: new Date().toISOString(),
    stats,
  });
}
