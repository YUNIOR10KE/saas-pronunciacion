"use client";

import type { TranslationExample } from "@/lib/types";

interface ExamplesListProps {
  examples: TranslationExample[];
}

export default function ExamplesList({ examples }: ExamplesListProps) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="animate-slide-up space-y-3" style={{ animationDelay: "150ms" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#bfdb38]/15 px-3.5 py-1 text-xs font-bold text-[#bfdb38] uppercase tracking-wider border border-[#bfdb38]/30">
          📝 Ejemplos de uso ({examples.length})
        </span>
      </div>

      {/* Examples grid */}
      <div className="grid gap-3">
        {examples.map((example, index) => (
          <div
            key={index}
            className="group glass-card rounded-2xl p-4 transition-all duration-200 hover:border-[#bfdb38]/40 hover:bg-[#141030]/90"
          >
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-4">
              {/* English */}
              <div className="flex gap-2.5 items-start">
                <span className="text-sm shrink-0 mt-0.5">🇺🇸</span>
                <p className="text-sm text-[#E6E6FA] leading-relaxed font-semibold">
                  {example.english}
                </p>
              </div>
              {/* Spanish */}
              <div className="flex gap-2.5 items-start">
                <span className="text-sm shrink-0 mt-0.5">🇪🇸</span>
                <p className="text-sm text-[#617db0] leading-relaxed font-medium group-hover:text-[#E6E6FA]/90 transition-colors">
                  {example.spanish}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
