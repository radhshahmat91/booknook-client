"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Check, Circle, LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import AuthShell from "@/components/auth-shell";
import { Field, PasswordInput } from "@/components/field";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { PASSWORD_RULES, cn, safeRedirect } from "@/lib/utils";

export default function RegisterView() {
  const router = useRouter();
  const params = useSearchParams();
  const rawRedirect = params.get("redirect");
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const missing = PASSWORD_RULES.filter((r) => !r.test(password));
    const badPhoto = photo.trim() !== "" && !/^https?:\/\/\S+$/i.test(photo.trim());
    setPasswordError(missing.length ? `Your password still needs ${missing.map((r) => r.label.toLowerCase()).join(", ")}.` : "");
    setPhotoError(badPhoto ? "Use a full link that starts with http:// or https://" : "");
    if (missing.length || badPhoto) {
      toast.error(missing.length ? "That password doesn't meet the rules yet." : "Check the photo URL and try again.");
      return;
    }

    setBusy(true);
    try {
      const { error: err } = await signUp.email({ name: name.trim(), email: email.trim(), password, image: photo.trim() || undefined });
      if (err) {
        const msg = err.message || "We couldn't create your account. Please try again.";
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.success("Account created. Log in to start borrowing.");
      router.push(rawRedirect ? `/login?redirect=${encodeURIComponent(safeRedirect(rawRedirect))}` : "/login");
    } catch (cause) {
      const msg = cause instanceof Error ? cause.message : "We couldn't reach the registration service. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
    return;
  }

  async function google() {
    setGoogleBusy(true);
    try {
      const { error: err } = await signIn.social({ provider: "google", callbackURL: "/" });
      if (err) toast.error(err.message || "Google sign-in didn't work. Please try again.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Google sign-in couldn't be started.");
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <AuthShell title="Join BookNook" text="Create an account to borrow books and add your own to the shelves.">
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <p role="alert" className="rounded-field bg-error/10 p-3 text-sm font-medium text-error">
            {error}
          </p>
        )}
        <Field label="Name" htmlFor="name">
          <input id="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="input w-full" />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input w-full" />
        </Field>
        <Field label="Photo URL" htmlFor="photo" error={photoError} hint="Optional. A link to a profile picture.">
          <input id="photo" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://" className={cn("input w-full", photoError && "input-error")} />
        </Field>
        <Field label="Password" htmlFor="password" error={passwordError}>
          <PasswordInput id="password" value={password} onChange={(v) => { setPassword(v); setPasswordError(""); }} autoComplete="new-password" invalid={!!passwordError} />
          <ul className="mt-2 space-y-1.5" aria-label="Password rules">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(password);
              return (
                <li key={r.id} className={cn("flex items-center gap-2 text-sm transition-colors", ok ? "font-semibold text-emerald-700 dark:text-success" : "text-base-content/60")}>
                  {ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <Circle className="h-4 w-4" aria-hidden="true" />}
                  {r.label}
                </li>
              );
            })}
          </ul>
        </Field>
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full rounded-full">
          {busy ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Creating account</> : "Register"}
        </button>
      </form>

      <div className="divider my-6">or</div>

      <button type="button" onClick={google} disabled={googleBusy} className="btn btn-outline btn-lg w-full rounded-full">
        {googleBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <FcGoogle className="h-6 w-6" />} Continue with Google
      </button>

      <p className="mt-8 text-center text-base-content/70">
        Already have an account?{" "}
        <Link href={rawRedirect ? `/login?redirect=${encodeURIComponent(safeRedirect(rawRedirect))}` : "/login"} className="link font-display font-bold text-primary">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
