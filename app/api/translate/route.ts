import { NextRequest, NextResponse } from "next/server";
import { translateWithPronunciation } from "@/lib/gemini";
import { LANGUAGES } from "@/lib/languages";

const validCodes = LANGUAGES.map((l) => l.code);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceLang, targetLang } = body;

    // Validate input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Por favor, ingresa un texto para traducir." },
        { status: 400 }
      );
    }

    if (!validCodes.includes(sourceLang) || !validCodes.includes(targetLang)) {
      return NextResponse.json(
        { error: "Idioma no válido." },
        { status: 400 }
      );
    }

    if (sourceLang === targetLang) {
      return NextResponse.json(
        { error: "Los idiomas de origen y destino deben ser diferentes." },
        { status: 400 }
      );
    }

    const result = await translateWithPronunciation(
      text.trim(),
      sourceLang,
      targetLang
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Translation error:", error);

    if (error instanceof Error) {
      if (error.message === "RATE_LIMIT" || error.message === "SERVICE_UNAVAILABLE") {
        return NextResponse.json(
          {
            error:
              "El servicio de Google Gemini tiene alta demanda temporal. Intenta de nuevo en unos segundos.",
          },
          { status: 503 }
        );
      }

      if (error.message === "PARSE_ERROR") {
        return NextResponse.json(
          {
            error:
              "Hubo un problema procesando la respuesta. Intenta de nuevo.",
          },
          { status: 502 }
        );
      }

      if (error.message === "GEMINI_API_KEY is not configured" || error.message === "INVALID_API_KEY") {
        return NextResponse.json(
          {
            error:
              "La clave de API no es válida o no está configurada. Verifica tu GEMINI_API_KEY.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
