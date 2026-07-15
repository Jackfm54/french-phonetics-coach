import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ComponentProps, type MouseEvent } from "react";
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

type LinkProps = ComponentProps<typeof Link>;

export function GatedLink(props: LinkProps) {
  const navigate = useNavigate();
  const signedIn = useIsSignedIn();
  const { onClick, to, params, ...rest } = props as LinkProps & {
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!signedIn) {
      e.preventDefault();
      // Build target href string for redirect param
      let redirect = typeof to === "string" ? to : "/";
      if (params && typeof to === "string") {
        for (const [k, v] of Object.entries(params as Record<string, string>)) {
          redirect = redirect.replace(`$${k}`, v);
        }
      }
      navigate({ to: "/auth", search: { redirect } as never });
      return;
    }
    onClick?.(e);
  };

  return <Link {...(rest as LinkProps)} to={to} params={params} onClick={handleClick} />;
}
