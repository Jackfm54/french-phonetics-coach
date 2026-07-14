import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { nextSrs, dueDateFromToday } from "@/lib/srs";

const UpsertSchema = z.object({
  itemType: z.enum(["phoneme", "word", "phrase", "lesson"]),
  itemRef: z.string().min(1).max(200),
  quality: z.number().int().min(0).max(5),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const reviewSrsItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpsertSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("srs_items")
      .select("id, ease, interval_days, lapses, reviews")
      .eq("user_id", userId)
      .eq("item_type", data.itemType)
      .eq("item_ref", data.itemRef)
      .maybeSingle();

    const state = existing
      ? {
          ease: Number(existing.ease),
          interval_days: existing.interval_days,
          lapses: existing.lapses,
          reviews: existing.reviews,
        }
      : { ease: 2.5, interval_days: 0, lapses: 0, reviews: 0 };

    const next = nextSrs(state, data.quality);
    const due_at = dueDateFromToday(next.interval_days);
    const last_reviewed_at = new Date().toISOString();

    if (existing) {
      const { error } = await supabase
        .from("srs_items")
        .update({
          ease: next.ease,
          interval_days: next.interval_days,
          lapses: next.lapses,
          reviews: next.reviews,
          due_at,
          last_reviewed_at,
          payload: (data.payload ?? {}) as never,
        })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("srs_items").insert({
        user_id: userId,
        item_type: data.itemType,
        item_ref: data.itemRef,
        payload: (data.payload ?? {}) as never,
        ease: next.ease,
        interval_days: next.interval_days,
        lapses: next.lapses,
        reviews: next.reviews,
        due_at,
        last_reviewed_at,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true, next_due_at: due_at };
  });

export const listDueSrsItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("srs_items")
      .select("id, item_type, item_ref, payload, ease, interval_days, lapses, reviews, due_at")
      .eq("user_id", userId)
      .lte("due_at", now)
      .order("due_at", { ascending: true })
      .limit(50);
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const srsSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const now = new Date().toISOString();
    const [dueRes, totalRes] = await Promise.all([
      supabase
        .from("srs_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .lte("due_at", now),
      supabase
        .from("srs_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);
    return { due: dueRes.count ?? 0, total: totalRes.count ?? 0 };
  });
