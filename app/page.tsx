"use client";

import { useState, useCallback } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TranslationInput from "@/components/TranslationInput";
import PronunciationCard from "@/components/PronunciationCard";
import ResultCard from "@/components/ResultCard";
import ExamplesList from "@/components/ExamplesList";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SoundLegend from "@/components/SoundLegend";
import type { TranslationResult } from "@/lib/types";
import { Languages, ExternalLink } from "lucide-react";

export default function Home() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setInputText(result.translated_text);
    }
  }, [sourceLang, targetLang, result]);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang,
          targetLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ocurrió un error inesperado.");
        return;
      }

      setResult(data);
    } catch {
      setError("Error de conexión. Revisa tu internet e intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang, isLoading]);

  return (
    <div className="relative min-h-screen bg-[#0F0C29] text-[#E6E6FA] selection:bg-[#24d564]/30">
      {/* Pure CSS Ultra-Lightweight Glow Orbs & Waves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-14">
        {/* Header */}
        <header className="text-center mb-9 sm:mb-11">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d94141] via-[#bfdb38] to-[#24d564] p-0.5 shadow-xl shadow-[#24d564]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0F0C29]">
                <Languages className="h-6 w-6 text-[#24d564]" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gradient-primary tracking-tight">
              Habla Fácil
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[#617db0] max-w-md mx-auto leading-relaxed font-medium">
            Traduce y aprende a <span className="text-gradient-lime font-bold">pronunciar en voz alta</span> — con sonidos de español, no símbolos fonéticos.
          </p>
        </header>

        {/* Language Switcher */}
        <div className="mb-7">
          <LanguageSwitcher
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSwap={handleSwap}
            disabled={isLoading}
          />
        </div>

        {/* Translation Input */}
        <div className="mb-9">
          <TranslationInput
            sourceLang={sourceLang}
            value={inputText}
            onChange={setInputText}
            onSubmit={handleTranslate}
            isLoading={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-[#d94141]/15 border border-[#d94141]/40 p-4 animate-fade-in backdrop-blur-md">
            <p className="text-sm text-[#E6E6FA] text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-5">
            {/* Translation result */}
            <ResultCard
              originalText={result.original_text}
              translatedText={result.translated_text}
              sourceLang={result.source_language}
              targetLang={result.target_language}
            />

            {/* Pronunciation — THE STAR */}
            <PronunciationCard
              englishText={result.english_text}
              figurativePronunciation={result.figurative_pronunciation}
              ipaPronunciation={result.ipa_pronunciation}
            />

            {/* Examples */}
            <ExamplesList examples={result.examples} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-[#E6E6FA]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <SoundLegend />
            <div className="flex items-center gap-3 text-xs text-[#617db0]">
              <span>Hecho con ❤️ para aprender inglés</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#24d564] transition-colors"
                aria-label="GitHub Repo"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="mt-3.5 text-center text-[11px] text-[#617db0]/70">
            La pronunciación figurada es una aproximación para ayudarte a leer en voz alta. Complementa siempre con el audio real.
          </p>
        </footer>
      </div>
    </div>
  );
}
