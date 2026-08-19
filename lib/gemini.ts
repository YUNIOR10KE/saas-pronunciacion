import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRONUNCIATION_PROMPT } from "./prompts";
import type { TranslationResult } from "./types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Simple in-memory LRU cache to serve repeated translations in < 5ms
const translationCache = new Map<string, TranslationResult>();
const MAX_CACHE_SIZE = 200;

function getCacheKey(text: string, sourceLang: string, targetLang: string): string {
  return `${sourceLang}-${targetLang}:${text.toLowerCase().trim()}`;
}

/**
 * Calls Gemini API with the pronunciation prompt to translate text
 * and generate figurative pronunciation.
 * Includes in-memory caching (<5ms response) and automatic retries for 503/429.
 */
export async function translateWithPronunciation(
  text: string,
  sourceLang: string,
  targetLang: string,
  attempt = 1
): Promise<TranslationResult> {
  const cacheKey = getCacheKey(text, sourceLang, targetLang);

  // 1. Check instant in-memory cache (< 5ms response time)
  if (attempt === 1 && translationCache.has(cacheKey)) {
    console.log("Serving translation from instant in-memory cache:", cacheKey);
    return translationCache.get(cacheKey)!;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: PRONUNCIATION_PROMPT,
    generationConfig: {
      temperature: 0.2, // Lower temperature for faster, deterministic responses
      topP: 0.8,
      maxOutputTokens: 1200, // Reduced token limit for faster generation speed
      responseMimeType: "application/json",
    },
  });

  const userMessage = JSON.stringify({
    text: text.trim(),
    sourceLang,
    targetLang,
  });

  try {
    const result = await model.generateContent(userMessage);
    const response = result.response;
    const rawText = response.text();

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    // Clean response
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed: TranslationResult = JSON.parse(cleanedText);

    // Validate required fields
    if (
      !parsed.source_language ||
      !parsed.target_language ||
      !parsed.original_text ||
      !parsed.translated_text ||
      !parsed.english_text ||
      !parsed.figurative_pronunciation ||
      !parsed.ipa_pronunciation ||
      !Array.isArray(parsed.examples)
    ) {
      throw new Error("Missing required fields in response");
    }

    // Save to instant cache
    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) translationCache.delete(firstKey);
    }
    translationCache.set(cacheKey, parsed);

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      const status = (error as { status?: number }).status;

      // Retry for transient 503 high demand or 429
      if (
        status === 503 ||
        status === 429 ||
        errorMsg.includes("503") ||
        errorMsg.includes("high demand") ||
        errorMsg.includes("resource exhausted")
      ) {
        if (attempt <= 3) {
          const waitTime = attempt * 1000;
          console.warn(
            `Gemini transient load. Retrying attempt ${attempt}/3 in ${waitTime}ms...`
          );
          await delay(waitTime);
          return translateWithPronunciation(text, sourceLang, targetLang, attempt + 1);
        }
        throw new Error("SERVICE_UNAVAILABLE");
      }

      // Check for invalid API key
      if (
        errorMsg.includes("api key not valid") ||
        errorMsg.includes("invalid api key") ||
        errorMsg.includes("api_key_invalid")
      ) {
        throw new Error("INVALID_API_KEY");
      }
    }

    // Retry once for parse errors
    if (
      error instanceof SyntaxError ||
      (error instanceof Error && error.message === "Missing required fields in response")
    ) {
      if (attempt < 2) {
        return translateWithPronunciation(text, sourceLang, targetLang, attempt + 1);
      }
      throw new Error("PARSE_ERROR");
    }

    throw error;
  }
}
