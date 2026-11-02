"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutFlag, useSession } from "@/lib/auth-client";
import { PageSpinner } from "./spinner";

/**
 * Waits for BetterAuth to finish loading the session before deciding anything,
 * so reloading a private page never bounces a logged-in user to /login.
 */
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session && !logoutFlag.active) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, router, pathname]);

  if (!session) return <PageSpinner label={isPending ? "Checking your session" : "Taking you to login"} />;
  return <>{children}</>;
}
