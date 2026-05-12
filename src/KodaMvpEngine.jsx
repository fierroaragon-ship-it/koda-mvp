import React, { useMemo, useState } from "react";

const characterOptions = [
  { id: "bear", es: "Osito Koda", en: "Koda Bear", emoji: "🧸" },
  { id: "girl", es: "Niña Koda", en: "Koda Girl", emoji: "👧" },
  { id: "boy", es: "Niño Koda", en: "Koda Boy", emoji: "👦" },
];

const intentions = {
  es: [
    "Neutro",
    "Tranquilizar",
    "Animar",
    "Explorar emoción",
    "Romper el hielo",
    "Validar tristeza",
    "Validar miedo",
    "Ansiedad",
    "Autismo / Sensibilidad",
  ],
  en: [
    "Neutral",
    "Calm down",
    "Encourage",
    "Explore emotion",
    "Break the ice",
    "Validate sadness",
    "Validate fear",
    "Anxiety",
    "Autism / Sensory support",
  ],
};

function adaptMessage({ text, childName, language, intention }) {
  const clean = text.trim();
  const name = childName?.trim() || (language === "es" ? "peque" : "little one");

  if (!clean) return "";

  if (language === "en") {
    const openers = {
      Neutral: `Hi ${name} 😊`,
      "Calm down": `${name}, it’s okay. Let’s take a tiny breath together 🌿`,
      Encourage: `Hey ${name}, I have a brave little question for you ✨`,
      "Explore emotion": `${name}, I want to understand your heart a little 🧡`,
      "Break the ice": `Psst, ${name}... I’m Koda and I’m curious 🧸`,
      "Validate sadness": `${name}, if you felt sad today, that’s okay. I’m here with you 💛`,
      "Validate fear": `${name}, fear can feel really big sometimes, but you’re not alone 🌙`,
      Anxiety: `${name}, sometimes the body feels worried before we understand why 🌱`,
      "Autism / Sensory support": `${name}, we can go slowly. You don’t have to answer fast 🧩`,
    };

    const opener = openers[intention] || openers.Neutral;
    const lower = clean.toLowerCase();

    if (lower.includes("how did you feel")) {
      return `${opener}. Can you tell me slowly how your little heart felt today? You can say just a little bit.`;
    }

    if (lower.includes("why")) {
      return `${opener}. Can you help me understand what happened? I’m not here to scold you, only to listen.`;
    }

    if (lower.includes("mom") || lower.includes("dad")) {
      return `${opener}. When you think about your family, what does your tummy or your heart feel?`;
    }

    if (lower.includes("scared") || lower.includes("fear")) {
      return `${opener}. Fear can feel like a big shadow. Do you want to tell me what part felt scary?`;
    }

    if (lower.includes("sad") || lower.includes("cry")) {
      return `${opener}. Sometimes crying is the way the heart talks. Do you want to tell me what hurt your heart?`;
    }

    return `${opener}. ${clean.replace(/\?*$/, "")}... but you can tell me in your own way, slowly, however you want.`;
  }

  const openers = {
    Neutro: `Holaaa ${name} 😊`,
    Tranquilizar: `${name}, está bien, respira conmigo tantito 🌿`,
    Animar: `Oye ${name}, tengo una preguntita valiente para ti ✨`,
    "Explorar emoción": `${name}, quiero entender tu corazón un poquito 🧡`,
    "Romper el hielo": `Pss pss, ${name}... soy Koda y tengo curiosidad 🧸`,
    "Validar tristeza": `${name}, si hoy te sentiste triste, no pasa nada, aquí estoy contigo 💛`,
    "Validar miedo": `${name}, a veces sentir miedo se siente grandote, pero no estás solito 🌙`,
    Ansiedad: `${name}, a veces el cuerpo se preocupa antes de que sepamos por qué 🌱`,
    "Autismo / Sensibilidad": `${name}, podemos ir despacito. No tienes que contestar rápido 🧩`,
  };

  const opener = openers[intention] || openers.Neutro;
  const lower = clean.toLowerCase();

  if (lower.includes("cómo te sentiste") || lower.includes("como te sentiste")) {
    return `${opener}. ¿Me cuentas con calma cómo se sintió tu corazoncito hoy? Puede ser poquito, no tienes que decir todo de una vez.`;
  }

  if (lower.includes("por qué") || lower.includes("porque")) {
    return `${opener}. ¿Me ayudas a entender qué pasó? No te voy a regañar, solo quiero escucharte.`;
  }

  if (lower.includes("mamá") || lower.includes("mama") || lower.includes("papá") || lower.includes("papa")) {
    return `${opener}. Cuando piensas en eso de tu familia, ¿qué siente tu pancita o tu corazón?`;
  }

  if (lower.includes("miedo")) {
    return `${opener}. El miedo a veces parece enorme, como una sombra grande. ¿Quieres contarme qué parte te asustó más?`;
  }

  if (lower.includes("triste") || lower.includes("llorar")) {
    return `${opener}. A veces llorar es la forma en que el corazón habla. ¿Quieres contarme qué le dolió a tu corazón?`;
  }

  return `${opener}. ${clean.replace(/\?*$/, "")}... pero me lo puedes contar a tu manera, despacito, como tú quieras.`;
}

export default function KodaMvpEngine() {
  const [language, setLanguage] = useState("es");
  const [childName, setChildName] = useState("Sofi");
  const [age, setAge] = useState("7");
  const [characterId, setCharacterId] = useState("bear");
  const [intention, setIntention] = useState("Explorar emoción");
  const [therapistText, setTherapistText] = useState("¿Cómo te sentiste hoy?");
  const [adaptedText, setAdaptedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const character = useMemo(
    () => characterOptions.find((item) => item.id === characterId) || characterOptions[0],
    [characterId]
  );

  const t = {
    es: {
      subtitle: "Un puente emocional entre el terapeuta y el niño.",
      language: "Idioma",
      childName: "Nombre del niño",
      age: "Edad",
      character: "Personaje",
      intention: "Intención terapéutica",
      therapistPhrase: "Frase del terapeuta",
      placeholder: "Escribe aquí lo que quieres preguntarle al niño...",
      adapt: "Adaptar con Koda",
      speak: "Reproducir voz",
      stop: "Detener",
      autoSpeak: "Hablar automáticamente",
      kodaWouldSay: "Koda diría:",
      empty: "Aquí aparecerá la frase adaptada para el niño.",
      safety: "Koda no sustituye al terapeuta. Solo ayuda a convertir una frase clínica en una frase más amable y comprensible.",
      quick: "Datos rápidos",
      engine: "Motor emocional",
      demo: "Modo demo para promoción",
    },
    en: {
      subtitle: "An emotional bridge between therapist and child.",
      language: "Language",
      childName: "Child name",
      age: "Age",
      character: "Character",
      intention: "Therapeutic intention",
      therapistPhrase: "Therapist phrase",
      placeholder: "Write here what you want to ask the child...",
      adapt: "Adapt with Koda",
      speak: "Play voice",
      stop: "Stop",
      autoSpeak: "Speak automatically",
      kodaWouldSay: "Koda would say:",
      empty: "The adapted phrase for the child will appear here.",
      safety: "Koda does not replace the therapist. It helps turn a clinical phrase into a kinder and more understandable one.",
      quick: "Quick info",
      engine: "Emotional engine",
      demo: "Demo mode for promotion",
    },
  }[language];

  const speakText = (text) => {
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "es" ? "es-MX" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = characterId === "bear" ? 1.18 : 1.28;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setAdaptedText("");
    setIsTyping(false);
    window.speechSynthesis.cancel();

    if (newLanguage === "es") {
      setIntention("Explorar emoción");
      setTherapistText("¿Cómo te sentiste hoy?");
    } else {
      setIntention("Explore emotion");
      setTherapistText("How did you feel today?");
    }
  };

  const handleAdapt = () => {
    if (!therapistText.trim()) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsTyping(true);
    setAdaptedText("");

    const result = adaptMessage({
      text: therapistText,
      childName,
      language,
      intention,
    });

    let i = 0;

    const interval = setInterval(() => {
      setAdaptedText(result.slice(0, i));
      i++;

      if (i > result.length) {
        clearInterval(interval);
        setIsTyping(false);

        if (autoSpeak) {
          setTimeout(() => speakText(result), 250);
        }
      }
    }, 18);
  };

  const handleSpeak = () => {
    speakText(adaptedText || therapistText);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsTyping(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8EE] via-[#F7EFE4] to-[#F2E4D5] px-4 py-6 text-[#2C241D]">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-white/75 px-4 py-2 text-sm font-semibold shadow-sm">
              🧸 Koda MVP Engine
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">Koda</h1>
            <p className="mt-2 max-w-2xl text-lg text-[#6E6258]">{t.subtitle}</p>
            <p className="mt-3 inline-flex rounded-full bg-[#2C241D] px-4 py-2 text-sm font-semibold text-white">
              ✨ {t.demo}
            </p>
          </div>

          <div className="rounded-3xl bg-white/85 p-4 shadow-xl">
            <label className="mb-2 block text-sm font-bold">{t.language}</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange("es")}
                className={`rounded-2xl px-4 py-2 font-bold ${
                  language === "es" ? "bg-[#2C241D] text-white" : "bg-[#FFF1DC]"
                }`}
              >
                Español
              </button>

              <button
                onClick={() => handleLanguageChange("en")}
                className={`rounded-2xl px-4 py-2 font-bold ${
                  language === "en" ? "bg-[#2C241D] text-white" : "bg-[#FFF1DC]"
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
                <span className="mb-2 block text-sm font-semibold text-[#6E6258]">{t.childName}</span>
                <input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-[#6E6258]">{t.age}</span>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]"
                />
              </label>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-semibold text-[#6E6258]">{t.character}</span>

              <div className="grid gap-3 md:grid-cols-3">
                {characterOptions.map((option) => (
                  <button
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
              <span className="mb-2 block text-sm font-semibold text-[#6E6258]">{t.intention}</span>
              <select
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]"
              >
                {intentions[language].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="mt-5 flex items-center gap-3 rounded-2xl bg-[#FFF1DC] p-4 text-sm font-semibold">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
              />
              {t.autoSpeak}
            </label>

            <div className="mt-5 rounded-3xl bg-[#F7E7D1] p-4 text-sm leading-relaxed text-[#6E4F36]">
              🛡️ {t.safety}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/85 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">✨ {t.engine}</h2>
              <div className={`rounded-full px-3 py-1 text-sm font-bold ${isSpeaking ? "bg-green-100 text-green-700" : "bg-[#FFF1DC]"}`}>
                {isSpeaking ? "🔊 Speaking" : "Ready"}
              </div>
            </div>

            <label>
              <span className="mb-2 block text-sm font-semibold text-[#6E6258]">{t.therapistPhrase}</span>
              <textarea
                value={therapistText}
                onChange={(e) => setTherapistText(e.target.value)}
                className="min-h-40 w-full resize-none rounded-3xl border border-[#E7D8C5] bg-white px-5 py-4 text-base outline-none focus:border-[#C58E55]"
                placeholder={t.placeholder}
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAdapt}
                className="rounded-2xl bg-[#2C241D] px-5 py-3 font-bold text-white shadow-lg hover:bg-[#46382C]"
              >
                ✨ {t.adapt}
              </button>

              <button
                onClick={handleSpeak}
                className="rounded-2xl bg-[#FFE3B8] px-5 py-3 font-bold text-[#2C241D] shadow-md hover:bg-[#FFD99E]"
              >
                🔊 {t.speak}
              </button>

              {(isSpeaking || isTyping) && (
                <button
                  onClick={handleStop}
                  className="rounded-2xl border border-[#D8B489] px-5 py-3 font-bold"
                >
                  {t.stop}
                </button>
              )}
            </div>

            <div className="mt-5 rounded-[2rem] bg-[#2C241D] p-6 text-white shadow-inner">
              <div className="mb-4 flex items-center gap-4">
                <div className={`grid h-16 w-16 place-items-center rounded-3xl bg-white/15 text-4xl ${isSpeaking ? "animate-pulse" : ""}`}>
                  {character.emoji}
                </div>
                <div>
                  <p className="text-sm text-white/60">{t.kodaWouldSay}</p>
                  <p className="text-lg font-bold">
                    {language === "es" ? character.es : character.en}
                  </p>
                </div>
              </div>

              <p className="min-h-28 text-xl leading-relaxed text-white/90">
                {adaptedText || t.empty}
                {isTyping && <span className="ml-1 animate-pulse">✨</span>}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}