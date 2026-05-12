import React, { useMemo, useRef, useState } from "react";

const characterOptions = [
  { id: "bear", es: "Osita Koda", en: "Koda Bear", emoji: "🧸" },
  { id: "girl", es: "Niña Koda", en: "Koda Girl", emoji: "👧" },
  { id: "boy", es: "Niño Koda", en: "Koda Boy", emoji: "👦" },
];

const intentions = {
  es: [
    "Explorar emoción",
    "Tranquilizar",
    "Validar miedo",
    "Validar tristeza",
    "Romper el hielo",
    "Animar",
    "Ansiedad",
    "Autismo / Sensibilidad",
  ],
  en: [
    "Explore emotion",
    "Calm down",
    "Validate fear",
    "Validate sadness",
    "Break the ice",
    "Encourage",
    "Anxiety",
    "Autism / Sensory support",
  ],
};

function cleanForSpeech(text = "") {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[#*_`~>|[\]{}]/g, "")
    .replace(/\b(emoji|emoticon|corazón rojo|red heart|heart emoji)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function KodaMvpEngine() {
  const [language, setLanguage] = useState("es");
  const [childName, setChildName] = useState("Sofi");
  const [age, setAge] = useState("7");
  const [characterId, setCharacterId] = useState("bear");
  const [intention, setIntention] = useState("Explorar emoción");
  const [therapistText, setTherapistText] = useState(
    "¿Puedes contarme qué pasó cuando tu papá te gritó?"
  );
  const [adaptedText, setAdaptedText] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Listo");

  const audioRef = useRef(null);

  const character = useMemo(() => {
    return (
      characterOptions.find((item) => item.id === characterId) ||
      characterOptions[0]
    );
  }, [characterId]);

  const t = {
    es: {
      subtitle: "Un puente emocional entre el terapeuta y el niño.",
      language: "Idioma",
      childName: "Nombre del niño",
      age: "Edad",
      character: "Personaje",
      intention: "Intención terapéutica",
      therapistPhrase: "Frase del terapeuta",
      placeholder: "Escribe aquí lo que quieres que Koda transforme...",
      talk: "Hablar con Koda",
      repeat: "Repetir voz",
      stop: "Detener",
      kodaWouldSay: "Koda diría:",
      empty: "Aquí aparecerá la frase adaptada para el niño.",
      safety:
        "Koda no sustituye al terapeuta. Solo ayuda a convertir una frase clínica en una frase más amable y comprensible.",
      quick: "Datos rápidos",
      engine: "Motor emocional",
      demo: "Modo demo para promoción",
      ready: "Listo",
      thinking: "Koda está pensando",
      generatingVoice: "Generando voz",
      speaking: "Hablando",
      error: "Error",
    },
    en: {
      subtitle: "An emotional bridge between therapist and child.",
      language: "Language",
      childName: "Child name",
      age: "Age",
      character: "Character",
      intention: "Therapeutic intention",
      therapistPhrase: "Therapist phrase",
      placeholder: "Write here what you want Koda to transform...",
      talk: "Talk with Koda",
      repeat: "Repeat voice",
      stop: "Stop",
      kodaWouldSay: "Koda would say:",
      empty: "The adapted phrase for the child will appear here.",
      safety:
        "Koda does not replace the therapist. It helps turn a clinical phrase into a kinder and more understandable one.",
      quick: "Quick info",
      engine: "Emotional engine",
      demo: "Demo mode for promotion",
      ready: "Ready",
      thinking: "Koda is thinking",
      generatingVoice: "Generating voice",
      speaking: "Speaking",
      error: "Error",
    },
  }[language];

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    window.speechSynthesis?.cancel?.();
    setIsSpeaking(false);
    setStatusMessage(t.ready);
  }

  async function adaptWithKoda() {
    const cleanText = therapistText.trim();

    if (!cleanText) {
      throw new Error(
        language === "es"
          ? "Escribe una frase del terapeuta."
          : "Write a therapist phrase."
      );
    }

    const response = await fetch("/api/adapt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanText,
        childName,
        age,
        language,
        intention,
        character: language === "es" ? character.es : character.en,
      }),
    });

    const rawBody = await response.text();

    if (!response.ok) {
      throw new Error(`API ERROR ${response.status}: ${rawBody}`);
    }

    let data;

    try {
      data = JSON.parse(rawBody);
    } catch {
      throw new Error(`Respuesta no JSON: ${rawBody}`);
    }

    if (!data.adaptedText) {
      throw new Error(`La API no regresó adaptedText: ${rawBody}`);
    }

    return cleanForSpeech(data.adaptedText);
  }

  async function speakWithKoda(textToSpeak) {
    const cleanText = cleanForSpeech(textToSpeak);

    if (!cleanText) {
      throw new Error(
        language === "es"
          ? "No hay texto para reproducir."
          : "There is no text to play."
      );
    }

    const response = await fetch("/api/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanText,
        language,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`VOICE API ERROR ${response.status}: ${errorBody}`);
    }

    const audioBlob = await response.blob();

    if (!audioBlob || audioBlob.size === 0) {
      throw new Error(
        language === "es"
          ? "ElevenLabs regresó audio vacío."
          : "ElevenLabs returned empty audio."
      );
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audioRef.current = audio;

    audio.onplay = () => {
      setIsSpeaking(true);
      setStatusMessage(t.speaking);
    };

    audio.onended = () => {
      setIsSpeaking(false);
      setStatusMessage(t.ready);
      URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = () => {
      setIsSpeaking(false);
      setStatusMessage(t.error);
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();
  }

  async function handleTalkWithKoda() {
  try {
    stopAudio();
    setIsWorking(true);
    setAdaptedText("");
    setStatusMessage(t.thinking);

    const result = await adaptWithKoda();

    setAdaptedText(result);
    setStatusMessage(t.generatingVoice);

    try {
      await speakWithKoda(result);
    } catch (voiceError) {
      console.warn("KODA VOICE WARNING:", voiceError);

      setStatusMessage(
        language === "es" ? "Voz premium pendiente" : "Premium voice pending"
      );
    }

    setIsWorking(false);
  } catch (error) {
    console.error("KODA ERROR:", error);

    setIsWorking(false);
    setIsSpeaking(false);
    setStatusMessage(t.error);

    setAdaptedText(
      language === "es"
        ? `ERROR REAL: ${error.message}`
        : `REAL ERROR: ${error.message}`
    );
  }
}

  async function handleRepeatVoice() {
    try {
      stopAudio();
      setIsWorking(true);
      setStatusMessage(t.generatingVoice);

      await speakWithKoda(adaptedText);

      setIsWorking(false);
    } catch (error) {
      console.error("KODA VOICE ERROR:", error);

      setIsWorking(false);
      setIsSpeaking(false);
      setStatusMessage(t.error);

      setAdaptedText(
        language === "es"
          ? `ERROR VOZ: ${error.message}`
          : `VOICE ERROR: ${error.message}`
      );
    }
  }

  function handleLanguageChange(newLanguage) {
    stopAudio();
    setLanguage(newLanguage);
    setAdaptedText("");
    setStatusMessage(newLanguage === "es" ? "Listo" : "Ready");

    if (newLanguage === "es") {
      setIntention("Explorar emoción");
      setTherapistText("¿Puedes contarme qué pasó cuando tu papá te gritó?");
    } else {
      setIntention("Explore emotion");
      setTherapistText("Can you tell me what happened when your dad yelled?");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8EE] via-[#F7EFE4] to-[#F2E4D5] px-4 py-6 text-[#2C241D]">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-white/75 px-4 py-2 text-sm font-semibold shadow-sm">
              🧸 Koda MVP Engine
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Koda
            </h1>

            <p className="mt-2 max-w-2xl text-lg text-[#6E6258]">
              {t.subtitle}
            </p>

            <p className="mt-3 inline-flex rounded-full bg-[#2C241D] px-4 py-2 text-sm font-semibold text-white">
              ✨ {t.demo}
            </p>
          </div>

          <div className="rounded-3xl bg-white/85 p-4 shadow-xl">
            <label className="mb-2 block text-sm font-bold">{t.language}</label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange("es")}
                className={`rounded-2xl px-4 py-2 font-bold ${
                  language === "es"
                    ? "bg-[#2C241D] text-white"
                    : "bg-[#FFF1DC]"
                }`}
              >
                Español
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`rounded-2xl px-4 py-2 font-bold ${
                  language === "en"
                    ? "bg-[#2C241D] text-white"
                    : "bg-[#FFF1DC]"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-black">🧒 {t.quick}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-[#6E6258]">
                  {t.childName}
                </span>

                <input
                  value={childName}
                  onChange={(event) => setChildName(event.target.value)}
                  className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-[#6E6258]">
                  {t.age}
                </span>

                <input
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]"
                />
              </label>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-semibold text-[#6E6258]">
                {t.character}
              </span>

              <div className="grid gap-3 md:grid-cols-3">
                {characterOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setCharacterId(option.id)}
                    className={`rounded-2xl border px-3 py-4 text-left transition ${
                      characterId === option.id
                        ? "border-[#C58E55] bg-[#FFF1DC] shadow-md"
                        : "border-[#E7D8C5] bg-white hover:bg-[#FFF8EE]"
                    }`}
                  >
                    <div className="text-3xl">{option.emoji}</div>

                    <div className="mt-2 text-sm font-bold">
                      {language === "es" ? option.es : option.en}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-[#6E6258]">
                {t.intention}
              </span>

              <select
                value={intention}
                onChange={(event) => setIntention(event.target.value)}
                className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]"
              >
                {intentions[language].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="mt-5 rounded-3xl bg-[#F7E7D1] p-4 text-sm leading-relaxed text-[#6E4F36]">
              🛡️ {t.safety}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">✨ {t.engine}</h2>

              <div
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  isSpeaking
                    ? "bg-green-100 text-green-700"
                    : isWorking
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-[#FFF1DC]"
                }`}
              >
                {statusMessage}
              </div>
            </div>

            <label>
              <span className="mb-2 block text-sm font-semibold text-[#6E6258]">
                {t.therapistPhrase}
              </span>

              <textarea
                value={therapistText}
                onChange={(event) => setTherapistText(event.target.value)}
                className="min-h-40 w-full resize-none rounded-3xl border border-[#E7D8C5] bg-white px-5 py-4 text-base outline-none focus:border-[#C58E55]"
                placeholder={t.placeholder}
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleTalkWithKoda}
                disabled={isWorking || isSpeaking}
                className="rounded-2xl bg-[#2C241D] px-5 py-3 font-bold text-white shadow-lg hover:bg-[#46382C] disabled:opacity-60"
              >
                ✨ {t.talk}
              </button>

              {adaptedText && !adaptedText.startsWith("ERROR") && (
                <button
                  type="button"
                  onClick={handleRepeatVoice}
                  disabled={isWorking || isSpeaking}
                  className="rounded-2xl bg-[#FFE3B8] px-5 py-3 font-bold text-[#2C241D] shadow-md hover:bg-[#FFD99E] disabled:opacity-60"
                >
                  🔊 {t.repeat}
                </button>
              )}

              {(isWorking || isSpeaking) && (
                <button
                  type="button"
                  onClick={stopAudio}
                  className="rounded-2xl border border-[#D8B489] px-5 py-3 font-bold"
                >
                  {t.stop}
                </button>
              )}
            </div>

            <div className="mt-5 rounded-[2rem] bg-[#2C241D] p-6 text-white shadow-inner">
              <div className="mb-4 flex items-center gap-4">
                <div
                  className={`grid h-16 w-16 place-items-center rounded-3xl bg-white/15 text-4xl ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                >
                  {character.emoji}
                </div>

                <div>
                  <p className="text-sm text-white/60">{t.kodaWouldSay}</p>

                  <p className="text-lg font-bold">
                    {language === "es" ? character.es : character.en}
                  </p>
                </div>
              </div>

              <p className="min-h-28 whitespace-pre-wrap text-xl leading-relaxed text-white/90">
                {adaptedText || t.empty}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}