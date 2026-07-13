import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SaveSchema = z.object({
  kind: z.string().max(40).default("pronunciation"),
  context: z.string().max(400).optional(),
  expectedText: z.string().max(2000).optional(),
  transcript: z.string().max(4000).optional(),
  score: z.number().min(0).max(100).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const saveAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("practice_attempts").insert({
      user_id: userId,
      kind: data.kind,
      context: data.context ?? null,
      expected_text: data.expectedText ?? null,
      transcript: data.transcript ?? null,
      score: data.score ?? null,
      details: data.details ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAttempts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("practice_attempts")
      .select("id, kind, context, expected_text, transcript, score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { attempts: data ?? [] };
  });
