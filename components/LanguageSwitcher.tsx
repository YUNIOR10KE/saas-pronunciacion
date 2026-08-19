"use client";

import { LANGUAGES } from "@/lib/languages";
import { ArrowRightLeft } from "lucide-react";

interface LanguageSwitcherProps {
  sourceLang: string;
  targetLang: string;
  onSwap: () => void;
  disabled?: boolean;
}

export default function LanguageSwitcher({
  sourceLang,
  targetLang,
  onSwap,
  disabled = false,
}: LanguageSwitcherProps) {
  const source = LANGUAGES.find((l) => l.code === sourceLang);
  const target = LANGUAGES.find((l) => l.code === targetLang);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {/* Source Language */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-[#141030]/80 backdrop-blur-md px-5 py-3 border border-[#E6E6FA]/15 min-w-[140px] justify-center shadow-lg shadow-black/20">
        <span className="text-xl shrink-0" role="img" aria-label={source?.name}>
          {source?.flag}
        </span>
        <span className="font-semibold text-[#E6E6FA] text-sm sm:text-base">
          {source?.name}
        </span>
      </div>

      {/* Swap Button */}
      <button
        onClick={onSwap}
        disabled={disabled}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#24d564] via-[#3ba899] to-[#617db0] text-white shadow-lg shadow-[#24d564]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#24d564]/35 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-[#E6E6FA]/20"
        aria-label="Intercambiar idiomas"
      >
        <ArrowRightLeft
          className="h-5 w-5 text-[#0F0C29] font-bold transition-transform duration-500 group-hover:rotate-180"
          strokeWidth={2.8}
        />
      </button>

      {/* Target Language */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-[#141030]/80 backdrop-blur-md px-5 py-3 border border-[#E6E6FA]/15 min-w-[140px] justify-center shadow-lg shadow-black/20">
        <span className="text-xl shrink-0" role="img" aria-label={target?.name}>
          {target?.flag}
        </span>
        <span className="font-semibold text-[#E6E6FA] text-sm sm:text-base">
          {target?.name}
        </span>
      </div>
    </div>
  );
}
