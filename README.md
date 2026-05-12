# Koda MVP Clean

Koda es un MVP limpio hecho con React + Vite + Tailwind.

## Qué hace

- Permite escribir una frase del terapeuta.
- Adapta la frase a un lenguaje infantil y emocionalmente seguro.
- Reproduce la frase usando voz del navegador con `speechSynthesis`.
- Incluye personajes: Osito Koda, Niña Koda y Niño Koda.

## Instalación

```bash
npm install
npm run dev
```

## Build para Vercel

```bash
npm run build
```

Vercel debe detectar automáticamente Vite.

- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist

## Próximos pasos

1. Conectar OpenAI para adaptación real.
2. Conectar TTS real con una voz infantil más natural.
3. Crear landing pública.
4. Agregar modo terapeuta seguro.
