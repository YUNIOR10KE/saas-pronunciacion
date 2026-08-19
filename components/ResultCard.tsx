"use client";

import { LANGUAGES } from "@/lib/languages";
import { ArrowRight } from "lucide-react";

interface ResultCardProps {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export default function ResultCard({
  originalText,
  translatedText,
  sourceLang,
  targetLang,
}: ResultCardProps) {
  const source = LANGUAGES.find((l) => l.code === sourceLang);
  const target = LANGUAGES.find((l) => l.code === targetLang);

  return (
    <div className="glass-card rounded-3xl overflow-hidden animate-slide-up">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3ba899]/20 px-3 py-1 text-xs font-bold text-[#3ba899] uppercase tracking-wider border border-[#3ba899]/30">
            Traducción
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#617db0]">
            <span>{source?.flag} {source?.name}</span>
            <ArrowRight className="h-3 w-3 text-[#3ba899]" />
            <span>{target?.flag} {target?.name}</span>
          </div>
        </div>

        {/* Original text */}
        <div className="mb-4 rounded-2xl bg-black/30 p-4 border border-[#E6E6FA]/10">
          <p className="text-xs font-semibold text-[#617db0] uppercase tracking-wider mb-1">
            {source?.flag} Original
          </p>
          <p className="text-base text-[#E6E6FA] leading-relaxed">
            {originalText}
          </p>
        </div>

        {/* Translated text */}
        <div>
          <p className="text-xs font-semibold text-[#3ba899] uppercase tracking-wider mb-1">
            {target?.flag} Traducción
          </p>
          <p className="text-xl sm:text-2xl font-bold text-[#E6E6FA] leading-relaxed">
            {translatedText}
          </p>
        </div>
      </div>
    </div>
  );
}
