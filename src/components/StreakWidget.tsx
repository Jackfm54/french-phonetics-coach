import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getUserStats } from "@/lib/gamification.functions";
import { srsSummary } from "@/lib/srs.functions";
import { Flame, Trophy, Repeat } from "lucide-react";

type Stats = { xp: number; streak_days: number; best_streak: number };

export function StreakWidget() {
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [due, setDue] = useState(0);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data.user) return;
      setAuthed(true);
      Promise.all([getUserStats(), srsSummary()])
        .then(([s, r]) => {
          if (!mounted) return;
          setStats(s.stats as Stats);
          setDue(r.due);
        })
        .catch(() => void 0);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!authed) return null;
  const s = stats ?? { xp: 0, streak_days: 0, best_streak: 0 };

  return (
    <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center gap-3 px-6">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="font-semibold">{s.streak_days}</span>
        <span className="text-muted-foreground">días de racha</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="font-semibold">{s.xp}</span>
        <span className="text-muted-foreground">XP</span>
      </div>
      <Link
        to="/revisar"
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-elegant hover:opacity-90"
      >
        <Repeat className="h-4 w-4" />
        Revisar{due > 0 && <span className="rounded-full bg-primary-foreground/20 px-2 text-xs">{due}</span>}
      </Link>
    </div>
  );
}
