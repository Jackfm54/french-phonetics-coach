import { Link } from "@tanstack/react-router";

export function SiteHeader() {
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
          <Link
            to="/lecons"
            className="rounded-full px-4 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "rounded-full px-4 py-2 bg-secondary text-foreground" }}
          >
            Leçons
          </Link>
          <Link
            to="/chat"
            className="rounded-full px-4 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "rounded-full px-4 py-2 bg-secondary text-foreground" }}
          >
            Tuteur IA
          </Link>
        </nav>
      </div>
    </header>
  );
}
