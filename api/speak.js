import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

function getEnvValue(key) {
  if (process.env[key]) {
    return process.env[key].trim();
  }

  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const envFile = fs.readFileSync(envPath, "utf8");

    const line = envFile
      .split("\n")
      .find((item) => item.trim().startsWith(`${key}=`));

    if (!line) return null;

    return line
      .replace(`${key}=`, "")
      .replace(/^["']|["']$/g, "")
      .trim();
  } catch (error) {
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { text } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Missing text",
      });
    }

    const apiKey = getEnvValue("ELEVENLABS_API_KEY");
    const voiceId = getEnvValue("ELEVENLABS_VOICE_ID");

    if (!apiKey) {
      return res.status(500).json({
        error: "ELEVENLABS_API_KEY not found in .env.local",
      });
    }

    if (!voiceId) {
      return res.status(500).json({
        error: "ELEVENLABS_VOICE_ID not found in .env.local",
      });
    }

    const cleanText = cleanForSpeech(text);

    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            style: 0.45,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text();

      return res.status(elevenResponse.status).json({
        error: errorText,
      });
    }

    const arrayBuffer = await elevenResponse.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(500).json({
        error: "ElevenLabs returned empty audio",
      });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(audioBuffer);
  } catch (error) {
    console.error("KODA ELEVENLABS ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server error in api/speak.js",
    });
  }
}