import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habla Fácil — Traductor con Pronunciación en Español",
  description:
    "Traduce entre inglés y español y aprende a pronunciar en voz alta con una guía escrita usando sonidos de español, no símbolos fonéticos IPA. Con audio real y ejemplos de uso.",
  keywords: [
    "traducción inglés español",
    "pronunciación en español",
    "cómo se pronuncia en inglés",
    "guía de pronunciación",
    "aprender inglés",
    "pronunciación figurada",
  ],
  openGraph: {
    title: "Habla Fácil — Pronunciación de Inglés en Español",
    description:
      "Traduce y aprende a pronunciar inglés con sonidos de español. Sin símbolos fonéticos.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
