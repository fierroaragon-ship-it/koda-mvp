import fs from "fs";
import path from "path";
import OpenAI from "openai";

function getOpenAIKey() {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }

  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const envFile = fs.readFileSync(envPath, "utf8");

    const line = envFile
      .split("\n")
      .find((item) => item.trim().startsWith("OPENAI_API_KEY="));

    if (!line) return null;

    return line.replace("OPENAI_API_KEY=", "").trim();
  } catch {
    return null;
  }
}

function cleanForSpeech(text = "") {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[#*_`~>|[\]{}]/g, "")
    .replace(/\b(emoji|emoticon|corazón rojo|red heart|heart emoji)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPrompt({ text, childName, age, language, intention, character }) {
  if (language === "en") {
    return `
You are Koda, a therapeutic communication assistant for child therapists.

Your task:
Transform the therapist's phrase into a warm, natural, age-appropriate sentence that ${character || "Koda"} would say to a ${age || "young"} year-old child named ${childName || "the child"}.

Therapeutic intention:
${intention || "Explore emotion"}

Strict rules:
- Answer only in English.
- Do not use emojis.
- Do not mention emoji names.
- Do not use markdown.
- Do not use bullet points.
- Do not diagnose.
- Do not pressure the child.
- Do not invent facts.
- Do not sound robotic.
- Keep it short: maximum 2 gentle sentences.
- Make it feel safe, warm, and child-friendly.

Therapist phrase:
"${text}"
`;
  }

  return `
Eres Koda, un asistente de comunicación terapéutica infantil.

Tu tarea:
Transforma la frase del terapeuta en una frase cálida, natural y adecuada para que ${character || "Koda"} se la diga a un niño o niña de ${age || "pocos"} años llamado/a ${childName || "el niño"}.

Intención terapéutica:
${intention || "Explorar emoción"}

Reglas estrictas:
- Responde solo en español.
- No uses emojis.
- No menciones nombres de emojis.
- No uses markdown.
- No uses viñetas.
- No diagnostiques.
- No presiones al niño.
- No inventes hechos.
- No suenes robótico.
- Máximo 2 frases cortas y amables.
- Debe sonar seguro, cálido e infantil.

Frase del terapeuta:
"${text}"
`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { text, childName, age, language = "es", intention, character } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Missing text",
      });
    }

    const apiKey = getOpenAIKey();

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY not found. Check .env.local in project root.",
      });
    }

    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: buildPrompt({
        text,
        childName,
        age,
        language,
        intention,
        character,
      }),
      temperature: 0.85,
      max_output_tokens: 150,
    });

    let raw = response.output_text || "";

    if (!raw && Array.isArray(response.output)) {
      for (const item of response.output) {
        if (Array.isArray(item.content)) {
          for (const content of item.content) {
            if (content.text) {
              raw += content.text;
            }
          }
        }
      }
    }

    const adaptedText = cleanForSpeech(raw);

    if (!adaptedText) {
      return res.status(500).json({
        error: "OpenAI returned empty response",
      });
    }

    return res.status(200).json({
      adaptedText,
    });
  } catch (error) {
    console.error("KODA API ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}