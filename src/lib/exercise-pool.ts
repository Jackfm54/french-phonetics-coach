import type { Exercise, Lesson } from "./lessons";
import { lessons } from "./lessons";

const TARGET_COUNT = 15;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueBy<T>(arr: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}

function exerciseKey(ex: Exercise): string {
  switch (ex.type) {
    case "discrimination":
      return `d:${ex.audio}:${ex.answer}`;
    case "transcription":
      return `t:${ex.word}:${ex.answer}`;
    case "dictee":
      return `k:${ex.audio}:${ex.answer}`;
    case "repeat":
      return `r:${ex.target}`;
  }
}

/** Palabras "distractoras" tomadas de otras lecciones para discriminación. */
function distractorPool(currentLessonId: string): string[] {
  const words: string[] = [];
  for (const l of lessons) {
    if (l.id === currentLessonId) continue;
    for (const ex of l.examples) words.push(ex.fr);
  }
  return words;
}

function pickDistractors(all: string[], answer: string, n: number): string[] {
  const norm = (s: string) => s.toLowerCase();
  const pool = shuffle(all.filter((w) => norm(w) !== norm(answer)));
  const out: string[] = [];
  for (const w of pool) {
    if (out.length >= n) break;
    if (out.some((o) => norm(o) === norm(w))) continue;
    out.push(w);
  }
  return out;
}

function pickIpaDistractors(
  lesson: Lesson,
  correct: string,
  n: number,
): string[] {
  const pool = new Set<string>();
  for (const l of lessons) {
    for (const ex of l.examples) {
      if (ex.ipa && ex.ipa !== correct) pool.add(ex.ipa);
    }
  }
  return pickDistractors(Array.from(pool), correct, n);
}

function generatedFor(lesson: Lesson): Exercise[] {
  const gen: Exercise[] = [];
  const wordPool = distractorPool(lesson.id);

  for (const ex of lesson.examples) {
    // repeat
    gen.push({
      type: "repeat",
      question: `Répète à voix haute : « ${ex.fr} »`,
      target: ex.fr,
      ipa: ex.ipa,
    });

    // dictée
    gen.push({
      type: "dictee",
      question: "Écoute et écris ce que tu entends.",
      audio: ex.fr,
      answer: ex.fr,
    });

    // transcription IPA
    if (ex.ipa) {
      const distractors = pickIpaDistractors(lesson, ex.ipa, 2);
      if (distractors.length >= 2) {
        gen.push({
          type: "transcription",
          question: `Quelle est la bonne transcription API de « ${ex.fr} » ?`,
          word: ex.fr,
          options: shuffle([ex.ipa, ...distractors]),
          answer: ex.ipa,
        });
      }
    }

    // discrimination auditive
    const distractors = pickDistractors(wordPool, ex.fr, 2);
    if (distractors.length >= 2) {
      gen.push({
        type: "discrimination",
        question: "Écoute et choisis le mot que tu entends.",
        audio: ex.fr,
        options: shuffle([ex.fr, ...distractors]),
        answer: ex.fr,
      });
    }
  }

  return gen;
}

/**
 * Construye un pool de ~15 ejercicios (o más si el usuario recarga se
 * mezclan de nuevo). Combina los ejercicios definidos manualmente en la
 * lección con ejercicios auto-generados desde `examples`.
 */
export function buildLessonExercises(
  lesson: Lesson,
  count = TARGET_COUNT,
): Exercise[] {
  const base = lesson.exercises;
  const generated = generatedFor(lesson);
  const pool = uniqueBy([...base, ...generated], exerciseKey);

  // Si aún no hay suficientes, repetimos generados con nueva mezcla.
  while (pool.length < count && generated.length > 0) {
    for (const ex of shuffle(generated)) {
      if (pool.length >= count) break;
      pool.push(ex);
    }
  }

  return shuffle(pool).slice(0, count);
}
