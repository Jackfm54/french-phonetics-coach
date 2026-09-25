import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getMyRole, listAllStudentAttempts, listTeacherCodes, createTeacherCode, toggleTeacherCode } from "@/lib/roles.functions";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/_authenticated/professor")({
  component: ProfessorPage,
  head: () => ({
    meta: [
      { title: "Panel del profesor · Professeur.fr" },
      { name: "description", content: "Sigue el progreso de tus alumnos: prácticas, transcripciones y puntajes." },
    ],
  }),
});

type CodeRow = {
  id: string;
  code: string;
  label: string | null;
  is_active: boolean;
  uses: number;
  max_uses: number | null;
  created_at: string;
};

type Row = {
  id: string;
  user_id: string;
  student_name: string;
  kind: string;
  context: string | null;
  expected_text: string | null;
  transcript: string | null;
  score: number | null;
  created_at: string;
};

function ProfessorPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [codeMsg, setCodeMsg] = useState<string | null>(null);

  const loadCodes = () =>
    listTeacherCodes().then((res) => setCodes(res.codes as unknown as CodeRow[])).catch(() => {});

  useEffect(() => {
    getMyRole()
      .then((r) => {
        if (!r.isTeacher) {
          setError("Tu cuenta no tiene rol de profesor. Pide a un administrador que te lo asigne.");
          setLoading(false);
          return;
        }
        setIsAdmin(r.isAdmin);
        if (r.isAdmin) loadCodes();
        return listAllStudentAttempts().then((res) => setRows(res.attempts as Row[]));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateCode = async () => {
    setCodeMsg(null);
    const res = await createTeacherCode({ data: { code: newCode, label: newLabel } });
    if (!res.ok) {
      setCodeMsg(res.error);
      return;
    }
    setNewCode("");
    setNewLabel("");
    setCodeMsg("Código creado.");
    loadCodes();
  };

  const handleToggleCode = async (id: string, isActive: boolean) => {
    await toggleTeacherCode({ data: { id, isActive } });
    loadCodes();
  };

  const students = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number; avg: number }>();
    for (const r of rows) {
      const s = map.get(r.user_id) ?? { id: r.user_id, name: r.student_name, count: 0, avg: 0 };
      s.count += 1;
      if (r.score !== null) s.avg += r.score;
      map.set(r.user_id, s);
    }
    return Array.from(map.values()).map((s) => ({ ...s, avg: s.count > 0 ? s.avg / s.count : 0 }));
  }, [rows]);

  const filtered = selected ? rows.filter((r) => r.user_id === selected) : rows;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Panel del profesor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Actividad reciente de tus alumnos (últimos 500 intentos).
        </p>

        {isAdmin && !loading && !error && (
          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Códigos de invitación de profesor</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea un código por profesor. Compártelo y úsalo al registrarse marcando «Soy profesor».
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nuevo código</label>
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="EJ: MARIE-2026"
                  className="mt-1 block w-48 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Etiqueta (opcional)</label>
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ej: Profesora Marie"
                  className="mt-1 block w-56 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleCreateCode}
                disabled={newCode.trim().length < 4}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                Crear código
              </button>
            </div>
            {codeMsg && <p className="mt-2 text-sm text-muted-foreground">{codeMsg}</p>}
            <ul className="mt-4 space-y-2">
              {codes.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-2.5">
                  <div>
                    <span className="font-mono text-sm font-semibold">{c.code}</span>
                    {c.label && <span className="ml-2 text-sm text-muted-foreground">· {c.label}</span>}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {c.uses} uso{c.uses === 1 ? "" : "s"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleCode(c.id, !c.is_active)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                      c.is_active
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    }`}
                  >
                    {c.is_active ? "Activo · desactivar" : "Inactivo · activar"}
                  </button>
                </li>
              ))}
              {codes.length === 0 && (
                <li className="text-sm text-muted-foreground">Aún no hay códigos.</li>
              )}
            </ul>
          </section>
        )}

        {loading && <p className="mt-8 text-sm text-muted-foreground">Cargando…</p>}
        {error && <p className="mt-8 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
            <aside>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Alumnos ({students.length})</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <button
                    onClick={() => setSelected(null)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${selected === null ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}
                  >
                    Todos ({rows.length})
                  </button>
                </li>
                {students.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelected(s.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${selected === s.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"}`}
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.count} intentos · promedio {Math.round(s.avg)}%
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Intentos ({filtered.length})
              </h2>
              <ul className="mt-3 space-y-3">
                {filtered.map((r) => (
                  <li key={r.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {r.student_name} · <span className="uppercase tracking-wider text-primary">{r.kind}</span>
                        </p>
                        {r.context && <p className="mt-1 text-sm font-medium">{r.context}</p>}
                        {r.expected_text && (
                          <p className="mt-1 text-sm text-muted-foreground truncate">
                            Esperado: {r.expected_text}
                          </p>
                        )}
                        {r.transcript && (
                          <p className="mt-1 text-sm text-muted-foreground truncate">
                            Dijo: « {r.transcript} »
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {r.score !== null && (
                          <p className={`font-display text-xl font-semibold ${r.score >= 85 ? "text-emerald-500" : r.score >= 60 ? "text-amber-500" : "text-red-500"}`}>
                            {Math.round(r.score)}%
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground">Sin intentos todavía.</p>
                )}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
