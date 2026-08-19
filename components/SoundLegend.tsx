"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function SoundLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#617db0] hover:text-[#24d564] transition-colors"
        id="sound-legend-toggle"
      >
        <Info className="h-3.5 w-3.5 text-[#3ba899]" />
        <span>Guía de sonidos especiales</span>
      </button>

      {/* Legend panel */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-3 w-80 sm:w-96 rounded-2xl bg-[#0F0C29]/95 backdrop-blur-xl border border-[#24d564]/30 shadow-2xl p-5 z-50 animate-fade-in">
          <div className="flex items-center justify-between mb-3 border-b border-[#E6E6FA]/10 pb-2">
            <h3 className="text-sm font-bold text-[#E6E6FA]">
              Sonidos especiales en español
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#617db0] hover:text-[#E6E6FA] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-start">
              <span className="font-mono font-bold text-[#24d564]">z</span>
              <span className="text-[#E6E6FA]/90">
                = &quot;th&quot; sorda (como la <strong>z/c</strong> de España en &quot;zapato&quot;). No es la &quot;s&quot; de Latinoamérica.
              </span>

              <span className="font-mono font-bold text-[#bfdb38]">r</span>
              <span className="text-[#E6E6FA]/90">
                = La R inglesa <strong>no vibra</strong>. La lengua no toca el paladar — es más suave.
              </span>

              <span className="font-mono font-bold text-[#3ba899]">v</span>
              <span className="text-[#E6E6FA]/90">
                = Distinta de &quot;b&quot;. Muerde el labio inferior con los dientes de arriba.
              </span>

              <span className="font-mono font-bold text-[#c3804e]">sh</span>
              <span className="text-[#E6E6FA]/90">
                = Como decir &quot;shhh&quot; pidiendo silencio.
              </span>

              <span className="font-mono font-bold text-[#d94141]">dy</span>
              <span className="text-[#E6E6FA]/90">
                = La J inglesa suave (como en &quot;jump&quot;).
              </span>

              <span className="font-mono font-bold text-[#617db0]">j</span>
              <span className="text-[#E6E6FA]/90">
                = H aspirada del inglés (como la &quot;j&quot; de &quot;jarabe&quot;).
              </span>

              <span className="font-mono font-bold text-[#bba648]">ii, uu</span>
              <span className="text-[#E6E6FA]/90">
                = Vocal larga. Ejemplo: &quot;sh<strong>ii</strong>p&quot; (oveja) vs &quot;sh<strong>i</strong>p&quot; (barco).
              </span>
            </div>
          </div>

          <p className="mt-3 text-[10px] text-[#617db0] italic border-t border-[#E6E6FA]/10 pt-2">
            Las tildes (á, é, í, ó, ú) marcan la sílaba acentuada, igual que en español.
          </p>
        </div>
      )}
    </div>
  );
}
