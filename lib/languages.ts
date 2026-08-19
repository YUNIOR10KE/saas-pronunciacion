export interface Language {
  code: string;
  name: string;
  flag: string;
  speechLang: string; // BCP 47 tag for Web Speech API
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "Inglés", flag: "🇺🇸", speechLang: "en-US" },
  { code: "es", name: "Español", flag: "🇪🇸", speechLang: "es-ES" },
  // futuros idiomas se agregan aquí
];

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.code === code);
}

export function getOtherLanguage(code: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.code !== code);
}
