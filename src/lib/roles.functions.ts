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
    const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();
    if (!data.code) {
      return { ok: false, error: "Escribe el código de invitación de profesor." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: invite } = await supabaseAdmin
      .from("teacher_invite_codes")
      .select("id, is_active, uses, max_uses")
      .eq("code", norm(data.code))
      .maybeSingle();
    if (!invite || !invite.is_active) {
      return { ok: false, error: "Código de invitación inválido o desactivado." };
    }
    if (invite.max_uses !== null && invite.uses >= invite.max_uses) {
      return { ok: false, error: "Este código ya alcanzó su límite de usos." };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "teacher" },
        { onConflict: "user_id,role" },
      );
    if (error) return { ok: false, error: "No se pudo activar el rol de profesor." };
    await supabaseAdmin
      .from("teacher_invite_codes")
      .update({ uses: invite.uses + 1 })
      .eq("id", invite.id);
    return { ok: true, error: null as string | null };
  });

async function requireAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: solo administradores");
}

export const listTeacherCodes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("teacher_invite_codes")
      .select("id, code, label, is_active, uses, max_uses, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { codes: data ?? [] };
  });

export const createTeacherCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string; label?: string; maxUses?: number | null }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();
    const code = norm(data.code ?? "");
    if (code.length < 4) return { ok: false, error: "El código debe tener al menos 4 caracteres." };
    const { error } = await context.supabase
      .from("teacher_invite_codes")
      .insert({
        code,
        label: data.label?.trim() || null,
        max_uses: data.maxUses ?? null,
        created_by: context.userId,
      });
    if (error) {
      if (error.message.includes("duplicate") || error.code === "23505") {
        return { ok: false, error: "Ese código ya existe." };
      }
      return { ok: false, error: "No se pudo crear el código." };
    }
    return { ok: true, error: null as string | null };
  });

export const toggleTeacherCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; isActive: boolean }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("teacher_invite_codes")
      .update({ is_active: data.isActive })
      .eq("id", data.id);
    if (error) return { ok: false, error: "No se pudo actualizar el código." };
    return { ok: true, error: null as string | null };
  });
