"use client";

import { useState, useCallback, useRef } from "react";
import { Volume2, ChevronDown, ChevronUp } from "lucide-react";

interface PronunciationCardProps {
  englishText: string;
  figurativePronunciation: string;
  ipaPronunciation: string;
}

export default function PronunciationCard({
  englishText,
  figurativePronunciation,
  ipaPronunciation,
}: PronunciationCardProps) {
  const [showIpa, setShowIpa] = useState(false);
  const [speed, setSpeed] = useState<"normal" | "slow">("normal");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(englishText);
    utterance.lang = "en-US";
    utterance.rate = speed === "slow" ? 0.6 : 1;
    utterance.pitch = 1;

    // Try to find an English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") && v.localService
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [englishText, speed]);

  return (
    <div className="pronunciation-card-glow relative overflow-hidden rounded-3xl animate-slide-up backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#24d564]/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#3ba899]/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#24d564]/15 px-3.5 py-1 text-xs font-bold text-[#bfdb38] uppercase tracking-wider border border-[#24d564]/30">
              <span className="w-2 h-2 rounded-full bg-[#24d564] animate-pulse" />
              Pronunciación Figurada
            </span>
          </div>

          {/* Audio controls */}
          <div className="flex items-center gap-2">
            {/* Speed toggle */}
            <button
              onClick={() => setSpeed(speed === "normal" ? "slow" : "normal")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 border ${
                speed === "slow"
                  ? "bg-[#bfdb38]/20 text-[#bfdb38] border-[#bfdb38]/40"
                  : "bg-[#141030] text-[#617db0] border-[#E6E6FA]/10 hover:text-[#E6E6FA]"
              }`}
              title={speed === "normal" ? "Cambiar a velocidad lenta" : "Cambiar a velocidad normal"}
            >
              {speed === "slow" ? "🐢 Lenta" : "1x Normal"}
            </button>

            {/* Play button */}
            <button
              onClick={speak}
              className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-bold transition-all duration-300 ${
                isSpeaking
                  ? "bg-[#24d564] text-[#0F0C29] shadow-lg shadow-[#24d564]/40 scale-105"
                  : "bg-[#3ba899]/20 text-[#24d564] hover:bg-[#24d564] hover:text-[#0F0C29] border border-[#24d564]/40 shadow-md hover:shadow-lg hover:scale-105"
              }`}
              title="Escuchar pronunciación"
              id="pronunciation-audio-button"
            >
              <Volume2
                className={`h-4 w-4 ${isSpeaking ? "animate-pulse" : ""}`}
                strokeWidth={2.5}
              />
              <span className="hidden sm:inline">
                {isSpeaking ? "Reproduciendo..." : "Escuchar"}
              </span>
            </button>
          </div>
        </div>

        {/* English text */}
        <p className="text-base sm:text-lg text-[#617db0] leading-relaxed mb-3 font-medium">
          {englishText}
        </p>

        {/* Figurative pronunciation — THE STAR */}
        <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-[#24d564]/30 p-5 mb-3 shadow-inner">
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#24d564] leading-relaxed tracking-wide font-mono drop-shadow-[0_0_15px_rgba(36,213,100,0.3)]">
            → {figurativePronunciation}
          </p>
        </div>

        {/* IPA toggle */}
        <button
          onClick={() => setShowIpa(!showIpa)}
          className="flex items-center gap-1.5 text-xs font-medium text-[#617db0] hover:text-[#E6E6FA] transition-colors"
          id="ipa-toggle"
        >
          {showIpa ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
          <span>IPA (fonética técnica)</span>
        </button>

        {showIpa && (
          <div className="mt-2.5 rounded-xl bg-black/50 border border-[#E6E6FA]/10 px-4 py-2.5 animate-fade-in">
            <p className="text-sm text-[#bfdb38] font-mono">
              /{ipaPronunciation}/
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
