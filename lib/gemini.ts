import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRONUNCIATION_PROMPT } from "./prompts";
import type { TranslationResult } from "./types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Calls Gemini API with the pronunciation prompt to translate text
 * and generate figurative pronunciation.
 * Includes automatic retries for transient 503 (high demand) and 429 errors.
 */
export async function translateWithPronunciation(
  text: string,
  sourceLang: string,
  targetLang: string,
  attempt = 1
): Promise<TranslationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: PRONUNCIATION_PROMPT,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });

  const userMessage = JSON.stringify({
    text,
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

    // Clean the response in case Gemini wraps it in markdown code blocks
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

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      const status = (error as { status?: number }).status;

      // Handle transient high demand (503) or rate limits (429) with automatic retry up to 3 attempts
      if (status === 503 || status === 429 || errorMsg.includes("503") || errorMsg.includes("high demand") || errorMsg.includes("resource exhausted")) {
        if (attempt <= 3) {
          const waitTime = attempt * 1500;
          console.warn(`Gemini 503/429 high demand encountered. Retrying attempt ${attempt}/3 after ${waitTime}ms...`);
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
        console.error("Invalid API key:", errorMsg);
        throw new Error("INVALID_API_KEY");
      }
    }

    // Retry once for parse errors
    if (
      error instanceof SyntaxError ||
      (error instanceof Error && error.message === "Missing required fields in response")
    ) {
      if (attempt < 2) {
        console.warn("Malformed response from Gemini, retrying...", error);
        return translateWithPronunciation(text, sourceLang, targetLang, attempt + 1);
      }
      throw new Error("PARSE_ERROR");
    }

    // Log and rethrow for debugging
    console.error("Gemini SDK error:", error);
    throw error;
  }
}
