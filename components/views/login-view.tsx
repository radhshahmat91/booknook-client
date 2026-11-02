"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import AuthShell from "@/components/auth-shell";
import { Field, PasswordInput } from "@/components/field";
import { clearToken } from "@/lib/api";
import { logoutFlag, signIn, useSession } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";

export default function LoginView() {
  const router = useRouter();
  const params = useSearchParams();
  const rawRedirect = params.get("redirect");
  const redirect = safeRedirect(rawRedirect);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");

  // already logged in? skip the form
  useEffect(() => {
    if (session) router.replace(redirect);
  }, [session, redirect, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: err } = await signIn.email({ email: email.trim(), password });
      if (err) {
        const msg = err.message || "We couldn't log you in. Check your email and password.";
        setError(msg);
        toast.error(msg);
        return;
      }
      clearToken();
      logoutFlag.active = false;
      toast.success("Welcome back!");
      router.replace(redirect);
      router.refresh();
    } catch (cause) {
      const msg = cause instanceof Error ? cause.message : "We couldn't reach the login service. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setGoogleBusy(true);
    try {
      const { error: err } = await signIn.social({ provider: "google", callbackURL: redirect });
      if (err) toast.error(err.message || "Google sign-in didn't work. Please try again.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Google sign-in couldn't be started.");
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <AuthShell title="Welcome back" text="Log in to borrow books, add your own and manage what you've lent.">
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <p role="alert" className="rounded-field bg-error/10 p-3 text-sm font-medium text-error">
            {error}
          </p>
        )}
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input w-full" />
        </Field>
        <Field label="Password" htmlFor="password">
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>
        <div className="-mt-2 text-right">
          <button type="button" onClick={() => toast.info("Password reset isn't available yet. Contact the library team and we'll help you out.")} className="link font-display text-sm font-semibold">
            Forgot password?
          </button>
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full rounded-full">
          {busy ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Logging in</> : "Login"}
        </button>
      </form>

      <div className="divider my-6">or</div>

      <button type="button" onClick={google} disabled={googleBusy} className="btn btn-outline btn-lg w-full rounded-full">
        {googleBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <FcGoogle className="h-6 w-6" />} Continue with Google
      </button>

      <p className="mt-8 text-center text-base-content/70">
        New to BookNook?{" "}
        <Link href={rawRedirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"} className="link font-display font-bold text-primary">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
