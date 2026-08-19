export interface TranslationExample {
  english: string;
  spanish: string;
}

export interface TranslationResult {
  source_language: "en" | "es";
  target_language: "en" | "es";
  original_text: string;
  translated_text: string;
  english_text: string;
  figurative_pronunciation: string;
  ipa_pronunciation: string;
  examples: TranslationExample[];
}

export interface TranslateRequest {
  text: string;
  sourceLang: "en" | "es";
  targetLang: "en" | "es";
}
