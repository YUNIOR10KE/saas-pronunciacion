"use client";

import { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "@/lib/languages";
import { Search, Loader2 } from "lucide-react";

interface TranslationInputProps {
  sourceLang: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function TranslationInput({
  sourceLang,
  value,
  onChange,
  onSubmit,
  isLoading,
}: TranslationInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const source = LANGUAGES.find((l) => l.code === sourceLang);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const placeholder =
    sourceLang === "en"
      ? "Escribe en inglés... ej: I would have gone to the party"
      : "Escribe en español... ej: Me gustaría una explicación";

  return (
    <div className="relative">
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 focus-within:border-[#24d564]/50 focus-within:shadow-[0_0_25px_rgba(36,213,100,0.2)]">
        {/* Language indicator */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-1">
          <span className="text-sm" role="img" aria-label={source?.name}>
            {source?.flag}
          </span>
          <span className="text-xs font-semibold text-[#617db0] uppercase tracking-wider">
            {source?.name}
          </span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              onChange(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none bg-transparent px-5 py-2 text-lg text-[#E6E6FA] placeholder-[#617db0]/60 focus:outline-none leading-relaxed font-normal"
          disabled={isLoading}
          id="translation-input"
          aria-label={`Texto para traducir desde ${source?.name}`}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E6E6FA]/10 bg-black/20">
          <span
            className={`text-xs transition-colors ${
              charCount > maxChars * 0.9
                ? "text-[#d94141] font-bold"
                : "text-[#617db0]"
            }`}
          >
            {charCount}/{maxChars}
          </span>

          <button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#24d564] via-[#3ba899] to-[#617db0] px-6 py-2.5 text-sm font-bold text-[#0F0C29] shadow-lg shadow-[#24d564]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#24d564]/35 hover:scale-[1.03] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            id="translate-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#0F0C29]" />
                <span>Traduciendo...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 text-[#0F0C29]" strokeWidth={2.5} />
                <span>Traducir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <p className="mt-2 text-center text-xs text-[#617db0]/80">
        Presiona <kbd className="rounded bg-[#141030] px-1.5 py-0.5 text-[10px] font-mono text-[#E6E6FA] border border-[#E6E6FA]/10">Enter</kbd> para traducir · <kbd className="rounded bg-[#141030] px-1.5 py-0.5 text-[10px] font-mono text-[#E6E6FA] border border-[#E6E6FA]/10">Shift+Enter</kbd> nueva línea
      </p>
    </div>
  );
}
