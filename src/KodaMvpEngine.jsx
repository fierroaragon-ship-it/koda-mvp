import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Volume2, Wand2, Baby, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const characterOptions = [
  { id: 'bear', label: 'Osito Koda', emoji: '🧸', tone: 'tierno, cálido y protector' },
  { id: 'girl', label: 'Niña Koda', emoji: '👧', tone: 'dulce, cercana y juguetona' },
  { id: 'boy', label: 'Niño Koda', emoji: '👦', tone: 'amigable, curioso y tranquilo' },
]

const emotionOptions = [
  'Neutro',
  'Tranquilizar',
  'Animar',
  'Explorar emoción',
  'Romper el hielo',
  'Validar tristeza',
  'Validar miedo',
]

function adaptMessage({ text, childName, intention }) {
  const clean = text.trim()
  const name = childName?.trim() || 'peque'

  if (!clean) return ''

  const softOpeners = {
    Neutro: `Holaaa ${name} 😊`,
    Tranquilizar: `${name}, está bien, respira conmigo tantito 🌿`,
    Animar: `Oye ${name}, tengo una preguntita valiente para ti ✨`,
    'Explorar emoción': `${name}, quiero entender tu corazón un poquito 🧡`,
    'Romper el hielo': `Pss pss, ${name}... soy Koda y tengo curiosidad 🧸`,
    'Validar tristeza': `${name}, si hoy te sentiste triste, no pasa nada, aquí estoy contigo 💛`,
    'Validar miedo': `${name}, a veces sentir miedo se siente grandote, pero no estás solito 🌙`,
  }

  const opener = softOpeners[intention] || softOpeners.Neutro
  const lower = clean.toLowerCase()

  if (lower.includes('cómo te sentiste') || lower.includes('como te sentiste')) {
    return `${opener}. ¿Me cuentas con calma cómo se sintió tu corazoncito hoy? Puede ser poquito, no tienes que decir todo de una vez.`
  }

  if (lower.includes('por qué') || lower.includes('porque')) {
    return `${opener}. ¿Me ayudas a entender qué pasó? No te voy a regañar, solo quiero escucharte.`
  }

  if (lower.includes('mamá') || lower.includes('mama') || lower.includes('papá') || lower.includes('papa')) {
    return `${opener}. Cuando piensas en eso de tu familia, ¿qué siente tu pancita o tu corazón?`
  }

  if (lower.includes('miedo')) {
    return `${opener}. El miedo a veces parece enorme, como una sombra grande. ¿Quieres contarme qué parte te asustó más?`
  }

  if (lower.includes('triste') || lower.includes('llorar')) {
    return `${opener}. A veces llorar es la forma en que el corazón habla. ¿Quieres contarme qué le dolió a tu corazón?`
  }

  return `${opener}. ${clean.replace(/\?*$/, '')}... pero me lo puedes contar a tu manera, despacito, como tú quieras.`
}

export default function KodaMvpEngine() {
  const [childName, setChildName] = useState('Sofi')
  const [age, setAge] = useState('7')
  const [characterId, setCharacterId] = useState('bear')
  const [intention, setIntention] = useState('Explorar emoción')
  const [therapistText, setTherapistText] = useState('¿Cómo te sentiste hoy?')
  const [adaptedText, setAdaptedText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const character = useMemo(
    () => characterOptions.find((item) => item.id === characterId) || characterOptions[0],
    [characterId]
  )

  const handleAdapt = () => {
    const result = adaptMessage({ text: therapistText, childName, age, character, intention })
    setAdaptedText(result)
  }

  const handleSpeak = () => {
    const textToSpeak = adaptedText || therapistText
    if (!textToSpeak.trim() || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'es-MX'
    utterance.rate = 0.92
    utterance.pitch = characterId === 'bear' ? 1.18 : 1.28
    utterance.volume = 1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <main className="min-h-screen bg-[#F8F3EA] text-[#2C241D]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 md:px-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium shadow-sm">
              <Heart className="h-4 w-4" /> Koda MVP Engine v1
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Koda</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#6E6258] md:text-lg">
              Un puente emocional entre el terapeuta y el niño: escribe una frase, Koda la suaviza y la dice con una voz amable.
            </p>
          </div>

          <Card className="rounded-3xl border-none bg-white/75 shadow-lg backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#FFE3B8] text-4xl shadow-inner">
                {character.emoji}
              </div>
              <div>
                <p className="text-sm text-[#7C7066]">Personaje activo</p>
                <p className="text-lg font-semibold">{character.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid flex-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
            <Card className="h-full rounded-[2rem] border-none bg-white/80 shadow-xl backdrop-blur">
              <CardContent className="space-y-5 p-5 md:p-7">
                <div className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  <h2 className="text-xl font-bold">Datos rápidos</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#6E6258]">Nombre del niño</span>
                    <input value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#C58E55]" placeholder="Ej. Sofi" />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#6E6258]">Edad</span>
                    <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#C58E55]" placeholder="Ej. 7" />
                  </label>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-[#6E6258]">Personaje</span>
                  <div className="grid gap-3 md:grid-cols-3">
                    {characterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setCharacterId(option.id)}
                        className={`rounded-2xl border px-3 py-4 text-left transition ${
                          characterId === option.id ? 'border-[#C58E55] bg-[#FFF1DC] shadow-md' : 'border-[#E7D8C5] bg-[#FFFDF9] hover:bg-[#FFF7EC]'
                        }`}
                      >
                        <div className="text-3xl">{option.emoji}</div>
                        <div className="mt-2 text-sm font-semibold">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[#6E6258]">Intención terapéutica</span>
                  <select value={intention} onChange={(e) => setIntention(e.target.value)} className="w-full rounded-2xl border border-[#E7D8C5] bg-[#FFFDF9] px-4 py-3 outline-none transition focus:border-[#C58E55]">
                    {emotionOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <div className="rounded-3xl bg-[#F7E7D1] p-4 text-sm leading-relaxed text-[#6E4F36]">
                  <div className="mb-1 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" /> Principio de seguridad
                  </div>
                  Koda no sustituye al terapeuta. Solo ayuda a convertir una frase clínica en una frase más amable y comprensible para el niño.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}>
            <Card className="h-full rounded-[2rem] border-none bg-white/80 shadow-xl backdrop-blur">
              <CardContent className="flex h-full flex-col gap-5 p-5 md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    <h2 className="text-xl font-bold">Motor de frase</h2>
                  </div>
                  <div className="hidden rounded-full bg-[#F2E3D0] px-3 py-1 text-xs font-semibold text-[#7C5A3B] md:block">Texto → Koda → Voz</div>
                </div>

                <label className="flex flex-1 flex-col gap-2">
                  <span className="text-sm font-medium text-[#6E6258]">Frase del terapeuta</span>
                  <textarea value={therapistText} onChange={(e) => setTherapistText(e.target.value)} className="min-h-36 flex-1 resize-none rounded-3xl border border-[#E7D8C5] bg-[#FFFDF9] px-5 py-4 text-base leading-relaxed outline-none transition focus:border-[#C58E55]" placeholder="Escribe aquí lo que quieres preguntarle al niño..." />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleAdapt} className="h-12 rounded-2xl px-5">
                    <Sparkles className="mr-2 h-4 w-4" /> Adaptar con Koda
                  </Button>
                  <Button onClick={handleSpeak} variant="secondary" className="h-12 rounded-2xl px-5">
                    <Volume2 className="mr-2 h-4 w-4" /> Reproducir voz
                  </Button>
                  {isSpeaking && <Button onClick={handleStop} variant="outline" className="h-12 rounded-2xl px-5">Detener</Button>}
                </div>

                <div className="rounded-[2rem] bg-[#2C241D] p-5 text-white shadow-inner md:p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-3xl">{character.emoji}</div>
                    <div>
                      <p className="text-sm text-white/60">Koda diría:</p>
                      <p className="font-semibold">{character.label}</p>
                    </div>
                  </div>

                  <p className="min-h-24 text-lg leading-relaxed text-white/90">{adaptedText || 'Aquí aparecerá la frase adaptada para el niño.'}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
