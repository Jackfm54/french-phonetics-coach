# Roadmap · 14 funcionalidades innovadoras

Agrupo las 14 features en 4 fases por dependencias técnicas e impacto. Cada fase es entregable y verificable antes de pasar a la siguiente.

---

## Fase 1 — Retención y gamificación (base de datos + lógica)

**#4 SRS diario (repetición espaciada)**
- Nueva tabla `srs_items(user_id, item_type, item_ref, ease, interval_days, due_at, lapses)`.
- Cada error en ejercicios / simulacros / práctica de voz crea o actualiza un `srs_item`.
- Algoritmo SM-2 simplificado (bien → intervalo ×2.5, mal → reset a 1d).
- Nueva ruta `/_authenticated/revisar` con la cola del día (fonemas, palabras, frases).

**#5 Racha diaria + XP + badges + liga de aula**
- Tabla `user_stats(user_id, xp, streak_days, last_active_at)`.
- Tabla `badges_earned(user_id, badge_code, earned_at)`.
- Cada ejercicio/simulacro completado suma XP; racha se rompe si pasa >36h.
- Widget de racha en la home + tabla de clasificación en el panel del profe.

**#14 Diccionario personal inteligente**
- Tabla `vocabulary(user_id, word, ipa, definition_es, context, source, added_at, srs_item_id)`.
- Botón "guardar palabra" en chat, lecciones y transcripciones.
- Widget "palabra del día" en la home (rota entre las guardadas usando SRS).

---

## Fase 2 — Realismo conversacional (más uso de IA)

**#6 Roleplay por escenarios**
- Nuevo archivo `src/lib/roleplay-scenarios.ts` con 12 escenarios (aeropuerto, entrevista, médico, alquiler París, ciudadanía Quebec, restaurante, banco, universidad, etc.).
- Nueva ruta `/roleplay` y `/roleplay/$scenarioId`.
- El tutor IA adopta el rol con system prompt específico + voz TTS distinta por personaje.
- Al terminar, evaluación de registro (formal/informal), léxico, fluidez.

**#8 Corrección de acento regional**
- Selector en perfil: France · Québec · Belgique · Suisse.
- Cambia voz TTS (ElevenLabs voice IDs distintos) y criterios en el prompt de evaluación.
- Guardado en `profiles.preferred_accent`.

**#11 Corrector de producción escrita (PE)**
- Nueva ruta `/simulacros/ecrit`.
- Temas oficiales DELF/DALF por nivel.
- IA (gpt-5.5) devuelve baremo oficial: respeto de la consigna, coherencia, léxico, morfosintaxis; marca cada error con sugerencia.
- Se guarda en `practice_attempts` con `kind: "writing"`.

---

## Fase 3 — Análisis fonético avanzado (Web Audio + IA)

**#1 Espectrograma comparativo**
- Grabar audio del alumno + reproducir audio nativo.
- Renderizar 2 espectrogramas (FFT en canvas) superpuestos.
- Marcar en rojo zonas donde la energía por banda difiere >30%.

**#2 Shadowing guiado**
- Reproduce audio nativo con delay configurable (0.3-1s).
- Graba superpuesto al audio.
- Métricas: ritmo (WPM ratio), pausas, entonación.

**#3 Coach de entonación melódica**
- Extrae pitch (F0) del audio nativo y del alumno con librería `pitchfinder`.
- Dibuja dos curvas superpuestas en canvas.
- Puntúa por correlación de curvas (0-100).

---

## Fase 4 — Contenido premium y comunidad

**#9 Simulacro completo cronometrado 4/4 pruebas + diploma PDF**
- Nueva ruta `/simulacros/complet/$level`.
- Encadena CE (30min) → CO (25min) → PE (60min) → PO (12min) con temporizador oficial.
- Al terminar: PDF tipo diploma con logo, nivel CEFR predicho, puntuación por prueba, fecha (jsPDF).

**#10 Generador ilimitado de temas con IA**
- Server fn `generateExamTopic(examCode, taskType)` con gpt-5.5 y ejemplos oficiales en el prompt.
- Cache en tabla `generated_topics` para reutilizar.

**#12 Biblioteca de audio real (RFI Savoirs / TV5)**
- Nueva ruta `/ecoute`.
- Curación manual inicial de 30 clips (título, URL, transcripción, nivel).
- Player con transcripción interactiva: clic en palabra → definición + IPA + botón guardar al diccionario.

**#7 Avatar hablante (video)**
- Integración D-ID Talks API (o HeyGen).
- Requiere secret nuevo `DID_API_KEY`.
- Solo en roleplay premium (coste alto por minuto).

**#13 Intercambio entre alumnos moderado**
- Tabla `roleplay_sessions(id, student_a, student_b, scenario_id, status, evaluation)`.
- Profesor empareja desde el panel.
- Grabación conjunta (WebRTC básico) → IA evalúa a ambos por separado.

---

## Aspectos técnicos clave

- **Migraciones nuevas**: `srs_items`, `user_stats`, `badges_earned`, `vocabulary`, `generated_topics`, `roleplay_sessions`, columna `profiles.preferred_accent`. Todas con RLS por `auth.uid()` y GRANTs.
- **Secrets nuevos**: `DID_API_KEY` (solo Fase 4, opcional).
- **Modelos IA**: sigo con `google/gemini-2.5-flash` (chat) y `openai/gpt-5.5` (evaluaciones estructuradas). Nada nuevo requerido.
- **Librerías nuevas**: `pitchfinder` (F0), `jspdf` (diploma), `date-fns` si aún no está.
- **PWA**: cada fase suma cachés al service worker (revisiones SRS y diccionario deberían funcionar offline).

---

## Decisiones que necesito antes de arrancar Fase 1

1. **Orden**: ¿empezamos por Fase 1 completa (retención) o prefieres saltar directo a Fase 2 (roleplay + escritura) que es más "vendible"?
2. **Fase 4 avatar (#7)**: ¿lo incluyo o lo dejamos fuera? Requiere API de pago externa (D-ID ≈ $0.03/s de video).
3. **Fase 4 intercambio (#13)**: ¿es prioritario o puede esperar? Es la feature más compleja (WebRTC + moderación).
