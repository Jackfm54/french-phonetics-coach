# Plan — 6 mejoras profesionales

Son 6 features grandes. Las agrupo en 3 fases para poder verificar cada bloque antes de seguir. Confirma o reordena y arranco por la Fase 1.

## Fase 1 — Precisión de la práctica oral (fundamento)

**1. Transcripción profesional con ElevenLabs Scribe**
- Endpoint server `POST /api/stt` que recibe audio (WAV/webm) y llama a `scribe_v2` con `language_code: fra`, `diarize: false`, `tag_audio_events: false`.
- Nuevo hook `useScribeRecorder` que graba PCM→WAV (Web Audio API, 16 kHz mono) y sube al endpoint. Reemplaza `useSpeechRecognition` en `PronunciationPractice`, `chat`, `InteractiveExercises` y el runner de simulacros. Se mantiene `useSpeechRecognition` como fallback si el navegador no soporta `getUserMedia` o el usuario está offline.
- Guarda cada intento (audio + transcripción + contexto) en tabla `practice_attempts` (Lovable Cloud) para el panel del profesor y el historial del alumno.

**2. Corrección palabra por palabra**
- Nuevo util `src/lib/diff-fr.ts`: normaliza (minúsculas, sin tildes, sin puntuación), tokeniza y hace diff LCS entre `expected` y `said`. Devuelve `{ word, status: "ok"|"missing"|"wrong"|"extra", ipaHint? }`.
- Detecta fonemas problemáticos comparando la palabra dicha vs esperada con el mapa IPA existente (nasales, /y/ vs /u/, /ʃ/ vs /s/, e/ε, o/ɔ).
- Nuevo componente `<WordDiff/>` que renderiza cada token con color (verde ok, rojo error, tachado si sobra, amarillo si falta) y tooltip con la pista fonética. Se integra en `PronunciationPractice` y en cada tarea del simulacro que tenga texto de referencia.

## Fase 2 — Simulacros más realistas

**3. Simulacro de comprensión oral (TCF/DELF)**
- Nueva ruta `/simulacros/comprehension` + `/simulacros/comprehension/$examId`.
- Nuevo archivo `src/lib/listening-exams.ts` con 4-6 audios por nivel (A1→C2). Los audios se generan con ElevenLabs TTS (voz `Charlie` o `Sarah`) en build o al vuelo y se cachean en Storage bucket `listening-audio`.
- Cada tarea = audio + 3-5 preguntas de opción múltiple con corrección automática y baremo oficial. Se guarda el resultado en `practice_attempts` con `kind = "listening"`.

**4. Modo examinateur (preguntas de seguimiento)**
- Nuevo server fn `askFollowUp` en `src/lib/exam-examiner.functions.ts` que recibe la transcripción del candidato + tarea y devuelve la siguiente pregunta del examinador (`gemini-2.5-flash`, prompt "actúa como jury DELF/TCF, haz UNA pregunta corta de seguimiento").
- En `simulacros.$examId.tsx`, tras cada respuesta hablada del alumno el examinador reacciona con TTS (ElevenLabs) y añade tiempo. Máx 2-3 follow-ups por tarea. La evaluación final considera toda la conversación.

## Fase 3 — Escalabilidad producto

**5. Panel de profesor / academia**
- Auth ya activada. Añadir `user_roles` (`app_role` enum: `student`, `teacher`, `admin`) + función `has_role`.
- Tabla `classroom_members(teacher_id, student_id)` para que un profe invite alumnos por email.
- Nueva ruta `/_authenticated/professeur` con:
  - Lista de alumnos, último acceso, nº intentos.
  - Detalle por alumno: histórico de `practice_attempts`, nota media por competencia (fluidez, léxico, fonología, morfosintaxis), progreso CECRL.
  - Exportar CSV.
- RLS: profesor ve solo alumnos de su `classroom_members`.

**6. PWA / app móvil offline**
- Manifest + iconos + `display: standalone` (installability).
- Service worker via `vite-plugin-pwa` con `generateSW`, `NetworkFirst` para HTML, `CacheFirst` para assets y precache de las lecciones fonéticas A1-C2 (JSON + audios TTS pre-generados) para que funcionen sin conexión.
- Guarda para no registrar el SW en previews de Lovable.
- Los simulacros y el chat IA requieren red — mostrar banner "necesita conexión" cuando `!navigator.onLine`.

## Detalles técnicos clave

- Todas las llamadas a ElevenLabs pasan por server functions con `ELEVENLABS_API_KEY` (ya está en secrets).
- Migraciones nuevas: `practice_attempts`, `user_roles`, `classroom_members`, `listening_results`, bucket `practice-audio` y `listening-audio` con RLS por `auth.uid()`.
- El fallback a Web Speech API se mantiene para no romper la UX si Scribe falla.

## Preguntas antes de arrancar

1. ¿Empiezo por la Fase 1 completa (Scribe + diff palabra por palabra) y te la enseño antes de seguir, o prefieres las 6 en el mismo push?
2. Para el panel del profesor: ¿los profes invitan alumnos por email (magic link) o los alumnos se autoinscriben con un código de clase?
3. Para la PWA offline: ¿precacho también los ejercicios interactivos (dictados, discriminación) o solo la tabla fonética y las lecciones?
