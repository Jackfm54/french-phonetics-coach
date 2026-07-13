/**
 * Diff palabra-por-palabra para comparar lo que el alumno DIJO contra lo
 * que se ESPERABA que dijera. Usa LCS (Longest Common Subsequence) sobre
 * tokens normalizados (minúsculas, sin tildes, sin puntuación).
 *
 * Marca omisiones, palabras extra y errores, y añade una pista fonética
 * cuando la palabra dicha suena parecido pero contiene un fonema que
 * suele confundir a hispanohablantes (/y/-/u/, e/ε, o/ɔ, nasales, etc.).
 */

export type DiffStatus = "ok" | "missing" | "wrong" | "extra";
export type DiffToken = {
  /** Texto tal cual aparece (con acentos y mayúsculas) del lado correspondiente. */
  text: string;
  /** ok = coincide, missing = falta (estaba en expected), wrong = dicho pero diferente, extra = dijo de más. */
  status: DiffStatus;
  /** Pista para el alumno (español) si detectamos un fonema problemático. */
  hint?: string;
};

export type DiffResult = {
  tokens: DiffToken[];
  /** Ratio de palabras esperadas que fueron dichas correctamente (0-1). */
  accuracy: number;
  /** Palabras problemáticas (para tarjetas de repaso). */
  problems: Array<{ expected: string; said: string; hint?: string }>;
};

export function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}'-]/gu, "")
    .trim();
}

function tokenize(s: string): string[] {
  return s
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** LCS clásico sobre tokens normalizados. Devuelve la tabla y reconstruye el camino. */
function diffTokens(expected: string[], said: string[]): DiffToken[] {
  const en = expected.map(normalizeToken);
  const sn = said.map(normalizeToken);
  const m = en.length;
  const n = sn.length;
  // dp[i][j] = longitud LCS de en[i..] y sn[j..]
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (en[i] && en[i] === sn[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (en[i] && en[i] === sn[j]) {
      out.push({ text: expected[i], status: "ok" });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      // Palabra esperada no encontrada en el orden -> ¿la dijo mal después?
      // Si la siguiente dicha es parecida, la marcamos como wrong; si no, missing.
      const nextSaid = sn[j];
      if (nextSaid && similar(en[i], nextSaid)) {
        out.push({
          text: `${expected[i]} → ${said[j]}`,
          status: "wrong",
          hint: phonemeHint(expected[i], said[j]),
        });
        i++;
        j++;
      } else {
        out.push({ text: expected[i], status: "missing" });
        i++;
      }
    } else {
      out.push({ text: said[j], status: "extra" });
      j++;
    }
  }
  while (i < m) {
    out.push({ text: expected[i++], status: "missing" });
  }
  while (j < n) {
    out.push({ text: said[j++], status: "extra" });
  }
  return out;
}

/** Distancia de Levenshtein normalizada; consideramos "parecidas" si ≤ 40%. */
function similar(a: string, b: string): boolean {
  if (!a || !b) return false;
  const d = levenshtein(a, b);
  return d / Math.max(a.length, b.length) <= 0.4;
}
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

/** Pistas para hispanohablantes cuando dice mal una palabra francesa. */
function phonemeHint(expected: string, said: string): string | undefined {
  const e = expected.toLowerCase();
  const s = said.toLowerCase();
  if (/[uùû]/.test(e) && /[oú]/.test(s))
    return "Cuidado con /u/ vs /y/: proyecta los labios como para decir « ou » francés.";
  if (/[yû]|tu|rue|lune|nul/.test(e) && /(u|o)/.test(s))
    return "El sonido /y/ (« tu, rue ») no existe en español: labios de « u » + lengua de « i ».";
  if (/(an|en|em|am)/.test(e) && !/(an|en)/.test(s))
    return "Nasal /ɑ̃/: aire por la nariz, boca abierta como « an ».";
  if (/(on|om)/.test(e) && !/(on|om)/.test(s))
    return "Nasal /ɔ̃/: labios redondeados, aire por la nariz.";
  if (/(in|im|ain|ein)/.test(e) && !/(in|ain)/.test(s))
    return "Nasal /ɛ̃/: boca muy abierta como « an » pero con lengua adelante.";
  if (/(eu|œu|œ)/.test(e))
    return "Vocal /ø/ o /œ/: labios redondeados, lengua adelante (como decir « e » con boca de « o »).";
  if (/(ch)/.test(e) && /(sh|s|ch)/.test(s) && !s.includes("ch"))
    return "« ch » en francés = /ʃ/, siempre como « sh » del inglés « she », nunca /tʃ/.";
  if (/(j|ge|gi)/.test(e) && /(y|dj|dy|h)/.test(s))
    return "« j / ge / gi » = /ʒ/, como la « ll » argentina de « playa » suavizada.";
  if (/r/.test(e))
    return "La « r » francesa se articula en la garganta (/ʁ/), no vibra como en español.";
  return undefined;
}

export function diffFrench(expected: string, said: string): DiffResult {
  const tokens = diffTokens(tokenize(expected), tokenize(said));
  const expectedCount = tokens.filter((t) => t.status === "ok" || t.status === "missing" || t.status === "wrong").length;
  const okCount = tokens.filter((t) => t.status === "ok").length;
  const accuracy = expectedCount === 0 ? 0 : okCount / expectedCount;
  const problems = tokens
    .filter((t) => t.status === "wrong" || t.status === "missing")
    .map((t) => {
      const [exp, saidW] = t.text.includes("→")
        ? t.text.split("→").map((x) => x.trim())
        : [t.text, ""];
      return { expected: exp, said: saidW, hint: t.hint };
    });
  return { tokens, accuracy, problems };
}
