/**
 * SM-2 simplificado (algoritmo de repetición espaciada tipo Anki).
 * quality: 0-5. >=3 = correcto, <3 = fallo (reset).
 */
export type SrsState = {
  ease: number;
  interval_days: number;
  lapses: number;
  reviews: number;
};

export function nextSrs(state: SrsState, quality: number): SrsState {
  const q = Math.max(0, Math.min(5, quality));
  let ease = state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease < 1.3) ease = 1.3;

  let interval_days: number;
  let lapses = state.lapses;
  const reviews = state.reviews + 1;

  if (q < 3) {
    interval_days = 1;
    lapses += 1;
  } else if (reviews === 1) {
    interval_days = 1;
  } else if (reviews === 2) {
    interval_days = 6;
  } else {
    interval_days = Math.round(state.interval_days * ease);
  }
  return { ease, interval_days, lapses, reviews };
}

export function dueDateFromToday(intervalDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + intervalDays);
  return d.toISOString();
}
