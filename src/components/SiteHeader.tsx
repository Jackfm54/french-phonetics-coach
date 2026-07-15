import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GatedLink } from "@/components/GatedLink";

export function SiteHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true, search: { redirect: undefined } });
  };

  const linkCls = "rounded-full px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground";
  const activeCls = { className: "rounded-full px-3 py-2 bg-secondary text-foreground" };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--bg-gradient-primary)] font-display text-sm font-bold text-primary-foreground shadow-elegant">
            Pr
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Professeur<span className="text-primary">.fr</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <GatedLink to="/lecons" className={linkCls} activeProps={activeCls}>Leçons</GatedLink>
          <GatedLink to="/phonetique" className={linkCls} activeProps={activeCls}>Phonétique</GatedLink>
          <GatedLink to="/analizador" className={linkCls} activeProps={activeCls}>Analizador</GatedLink>
          <GatedLink to="/simulacros" className={linkCls} activeProps={activeCls}>Simulacres</GatedLink>
          <GatedLink to="/ecoute" className={linkCls} activeProps={activeCls}>Écoute</GatedLink>
          <GatedLink to="/chat" className={linkCls} activeProps={activeCls}>Tuteur IA</GatedLink>
          {email ? (
            <>
              <Link to="/roleplay" className={linkCls} activeProps={activeCls}>Roleplay</Link>
              <Link to="/escritura" className={linkCls} activeProps={activeCls}>Écriture</Link>
              <Link to="/revisar" className={linkCls} activeProps={activeCls}>Réviser</Link>
              <Link to="/vocabulario" className={linkCls} activeProps={activeCls}>Vocab</Link>
              <Link to="/mi-historial" className={linkCls} activeProps={activeCls}>Historial</Link>
              <Link to="/professor" className={linkCls} activeProps={activeCls}>Prof</Link>
              <button onClick={signOut} className="ml-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                Salir
              </button>
            </>

          ) : (
            <Link to="/auth" search={{ redirect: undefined }} className="ml-2 rounded-full bg-foreground px-3 py-2 text-xs text-background hover:opacity-90">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
