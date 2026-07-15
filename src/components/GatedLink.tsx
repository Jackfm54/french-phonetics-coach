import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type MouseEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

let cachedSignedIn: boolean | null = null;

export function useIsSignedIn() {
  const [signedIn, setSignedIn] = useState<boolean | null>(cachedSignedIn);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      cachedSignedIn = !!data.user;
      setSignedIn(cachedSignedIn);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      cachedSignedIn = !!session?.user;
      setSignedIn(cachedSignedIn);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return signedIn;
}

// Accept any Link props (Link is heavily generic; we forward through).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GatedLink(props: any) {
  const navigate = useNavigate();
  const signedIn = useIsSignedIn();
  const { onClick, to, params, ...rest } = props;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!signedIn) {
      e.preventDefault();
      let redirect = typeof to === "string" ? to : "/";
      if (params && typeof params === "object") {
        for (const [k, v] of Object.entries(params as Record<string, string>)) {
          redirect = redirect.replace(`$${k}`, String(v));
        }
      }
      navigate({ to: "/auth", search: { redirect } as never });
      return;
    }
    onClick?.(e);
  };

  const LinkAny = Link as unknown as (p: Record<string, unknown>) => React.ReactElement;
  return <LinkAny {...rest} to={to} params={params} onClick={handleClick} />;
}
