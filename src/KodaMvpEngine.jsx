import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabaseClient";

const characterOptions = [
  { id: "bear", es: "Osita Koda", en: "Koda Bear", emoji: "🧸", toneEs: "tierna, cálida y protectora", toneEn: "warm, gentle and protective" },
  { id: "girl", es: "Niña Koda", en: "Koda Girl", emoji: "👧", toneEs: "dulce, cercana y juguetona", toneEn: "sweet, close and playful" },
  { id: "boy", es: "Niño Koda", en: "Koda Boy", emoji: "👦", toneEs: "amigable, curioso y tranquilo", toneEn: "friendly, curious and calm" },
];

const intentionOptions = [
  { id: "neutral", es: "Neutro", en: "Neutral" },
  { id: "calm", es: "Tranquilizar", en: "Calm" },
  { id: "encourage", es: "Animar", en: "Encourage" },
  { id: "explore", es: "Explorar emoción", en: "Explore emotion" },
  { id: "icebreaker", es: "Romper el hielo", en: "Icebreaker" },
  { id: "sadness", es: "Validar tristeza", en: "Validate sadness" },
  { id: "fear", es: "Validar miedo", en: "Validate fear" },
];

const emptyProfile = {
  name: "",
  email: "",
  specialty: "",
  country: "",
  practiceType: "",
  preferredLanguage: "es",
};

const initialSession = {
  childName: "Sofi",
  age: "7",
  characterId: "bear",
  intention: "explore",
  therapistText: "¿Cómo te sentiste hoy?",
  adaptedText: "",
  notes: "",
};

const copy = {
  es: {
    appName: "Koda",
    loading: "Preparando Koda...",
    loadingHint: "Si tarda demasiado, limpia la sesión del navegador y recarga.",
    welcomeEyebrow: "Herramienta de apoyo comunicacional",
    welcomeTitle: "Koda ayuda al profesional a hablarle al niño con lenguaje amable.",
    welcomeSubtitle: "Adapta frases clínicas o profesionales a un lenguaje cálido, claro y comprensible para niñas y niños. No diagnostica ni reemplaza al profesional.",
    createProfile: "Crear perfil profesional",
    loginProfile: "Ya tengo perfil",
    legal: "Koda no diagnostica, no trata, no prescribe y no sustituye al profesional de salud, terapia o educación infantil. Solo apoya la adaptación del lenguaje.",
    registerTitle: "Crear perfil profesional",
    loginTitle: "Entrar a Koda",
    registerSubtitle: "Usa un correo real y una contraseña de mínimo 6 caracteres.",
    loginSubtitle: "Entra con el correo y contraseña que registraste.",
    fullName: "Nombre completo",
    email: "Correo",
    password: "Contraseña",
    specialty: "Especialidad",
    country: "País",
    practiceType: "Tipo de práctica",
    preferredLanguage: "Idioma de la app",
    saveProfile: "Crear cuenta",
    loginButton: "Entrar",
    back: "Volver",
    alreadyHaveProfile: "Ya tengo perfil",
    needCreateProfile: "Necesito crear perfil",
    requiredProfile: "Completa nombre y correo.",
    requiredLogin: "Escribe correo y contraseña.",
    minPassword: "La contraseña debe tener mínimo 6 caracteres.",
    accountCreatedConfirm: "Cuenta creada. Revisa tu correo para confirmar el acceso. Después entra desde 'Ya tengo perfil'.",
    dashboardTitle: "Panel de Koda",
    dashboardSubtitle: "Elige qué quieres hacer ahora.",
    startSession: "Nueva sesión",
    history: "Registros guardados",
    editProfile: "Perfil profesional",
    signOut: "Cerrar sesión",
    activeProfessional: "Profesional activo",
    engineTitle: "Motor de adaptación",
    childData: "Datos rápidos",
    childName: "Nombre del niño/a",
    age: "Edad",
    character: "Personaje",
    intention: "Intención",
    therapistPhrase: "Frase del profesional",
    therapistPlaceholder: "Escribe aquí lo que quieres decir o preguntar...",
    adapt: "Adaptar con Koda",
    speak: "Reproducir voz",
    stop: "Detener",
    saveRecord: "Guardar registro",
    copyText: "Copiar resumen",
    downloadText: "Descargar resumen",
    kodaWouldSay: "Koda diría:",
    adaptedPlaceholder: "Aquí aparecerá la frase adaptada para el niño.",
    notes: "Notas breves",
    notesPlaceholder: "Notas internas opcionales. Evita datos sensibles si no son necesarios.",
    mustLogin: "Necesitas iniciar sesión.",
    writePhrase: "Escribe una frase primero.",
    saved: "Registro guardado correctamente.",
    copied: "Resumen copiado.",
    profileSaved: "Perfil actualizado correctamente.",
    noRecords: "Todavía no hay registros guardados.",
    refresh: "Actualizar",
    deleteLocalMessage: "Mensaje limpiado.",
    apiFallback: "No respondió la API. Usé adaptación local para no detener la demo.",
    voiceFallback: "No respondió la voz de servidor. Usé voz del navegador.",
    profileTitle: "Perfil profesional",
    updateProfile: "Actualizar perfil",
    sessionCreated: "Sesión",
  },
  en: {
    appName: "Koda",
    loading: "Preparing Koda...",
    loadingHint: "If it takes too long, clear the browser session and reload.",
    welcomeEyebrow: "Communication support tool",
    welcomeTitle: "Koda helps professionals speak to children with kinder language.",
    welcomeSubtitle: "It adapts clinical or professional phrases into warm, clear, child-friendly language. It does not diagnose or replace the professional.",
    createProfile: "Create professional profile",
    loginProfile: "I already have a profile",
    legal: "Koda does not diagnose, treat, prescribe, or replace health, therapy, or child education professionals. It only supports language adaptation.",
    registerTitle: "Create professional profile",
    loginTitle: "Log in to Koda",
    registerSubtitle: "Use a real email and a password of at least 6 characters.",
    loginSubtitle: "Log in with the email and password you registered.",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    specialty: "Specialty",
    country: "Country",
    practiceType: "Practice type",
    preferredLanguage: "App language",
    saveProfile: "Create account",
    loginButton: "Log in",
    back: "Back",
    alreadyHaveProfile: "I already have a profile",
    needCreateProfile: "I need to create a profile",
    requiredProfile: "Complete name and email.",
    requiredLogin: "Enter email and password.",
    minPassword: "Password must be at least 6 characters.",
    accountCreatedConfirm: "Account created. Check your email to confirm access. Then log in from 'I already have a profile'.",
    dashboardTitle: "Koda Dashboard",
    dashboardSubtitle: "Choose what you want to do now.",
    startSession: "New session",
    history: "Saved records",
    editProfile: "Professional profile",
    signOut: "Sign out",
    activeProfessional: "Active professional",
    engineTitle: "Adaptation engine",
    childData: "Quick data",
    childName: "Child name",
    age: "Age",
    character: "Character",
    intention: "Intention",
    therapistPhrase: "Professional phrase",
    therapistPlaceholder: "Write what you want to say or ask...",
    adapt: "Adapt with Koda",
    speak: "Play voice",
    stop: "Stop",
    saveRecord: "Save record",
    copyText: "Copy summary",
    downloadText: "Download summary",
    kodaWouldSay: "Koda would say:",
    adaptedPlaceholder: "The child-friendly phrase will appear here.",
    notes: "Brief notes",
    notesPlaceholder: "Optional internal notes. Avoid sensitive data if not necessary.",
    mustLogin: "You need to log in.",
    writePhrase: "Write a phrase first.",
    saved: "Record saved successfully.",
    copied: "Summary copied.",
    profileSaved: "Profile updated successfully.",
    noRecords: "No saved records yet.",
    refresh: "Refresh",
    deleteLocalMessage: "Message cleared.",
    apiFallback: "The API did not respond. I used local adaptation to keep the demo moving.",
    voiceFallback: "Server voice did not respond. I used browser voice.",
    profileTitle: "Professional profile",
    updateProfile: "Update profile",
    sessionCreated: "Session",
  },
};

function normalizeProfile(row, fallbackUser) {
  const metadata = fallbackUser?.user_metadata || {};

  return {
    name: row?.name || metadata.name || "Profesional Koda",
    email: row?.email || fallbackUser?.email || metadata.email || "",
    specialty: row?.specialty || metadata.specialty || "",
    country: row?.country || metadata.country || "",
    practiceType: row?.practice_type || metadata.practice_type || metadata.practiceType || "",
    preferredLanguage: row?.preferred_language || metadata.preferred_language || metadata.preferredLanguage || "es",
  };
}

function safeDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value || "";
  }
}

function localAdaptMessage({ text, childName, intention, language }) {
  const clean = (text || "").trim();
  const name = (childName || "").trim() || (language === "es" ? "peque" : "friend");

  if (!clean) return "";

  if (language === "en") {
    const openers = {
      neutral: `Hi ${name} 😊`,
      calm: `${name}, it is okay, breathe with me for a moment 🌿`,
      encourage: `Hey ${name}, I have a brave little question for you ✨`,
      explore: `${name}, I want to understand your heart a little better 🧡`,
      icebreaker: `Psst, ${name}... I am Koda and I am curious 🧸`,
      sadness: `${name}, if you felt sad today, that is okay. I am here with you 💛`,
      fear: `${name}, sometimes fear feels very big, but you are not alone 🌙`,
    };

    const opener = openers[intention] || openers.neutral;
    const lower = clean.toLowerCase();

    if (lower.includes("how did you feel")) {
      return `${opener}. Can you tell me slowly how your little heart felt today? You can say just a little bit.`;
    }
    if (lower.includes("why")) {
      return `${opener}. Can you help me understand what happened? I am not here to scold you, only to listen.`;
    }
    if (lower.includes("mom") || lower.includes("dad") || lower.includes("family")) {
      return `${opener}. When you think about your family, what does your tummy or your heart feel?`;
    }
    if (lower.includes("fear") || lower.includes("scared")) {
      return `${opener}. Fear can feel like a big shadow. Would you like to tell me which part felt scary?`;
    }
    if (lower.includes("sad") || lower.includes("cry")) {
      return `${opener}. Sometimes crying is the way the heart talks. Would you like to tell me what hurt your heart?`;
    }

    return `${opener}. ${clean.replace(/\?*$/, "")}... and you can tell me in your own way, slowly, however you want.`;
  }

  const openers = {
    neutral: `Holaaa ${name} 😊`,
    calm: `${name}, está bien, respira conmigo tantito 🌿`,
    encourage: `Oye ${name}, tengo una preguntita valiente para ti ✨`,
    explore: `${name}, quiero entender tu corazón un poquito 🧡`,
    icebreaker: `Pss pss, ${name}... soy Koda y tengo curiosidad 🧸`,
    sadness: `${name}, si hoy te sentiste triste, no pasa nada, aquí estoy contigo 💛`,
    fear: `${name}, a veces sentir miedo se siente grandote, pero no estás solito 🌙`,
  };

  const opener = openers[intention] || openers.neutral;
  const lower = clean.toLowerCase();

  if (lower.includes("cómo te sentiste") || lower.includes("como te sentiste")) {
    return `${opener}. ¿Me cuentas con calma cómo se sintió tu corazoncito hoy? Puede ser poquito, no tienes que decir todo de una vez.`;
  }
  if (lower.includes("por qué") || lower.includes("porque")) {
    return `${opener}. ¿Me ayudas a entender qué pasó? No te voy a regañar, solo quiero escucharte.`;
  }
  if (lower.includes("mamá") || lower.includes("mama") || lower.includes("papá") || lower.includes("papa") || lower.includes("familia")) {
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

function AppShell({ children }) {
  return <main className="min-h-screen bg-gradient-to-br from-[#FFF8EE] via-[#F7EFE4] to-[#F2E4D5] text-[#2C241D]">{children}</main>;
}

function TopBar({ language, setLanguage, user, profile, onDashboard, onProfile, onHistory, onSignOut, labels }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-4 md:flex-row md:items-center md:justify-between md:px-8 md:pt-6">
      <button type="button" onClick={onDashboard} className="flex items-center gap-3 text-left">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-3xl shadow">🧸</div>
        <div>
          <p className="text-2xl font-black leading-none">Koda</p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A7464]">MVP Auth Real</p>
        </div>
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-2xl border border-[#E7D8C5] bg-white px-3 py-2 text-sm font-bold shadow-sm outline-none">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>

        {user && (
          <>
            <button type="button" onClick={onHistory} className="rounded-2xl bg-white px-4 py-2 text-sm font-black shadow-sm hover:bg-[#FFF3E4]">{labels.history}</button>
            <button type="button" onClick={onProfile} className="rounded-2xl bg-white px-4 py-2 text-sm font-black shadow-sm hover:bg-[#FFF3E4]">{labels.editProfile}</button>
            <button type="button" onClick={onSignOut} className="rounded-2xl bg-[#2C241D] px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-[#46382C]">{labels.signOut}</button>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBanner({ message, onClear }) {
  if (!message) return null;

  return (
    <div className="mx-auto mt-4 flex max-w-6xl items-start justify-between gap-3 rounded-3xl bg-white/90 px-5 py-4 text-sm font-bold text-[#6E4F36] shadow md:px-6">
      <p>{message}</p>
      <button type="button" onClick={onClear} className="rounded-full bg-[#FFF1DC] px-3 py-1 text-xs">OK</button>
    </div>
  );
}

function LoadingScreen({ labels }) {
  return (
    <AppShell>
      <section className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 text-center">
        <div className="rounded-[2.5rem] bg-white/85 p-8 shadow-2xl">
          <div className="mx-auto mb-5 grid h-24 w-24 animate-pulse place-items-center rounded-[2rem] bg-[#FFF1DC] text-6xl">🧸</div>
          <h1 className="text-3xl font-black">{labels.loading}</h1>
          <p className="mt-3 text-[#6E6258]">{labels.loadingHint}</p>
        </div>
      </section>
    </AppShell>
  );
}

function WelcomeScreen({ labels, language, setLanguage, onSignup, onLogin, message, onClear }) {
  return (
    <AppShell>
      <TopBar language={language} setLanguage={setLanguage} labels={labels} />
      <MessageBanner message={message} onClear={onClear} />

      <section className="mx-auto grid min-h-[calc(100vh-110px)] max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-black text-[#8A5A2F] shadow-sm">{labels.welcomeEyebrow}</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{labels.welcomeTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#6E6258]">{labels.welcomeSubtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onSignup} className="rounded-[2rem] bg-[#2C241D] px-7 py-4 text-lg font-black text-white shadow-xl hover:bg-[#46382C]">{labels.createProfile}</button>
            <button type="button" onClick={onLogin} className="rounded-[2rem] border border-[#E1C9AB] bg-white px-7 py-4 text-lg font-black text-[#5C4A3F] shadow-lg hover:bg-[#FFF8EE]">{labels.loginProfile}</button>
          </div>

          <p className="mt-6 rounded-3xl bg-white/70 px-5 py-4 text-sm font-semibold leading-relaxed text-[#6E6258] shadow-sm">{labels.legal}</p>
        </div>

        <div className="rounded-[3rem] bg-white/80 p-5 shadow-2xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FFF1DC]">
            <img src="/koda-cover.png" alt="Koda" className="h-[430px] w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            <div className="grid min-h-[430px] place-items-center text-8xl">🧸</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function AuthScreen({ mode, labels, language, setLanguage, initialProfile, busy, message, onClear, onBack, onSubmit, onSwitchMode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    name: initialProfile?.name || "",
    email: initialProfile?.email || "",
    password: "",
    specialty: initialProfile?.specialty || "",
    country: initialProfile?.country || "",
    practiceType: initialProfile?.practiceType || "",
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...form, email: form.email.trim().toLowerCase(), preferredLanguage: language });
  }

  return (
    <AppShell>
      <TopBar language={language} setLanguage={setLanguage} labels={labels} />
      <MessageBanner message={message} onClear={onClear} />

      <section className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <button type="button" onClick={onBack} className="mb-5 rounded-2xl bg-white/85 px-4 py-3 font-black shadow">{labels.back}</button>

        <form onSubmit={handleSubmit} className="rounded-[2.5rem] bg-white/90 p-6 shadow-2xl md:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#FFF1DC] text-5xl">🧸</div>
            <div>
              <h1 className="text-3xl font-black md:text-5xl">{isLogin ? labels.loginTitle : labels.registerTitle}</h1>
              <p className="mt-2 text-[#6E6258]">{isLogin ? labels.loginSubtitle : labels.registerSubtitle}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {!isLogin && (
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.fullName}</span>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} autoComplete="name" className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
              </label>
            )}

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.email}</span>
              <input value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" autoComplete="email" className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.password}</span>
              <input value={form.password} onChange={(event) => updateField("password", event.target.value)} type="password" autoComplete={isLogin ? "current-password" : "new-password"} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            {!isLogin && (
              <>
                <label>
                  <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.specialty}</span>
                  <input value={form.specialty} onChange={(event) => updateField("specialty", event.target.value)} placeholder="Psicología infantil / Terapia de lenguaje" className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.country}</span>
                  <input value={form.country} onChange={(event) => updateField("country", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.practiceType}</span>
                  <input value={form.practiceType} onChange={(event) => updateField("practiceType", event.target.value)} placeholder="Consulta privada / Clínica / Escuela" className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.preferredLanguage}</span>
                  <select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </>
            )}
          </div>

          <button type="submit" disabled={busy} className="mt-6 w-full rounded-[2rem] bg-[#2C241D] px-6 py-4 text-lg font-black text-white shadow-xl hover:bg-[#46382C] disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? "..." : isLogin ? labels.loginButton : labels.saveProfile}
          </button>

          <button type="button" disabled={busy} onClick={onSwitchMode} className="mt-4 w-full rounded-[2rem] border border-[#E1C9AB] bg-white px-6 py-4 text-lg font-black text-[#5C4A3F] shadow-lg hover:bg-[#FFF8EE] disabled:cursor-not-allowed disabled:opacity-60">
            {isLogin ? labels.needCreateProfile : labels.alreadyHaveProfile}
          </button>
        </form>
      </section>
    </AppShell>
  );
}

function DashboardScreen({ labels, language, setLanguage, user, profile, message, onClear, onNewSession, onHistory, onProfile, onSignOut }) {
  return (
    <AppShell>
      <TopBar language={language} setLanguage={setLanguage} user={user} profile={profile} labels={labels} onDashboard={() => {}} onProfile={onProfile} onHistory={onHistory} onSignOut={onSignOut} />
      <MessageBanner message={message} onClear={onClear} />

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="rounded-[2.5rem] bg-white/85 p-6 shadow-2xl md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A7464]">{labels.activeProfessional}</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">{labels.dashboardTitle}</h1>
          <p className="mt-3 text-lg text-[#6E6258]">{labels.dashboardSubtitle}</p>

          <div className="mt-6 rounded-3xl bg-[#FFF8EE] p-5 shadow-inner">
            <p className="text-xl font-black">{profile.name || "Profesional Koda"}</p>
            <p className="mt-1 text-[#6E6258]">{profile.email || user?.email}</p>
            <p className="mt-2 text-sm font-bold text-[#8A7464]">{[profile.specialty, profile.practiceType, profile.country].filter(Boolean).join(" · ")}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <button type="button" onClick={onNewSession} className="rounded-[2rem] bg-[#2C241D] px-6 py-8 text-left text-white shadow-xl hover:bg-[#46382C]">
              <div className="text-5xl">✨</div>
              <p className="mt-5 text-2xl font-black">{labels.startSession}</p>
            </button>

            <button type="button" onClick={onHistory} className="rounded-[2rem] bg-white px-6 py-8 text-left shadow-xl hover:bg-[#FFF8EE]">
              <div className="text-5xl">📚</div>
              <p className="mt-5 text-2xl font-black">{labels.history}</p>
            </button>

            <button type="button" onClick={onProfile} className="rounded-[2rem] bg-white px-6 py-8 text-left shadow-xl hover:bg-[#FFF8EE]">
              <div className="text-5xl">👤</div>
              <p className="mt-5 text-2xl font-black">{labels.editProfile}</p>
            </button>
          </div>

          <p className="mt-8 rounded-3xl bg-[#F7E7D1] px-5 py-4 text-sm font-semibold leading-relaxed text-[#6E4F36]">{labels.legal}</p>
        </div>
      </section>
    </AppShell>
  );
}

function EngineScreen({ labels, language, setLanguage, user, profile, session, setSession, recordsBusy, audioPlaying, message, onClear, onDashboard, onProfile, onHistory, onSignOut, onAdapt, onSpeak, onStopAudio, onSaveRecord, onCopy, onDownload }) {
  const character = characterOptions.find((item) => item.id === session.characterId) || characterOptions[0];

  function updateSession(field, value) {
    setSession((current) => ({ ...current, [field]: value }));
  }

  return (
    <AppShell>
      <TopBar language={language} setLanguage={setLanguage} user={user} profile={profile} labels={labels} onDashboard={onDashboard} onProfile={onProfile} onHistory={onHistory} onSignOut={onSignOut} />
      <MessageBanner message={message} onClear={onClear} />

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF1DC] text-3xl">🧒</div>
            <h2 className="text-2xl font-black">{labels.childData}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.childName}</span>
              <input value={session.childName} onChange={(event) => updateSession("childName", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.age}</span>
              <input value={session.age} onChange={(event) => updateSession("age", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.character}</span>
            <div className="grid gap-3 md:grid-cols-3">
              {characterOptions.map((option) => (
                <button key={option.id} type="button" onClick={() => updateSession("characterId", option.id)} className={`rounded-2xl border px-3 py-4 text-left transition ${session.characterId === option.id ? "border-[#C58E55] bg-[#FFF1DC] shadow-md" : "border-[#E7D8C5] bg-white hover:bg-[#FFF7EC]"}`}>
                  <div className="text-3xl">{option.emoji}</div>
                  <div className="mt-2 text-sm font-black">{language === "es" ? option.es : option.en}</div>
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.intention}</span>
            <select value={session.intention} onChange={(event) => updateSession("intention", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]">
              {intentionOptions.map((item) => <option key={item.id} value={item.id}>{language === "es" ? item.es : item.en}</option>)}
            </select>
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.notes}</span>
            <textarea value={session.notes} onChange={(event) => updateSession("notes", event.target.value)} placeholder={labels.notesPlaceholder} className="min-h-24 w-full resize-none rounded-3xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
          </label>

          <p className="mt-5 rounded-3xl bg-[#F7E7D1] px-5 py-4 text-sm font-semibold leading-relaxed text-[#6E4F36]">{labels.legal}</p>
        </div>

        <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF1DC] text-3xl">✨</div>
            <h2 className="text-2xl font-black">{labels.engineTitle}</h2>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.therapistPhrase}</span>
            <textarea value={session.therapistText} onChange={(event) => updateSession("therapistText", event.target.value)} placeholder={labels.therapistPlaceholder} className="min-h-36 w-full resize-none rounded-3xl border border-[#E7D8C5] bg-white px-5 py-4 text-base leading-relaxed outline-none focus:border-[#C58E55]" />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={onAdapt} disabled={recordsBusy} className="rounded-2xl bg-[#2C241D] px-5 py-3 font-black text-white shadow hover:bg-[#46382C] disabled:opacity-60">{recordsBusy ? "..." : labels.adapt}</button>
            <button type="button" onClick={onSpeak} className="rounded-2xl bg-[#FFF1DC] px-5 py-3 font-black text-[#5C4A3F] shadow hover:bg-[#FFE5BD]">{labels.speak}</button>
            {audioPlaying && <button type="button" onClick={onStopAudio} className="rounded-2xl bg-white px-5 py-3 font-black shadow hover:bg-[#FFF8EE]">{labels.stop}</button>}
          </div>

          <div className="mt-5 rounded-[2rem] bg-[#2C241D] p-5 text-white shadow-inner md:p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-3xl">{character.emoji}</div>
              <div>
                <p className="text-sm text-white/60">{labels.kodaWouldSay}</p>
                <p className="font-black">{language === "es" ? character.es : character.en}</p>
              </div>
            </div>
            <p className="min-h-28 text-lg leading-relaxed text-white/90">{session.adaptedText || labels.adaptedPlaceholder}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={onSaveRecord} disabled={recordsBusy} className="rounded-2xl bg-white px-4 py-3 font-black shadow hover:bg-[#FFF8EE] disabled:opacity-60">{labels.saveRecord}</button>
            <button type="button" onClick={onCopy} className="rounded-2xl bg-white px-4 py-3 font-black shadow hover:bg-[#FFF8EE]">{labels.copyText}</button>
            <button type="button" onClick={onDownload} className="rounded-2xl bg-white px-4 py-3 font-black shadow hover:bg-[#FFF8EE]">{labels.downloadText}</button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function HistoryScreen({ labels, language, setLanguage, user, profile, records, busy, message, onClear, onDashboard, onProfile, onHistory, onSignOut, onRefresh }) {
  return (
    <AppShell>
      <TopBar language={language} setLanguage={setLanguage} user={user} profile={profile} labels={labels} onDashboard={onDashboard} onProfile={onProfile} onHistory={onHistory} onSignOut={onSignOut} />
      <MessageBanner message={message} onClear={onClear} />

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-black">{labels.history}</h1>
              <p className="mt-2 text-[#6E6258]">{records.length} {language === "es" ? "registros" : "records"}</p>
            </div>
            <button type="button" onClick={onRefresh} disabled={busy} className="rounded-2xl bg-[#2C241D] px-5 py-3 font-black text-white shadow disabled:opacity-60">{busy ? "..." : labels.refresh}</button>
          </div>

          <div className="mt-6 space-y-4">
            {!records.length && <p className="rounded-3xl bg-[#FFF8EE] px-5 py-8 text-center font-bold text-[#6E6258]">{labels.noRecords}</p>}

            {records.map((record) => (
              <article key={record.id} className="rounded-3xl bg-white p-5 shadow">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xl font-black">{record.child_name || "Sin nombre"} · {record.age || ""}</p>
                    <p className="text-sm font-bold text-[#8A7464]">{safeDate(record.created_at)}</p>
                  </div>
                  <p className="rounded-full bg-[#FFF1DC] px-3 py-1 text-xs font-black text-[#6E4F36]">{record.intention}</p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#FFF8EE] p-4">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-[#8A7464]">Original</p>
                    <p className="text-sm leading-relaxed">{record.therapist_text}</p>
                  </div>
                  <div className="rounded-2xl bg-[#2C241D] p-4 text-white">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-white/60">Koda</p>
                    <p className="text-sm leading-relaxed">{record.adapted_text}</p>
                  </div>
                </div>

                {record.notes && <p className="mt-3 rounded-2xl bg-[#F7E7D1] p-4 text-sm text-[#6E4F36]"><strong>{labels.notes}:</strong> {record.notes}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function ProfileScreen({ labels, language, setLanguage, user, profile, busy, message, onClear, onDashboard, onHistory, onSignOut, onSave }) {
  const [form, setForm] = useState(profile || emptyProfile);

  useEffect(() => {
    setForm(profile || emptyProfile);
  }, [profile]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({ ...form, preferredLanguage: language });
  }

  return (
    <AppShell>
      <TopBar language={language} setLanguage={setLanguage} user={user} profile={profile} labels={labels} onDashboard={onDashboard} onProfile={() => {}} onHistory={onHistory} onSignOut={onSignOut} />
      <MessageBanner message={message} onClear={onClear} />

      <section className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <form onSubmit={handleSubmit} className="rounded-[2.5rem] bg-white/90 p-6 shadow-2xl md:p-8">
          <h1 className="text-4xl font-black">{labels.profileTitle}</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.fullName}</span>
              <input value={form.name || ""} onChange={(event) => updateField("name", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.email}</span>
              <input value={form.email || user?.email || ""} onChange={(event) => updateField("email", event.target.value)} type="email" className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.specialty}</span>
              <input value={form.specialty || ""} onChange={(event) => updateField("specialty", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.country}</span>
              <input value={form.country || ""} onChange={(event) => updateField("country", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-[#6E6258]">{labels.practiceType}</span>
              <input value={form.practiceType || ""} onChange={(event) => updateField("practiceType", event.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 py-3 outline-none focus:border-[#C58E55]" />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={busy} className="rounded-[2rem] bg-[#2C241D] px-6 py-4 font-black text-white shadow-xl disabled:opacity-60">{busy ? "..." : labels.updateProfile}</button>
            <button type="button" onClick={onDashboard} className="rounded-[2rem] border border-[#E1C9AB] bg-white px-6 py-4 font-black text-[#5C4A3F] shadow-lg">{labels.back}</button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}

export default function KodaMvpEngine() {
  const [language, setLanguage] = useState("es");
  const labels = copy[language] || copy.es;

  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recordsBusy, setRecordsBusy] = useState(false);
  const [screen, setScreen] = useState("welcome");
  const [authMode, setAuthMode] = useState("signup");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(emptyProfile);
  const [records, setRecords] = useState([]);
  const [session, setSession] = useState(initialSession);
  const [message, setMessage] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  const selectedCharacter = useMemo(
    () => characterOptions.find((item) => item.id === session.characterId) || characterOptions[0],
    [session.characterId]
  );

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("KODA SESSION ERROR:", error);
          if (mounted) setMessage(error.message);
        }

        if (!mounted) return;

        setAuthReady(true);

        if (data?.session?.user) {
          setUser(data.session.user);
          setScreen("dashboard");
          loadProfessionalData(data.session.user).catch((profileError) => console.error("KODA LOAD PROFILE ERROR:", profileError));
          loadRecords(data.session.user.id).catch((recordsError) => console.error("KODA LOAD RECORDS ERROR:", recordsError));
        } else {
          setScreen("welcome");
        }
      } catch (error) {
        console.error("KODA INIT AUTH ERROR:", error);
        if (mounted) {
          setAuthReady(true);
          setScreen("welcome");
          setMessage(error.message || "Auth error");
        }
      }
    }

    const fallbackTimer = setTimeout(() => {
      if (mounted) {
        setAuthReady(true);
        setScreen((current) => current || "welcome");
      }
    }, 2500);

    initAuth().finally(() => clearTimeout(fallbackTimer));

    const { data } = supabase.auth.onAuthStateChange((event, sessionData) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(emptyProfile);
        setRecords([]);
        setScreen("welcome");
        return;
      }

      if (event === "SIGNED_IN" && sessionData?.user) {
        setUser(sessionData.user);
        setScreen("dashboard");
        loadProfessionalData(sessionData.user).catch((error) => console.error("KODA AUTH PROFILE ERROR:", error));
        loadRecords(sessionData.user.id).catch((error) => console.error("KODA AUTH RECORDS ERROR:", error));
      }
    });

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    setProfile((current) => ({ ...current, preferredLanguage: language }));
  }, [language]);

  async function loadProfessionalData(authUser) {
    if (!authUser?.id) return;

    const { data, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle();

    if (error) {
      console.error("KODA PROFILE SELECT ERROR:", error);
      setProfile(normalizeProfile(null, authUser));
      return;
    }

    const nextProfile = normalizeProfile(data, authUser);
    setProfile(nextProfile);

    if (nextProfile.preferredLanguage === "es" || nextProfile.preferredLanguage === "en") {
      setLanguage(nextProfile.preferredLanguage);
    }
  }

  async function loadRecords(userId = user?.id) {
    if (!userId) return;

    setRecordsBusy(true);
    try {
      const { data, error } = await supabase
        .from("session_records")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(40);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("KODA RECORDS ERROR:", error);
      setMessage(error.message || "Error loading records");
    } finally {
      setRecordsBusy(false);
    }
  }

  async function createProfessionalAccount(form) {
    try {
      setBusy(true);
      setMessage("");

      if (!form.name.trim() || !form.email.trim()) {
        setMessage(labels.requiredProfile);
        return;
      }

      if (!form.password || form.password.length < 6) {
        setMessage(labels.minPassword);
        return;
      }

      const profileData = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        specialty: form.specialty.trim(),
        country: form.country.trim(),
        practice_type: form.practiceType.trim(),
        preferred_language: language,
      };

      const { data, error } = await supabase.auth.signUp({
        email: profileData.email,
        password: form.password,
        options: { data: profileData },
      });

      if (error) throw error;

      if (!data?.session) {
        setMessage(labels.accountCreatedConfirm);
        setAuthMode("login");
        return;
      }

      const authUser = data.user;
      setUser(authUser);

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authUser.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      await loadProfessionalData(authUser);
      await loadRecords(authUser.id);
      setScreen("dashboard");
    } catch (error) {
      console.error("KODA REGISTER ERROR:", error);
      setMessage(error.message || "Error creating account");
    } finally {
      setBusy(false);
    }
  }

  async function loginProfessional(form) {
    try {
      setBusy(true);
      setMessage("");

      if (!form.email.trim() || !form.password) {
        setMessage(labels.requiredLogin);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) throw error;

      if (!data?.user) {
        setMessage(language === "es" ? "Supabase no regresó usuario." : "Supabase did not return a user.");
        return;
      }

      setUser(data.user);
      setScreen("dashboard");
      await loadProfessionalData(data.user);
      await loadRecords(data.user.id);
    } catch (error) {
      console.error("KODA LOGIN ERROR:", error);
      setMessage(error.message || "Login error");
    } finally {
      setBusy(false);
    }
  }

  async function updateProfessionalProfile(form) {
    if (!user?.id) {
      setMessage(labels.mustLogin);
      return;
    }

    try {
      setBusy(true);
      setMessage("");

      if (!form.name?.trim() || !form.email?.trim()) {
        setMessage(labels.requiredProfile);
        return;
      }

      const payload = {
        id: user.id,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        specialty: form.specialty?.trim() || "",
        country: form.country?.trim() || "",
        practice_type: form.practiceType?.trim() || "",
        preferred_language: language,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;

      setProfile(normalizeProfile(payload, user));
      setMessage(labels.profileSaved);
      setScreen("dashboard");
    } catch (error) {
      console.error("KODA PROFILE UPDATE ERROR:", error);
      setMessage(error.message || "Profile error");
    } finally {
      setBusy(false);
    }
  }

  async function signOutProfessional() {
    stopAudio();
    setBusy(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(emptyProfile);
      setRecords([]);
      setScreen("welcome");
    } catch (error) {
      console.error("KODA SIGNOUT ERROR:", error);
      setMessage(error.message || "Sign out error");
    } finally {
      setBusy(false);
    }
  }

  async function adaptWithKoda() {
    if (!session.therapistText.trim()) {
      setMessage(labels.writePhrase);
      return;
    }

    setRecordsBusy(true);
    setMessage("");

    const fallback = localAdaptMessage({
      text: session.therapistText,
      childName: session.childName,
      intention: session.intention,
      language,
    });

    try {
      const response = await fetch("/api/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          childName: session.childName,
          age: session.age,
          character: selectedCharacter,
          characterId: session.characterId,
          intention: session.intention,
          therapistText: session.therapistText,
        }),
      });

      if (!response.ok) throw new Error(`API adapt ${response.status}`);

      const data = await response.json();
      const adapted = data.adaptedText || data.text || data.message || data.output || data.result || fallback;
      setSession((current) => ({ ...current, adaptedText: adapted }));
    } catch (error) {
      console.warn("KODA ADAPT FALLBACK:", error);
      setSession((current) => ({ ...current, adaptedText: fallback }));
      setMessage(labels.apiFallback);
    } finally {
      setRecordsBusy(false);
    }
  }

  function stopAudio() {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.warn("KODA STOP AUDIO ERROR:", error);
    } finally {
      setAudioPlaying(false);
    }
  }

  function cleanTextForVoice(value = "") {
    return String(value)
      .replace(/\p{Extended_Pictographic}/gu, "")
      .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
      .replace(/[\u200D\uFE0F]/g, "")
      .replace(/[•·#*_`~>\[\]{}]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function speakWithBrowser(textToSpeak) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === "es" ? "es-MX" : "en-US";
    utterance.rate = 0.92;
    utterance.pitch = session.characterId === "bear" ? 1.15 : 1.25;
    utterance.volume = 1;
    utterance.onstart = () => setAudioPlaying(true);
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  async function speakWithKoda() {
    const rawTextToSpeak = session.adaptedText || session.therapistText;
    const textToSpeak = cleanTextForVoice(rawTextToSpeak);
    if (!rawTextToSpeak.trim()) {
      setMessage(labels.writePhrase);
      return;
    }
    if (!textToSpeak.trim()) {
      setMessage(labels.writePhrase);
      return;
    }

    stopAudio();
    setMessage("");

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak, language, characterId: session.characterId }),
      });

      if (!response.ok) throw new Error(`API speak ${response.status}`);

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioRef.current = audio;
          audio.onplay = () => setAudioPlaying(true);
          audio.onended = () => setAudioPlaying(false);
          audio.onerror = () => setAudioPlaying(false);
          await audio.play();
          return;
        }
        throw new Error("No audioUrl in JSON response");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onplay = () => setAudioPlaying(true);
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => setAudioPlaying(false);
      await audio.play();
    } catch (error) {
      console.warn("KODA VOICE FALLBACK:", error);
      setMessage(labels.voiceFallback);
      await speakWithBrowser(textToSpeak);
    }
  }

  function buildSummary() {
    const character = characterOptions.find((item) => item.id === session.characterId) || characterOptions[0];
    const intention = intentionOptions.find((item) => item.id === session.intention);

    return [
      "KODA - RESUMEN DE SESIÓN",
      "",
      `${labels.activeProfessional}: ${profile.name || user?.email || ""}`,
      `${labels.childName}: ${session.childName}`,
      `${labels.age}: ${session.age}`,
      `${labels.character}: ${language === "es" ? character.es : character.en}`,
      `${labels.intention}: ${language === "es" ? intention?.es : intention?.en}`,
      "",
      `${labels.therapistPhrase}:`,
      session.therapistText,
      "",
      `${labels.kodaWouldSay}`,
      session.adaptedText,
      "",
      `${labels.notes}:`,
      session.notes || "",
      "",
      labels.legal,
    ].join("\n");
  }

  async function copyCurrentSummary() {
    try {
      await navigator.clipboard.writeText(buildSummary());
      setMessage(labels.copied);
    } catch (error) {
      console.error("KODA COPY ERROR:", error);
      setMessage(error.message || "Copy error");
    }
  }

  function downloadCurrentSummary() {
    const blob = new Blob([buildSummary()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `koda-${session.childName || "session"}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function saveSessionRecord() {
    if (!user?.id) {
      setMessage(labels.mustLogin);
      return;
    }

    if (!session.adaptedText.trim()) {
      await adaptWithKoda();
    }

    const adaptedToSave = session.adaptedText || localAdaptMessage({
      text: session.therapistText,
      childName: session.childName,
      intention: session.intention,
      language,
    });

    setRecordsBusy(true);
    setMessage("");

    try {
      const payload = {
        user_id: user.id,
        child_name: session.childName,
        age: session.age,
        language,
        character: session.characterId,
        intention: session.intention,
        therapist_text: session.therapistText,
        adapted_text: adaptedToSave,
        notes: session.notes,
      };

      const { error } = await supabase.from("session_records").insert(payload);
      if (error) throw error;

      setSession((current) => ({ ...current, adaptedText: adaptedToSave }));
      await loadRecords(user.id);
      setMessage(labels.saved);
    } catch (error) {
      console.error("KODA SAVE RECORD ERROR:", error);
      setMessage(error.message || "Save error");
    } finally {
      setRecordsBusy(false);
    }
  }

  function openSignup() {
    setAuthMode("signup");
    setMessage("");
    setScreen("auth");
  }

  function openLogin() {
    setAuthMode("login");
    setMessage("");
    setScreen("auth");
  }

  function clearMessage() {
    setMessage("");
  }

  function startNewSession() {
    setSession((current) => ({ ...initialSession, childName: current.childName || initialSession.childName, age: current.age || initialSession.age }));
    setMessage("");
    setScreen("engine");
  }

  if (!authReady) {
    return <LoadingScreen labels={labels} />;
  }

  if (screen === "auth") {
    return (
      <AuthScreen
        mode={authMode}
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        initialProfile={profile}
        busy={busy}
        message={message}
        onClear={clearMessage}
        onBack={() => setScreen("welcome")}
        onSubmit={authMode === "login" ? loginProfessional : createProfessionalAccount}
        onSwitchMode={() => {
          setMessage("");
          setAuthMode((current) => (current === "login" ? "signup" : "login"));
        }}
      />
    );
  }

  if (screen === "dashboard" && user) {
    return (
      <DashboardScreen
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        user={user}
        profile={profile}
        message={message}
        onClear={clearMessage}
        onNewSession={startNewSession}
        onHistory={() => {
          loadRecords(user.id);
          setScreen("history");
        }}
        onProfile={() => setScreen("profile")}
        onSignOut={signOutProfessional}
      />
    );
  }

  if (screen === "engine" && user) {
    return (
      <EngineScreen
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        user={user}
        profile={profile}
        session={session}
        setSession={setSession}
        recordsBusy={recordsBusy}
        audioPlaying={audioPlaying}
        message={message}
        onClear={clearMessage}
        onDashboard={() => setScreen("dashboard")}
        onProfile={() => setScreen("profile")}
        onHistory={() => {
          loadRecords(user.id);
          setScreen("history");
        }}
        onSignOut={signOutProfessional}
        onAdapt={adaptWithKoda}
        onSpeak={speakWithKoda}
        onStopAudio={stopAudio}
        onSaveRecord={saveSessionRecord}
        onCopy={copyCurrentSummary}
        onDownload={downloadCurrentSummary}
      />
    );
  }

  if (screen === "history" && user) {
    return (
      <HistoryScreen
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        user={user}
        profile={profile}
        records={records}
        busy={recordsBusy}
        message={message}
        onClear={clearMessage}
        onDashboard={() => setScreen("dashboard")}
        onProfile={() => setScreen("profile")}
        onHistory={() => setScreen("history")}
        onSignOut={signOutProfessional}
        onRefresh={() => loadRecords(user.id)}
      />
    );
  }

  if (screen === "profile" && user) {
    return (
      <ProfileScreen
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        user={user}
        profile={profile}
        busy={busy}
        message={message}
        onClear={clearMessage}
        onDashboard={() => setScreen("dashboard")}
        onHistory={() => {
          loadRecords(user.id);
          setScreen("history");
        }}
        onSignOut={signOutProfessional}
        onSave={updateProfessionalProfile}
      />
    );
  }

  return (
    <WelcomeScreen
      labels={labels}
      language={language}
      setLanguage={setLanguage}
      onSignup={openSignup}
      onLogin={openLogin}
      message={message}
      onClear={clearMessage}
    />
  );
}
