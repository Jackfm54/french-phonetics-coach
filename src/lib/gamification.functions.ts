import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AwardSchema = z.object({
  xp: z.number().int().min(0).max(500).default(10),
  reason: z.string().max(80).optional(),
});

/** Suma XP y actualiza racha diaria. Devuelve el estado actualizado + badges nuevos. */
export const awardXp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AwardSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: current } = await supabase
      .from("user_stats")
      .select("xp, streak_days, best_streak, last_active_on")
      .eq("user_id", userId)
      .maybeSingle();

    const today = new Date().toISOString().slice(0, 10);
    let streak = 1;
    let best = 1;

    if (current) {
      const last = current.last_active_on;
      if (last === today) {
        streak = current.streak_days;
      } else if (last && daysBetween(last, today) === 1) {
        streak = current.streak_days + 1;
      } else {
        streak = 1;
      }
      best = Math.max(current.best_streak, streak);
    }

    const newXp = (current?.xp ?? 0) + data.xp;

    const { error } = await supabase.from("user_stats").upsert(
      {
        user_id: userId,
        xp: newXp,
        streak_days: streak,
        best_streak: best,
        last_active_on: today,
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);

    // Badges automáticos
    const badges = computeNewBadges(newXp, streak);
    const newBadges: string[] = [];
    if (badges.length) {
      const { data: existing } = await supabase
        .from("badges_earned")
        .select("badge_code")
        .eq("user_id", userId);
      const have = new Set((existing ?? []).map((b) => b.badge_code));
      for (const b of badges) {
        if (!have.has(b)) {
          await supabase.from("badges_earned").insert({ user_id: userId, badge_code: b });
          newBadges.push(b);
        }
      }
    }

    return { xp: newXp, streak, best_streak: best, newBadges };
  });

export const getUserStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [statsRes, badgesRes] = await Promise.all([
      supabase
        .from("user_stats")
        .select("xp, streak_days, best_streak, last_active_on")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("badges_earned")
        .select("badge_code, earned_at")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false }),
    ]);
    return {
      stats: statsRes.data ?? { xp: 0, streak_days: 0, best_streak: 0, last_active_on: null },
      badges: badgesRes.data ?? [],
    };
  });

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86400000);
}

function computeNewBadges(xp: number, streak: number): string[] {
  const out: string[] = [];
  if (xp >= 100) out.push("xp_100");
  if (xp >= 500) out.push("xp_500");
  if (xp >= 1000) out.push("xp_1000");
  if (xp >= 5000) out.push("xp_5000");
  if (streak >= 3) out.push("streak_3");
  if (streak >= 7) out.push("streak_7");
  if (streak >= 30) out.push("streak_30");
  if (streak >= 100) out.push("streak_100");
  return out;
}

export const BADGES: Record<string, { label: string; emoji: string }> = {
  xp_100: { label: "Primeros 100 XP", emoji: "⭐" },
  xp_500: { label: "500 XP", emoji: "🌟" },
  xp_1000: { label: "1 000 XP", emoji: "💫" },
  xp_5000: { label: "5 000 XP", emoji: "🏆" },
  streak_3: { label: "Racha de 3 días", emoji: "🔥" },
  streak_7: { label: "Semana perfecta", emoji: "🔥" },
  streak_30: { label: "Mes completo", emoji: "🚀" },
  streak_100: { label: "100 días seguidos", emoji: "👑" },
};
