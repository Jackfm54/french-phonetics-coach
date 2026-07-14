import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AddSchema = z.object({
  word: z.string().min(1).max(80),
  ipa: z.string().max(80).optional(),
  definitionEs: z.string().max(500).optional(),
  exampleFr: z.string().max(500).optional(),
  source: z.string().max(80).optional(),
});

export const addVocabulary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AddSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const word = data.word.trim().toLowerCase();

    // Upsert vocab
    const { data: vocab, error } = await supabase
      .from("vocabulary")
      .upsert(
        {
          user_id: userId,
          word,
          ipa: data.ipa ?? null,
          definition_es: data.definitionEs ?? null,
          example_fr: data.exampleFr ?? null,
          source: data.source ?? null,
        },
        { onConflict: "user_id,word" },
      )
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Sembrar SRS item asociado
    const now = new Date().toISOString();
    await supabase.from("srs_items").upsert(
      {
        user_id: userId,
        item_type: "word",
        item_ref: word,
        payload: { ipa: data.ipa ?? null, definition_es: data.definitionEs ?? null } as never,
        due_at: now,
      },
      { onConflict: "user_id,item_type,item_ref" },
    );

    return { ok: true, id: vocab?.id };
  });

export const listVocabulary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("vocabulary")
      .select("id, word, ipa, definition_es, example_fr, source, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { words: data ?? [] };
  });

export const removeVocabulary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("vocabulary")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
