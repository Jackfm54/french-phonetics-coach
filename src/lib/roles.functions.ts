import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role as string);
    return {
      userId,
      roles,
      isTeacher: roles.includes("teacher") || roles.includes("admin"),
      isAdmin: roles.includes("admin"),
    };
  });

export const listAllStudentAttempts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    // Verificar rol
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const allowed = (roles ?? []).some(
      (r) => r.role === "teacher" || r.role === "admin",
    );
    if (!allowed) throw new Error("Forbidden: solo profesores/administradores");

    const { data: attempts, error } = await supabase
      .from("practice_attempts")
      .select("id, user_id, kind, context, expected_text, transcript, score, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const userIds = Array.from(new Set((attempts ?? []).map((a) => a.user_id)));
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, display_name, email").in("id", userIds)
      : { data: [] as { id: string; display_name: string | null; email: string | null }[] };
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

    const enriched = (attempts ?? []).map((a) => ({
      ...a,
      student_name: byId.get(a.user_id)?.display_name ?? byId.get(a.user_id)?.email ?? "Alumno",
    }));

    return { attempts: enriched };
  });

export const claimTeacherRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string }) => input)
  .handler(async ({ data, context }) => {
    const expected = process.env.TEACHER_SIGNUP_CODE;
    if (!expected) return { ok: false, error: "El código de profesor no está configurado." };
    const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();
    if (!data.code || norm(data.code) !== norm(expected)) {
      return { ok: false, error: "Código de invitación inválido. Revisa el código de profesor." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "teacher" },
        { onConflict: "user_id,role" },
      );
    if (error) return { ok: false, error: "No se pudo activar el rol de profesor." };
    return { ok: true, error: null as string | null };
  });
