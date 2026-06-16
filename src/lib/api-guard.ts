// Lightweight guard for public AI endpoints.
// - Restricts cross-origin callers to known hosts (the app's own preview / published / custom domains).
// - Enforces a per-IP, per-window rate limit (best-effort, in-memory).
// Not a substitute for auth, but blocks drive-by abuse of paid AI quota.

const ALLOWED_HOST_SUFFIXES = [
  ".lovable.app",
  ".lovableproject.com",
  ".lovable.dev",
];

function hostAllowed(host: string | null): boolean {
  if (!host) return false;
  if (host === "localhost" || host.startsWith("localhost:") || host.startsWith("127.0.0.1"))
    return true;
  return ALLOWED_HOST_SUFFIXES.some((s) => host.endsWith(s));
}

export function checkOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  // Same-origin POSTs from the app always include one of these.
  let host: string | null = null;
  try {
    if (origin) host = new URL(origin).host;
    else if (referer) host = new URL(referer).host;
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
  if (!hostAllowed(host)) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  request: Request,
  opts: { limit: number; windowMs: number; key?: string },
): Response | null {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anon";
  const k = `${opts.key ?? "default"}:${ip}`;
  const now = Date.now();
  const b = buckets.get(k);
  if (!b || b.resetAt < now) {
    buckets.set(k, { count: 1, resetAt: now + opts.windowMs });
    return null;
  }
  b.count += 1;
  if (b.count > opts.limit) {
    const retry = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
    return new Response("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(retry) },
    });
  }
  return null;
}
