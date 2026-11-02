"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import Avatar from "@/components/avatar";
import { Field } from "@/components/field";
import PageHeader from "@/components/page-header";
import { clearToken } from "@/lib/api";
import { authClient, logout, useSession } from "@/lib/auth-client";
import { useFetch } from "@/lib/use-fetch";
import { fmtDate } from "@/lib/utils";
import type { Book, Borrow } from "@/types";

export default function ProfileView() {
  const router = useRouter();
  const { data: session } = useSession();
  const books = useFetch<Book[]>("/books?mine=true", true);
  const borrows = useFetch<Borrow[]>("/borrows", true);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);

  const userId = session?.user.id;
  useEffect(() => {
    if (!session) return;
    setName(session.user.name);
    setImage(session.user.image ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!session) return null;
  const { user } = session;

  async function save(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("Enter your name.");
    if (image.trim() && !/^https?:\/\/\S+$/i.test(image.trim())) return void toast.error("The photo URL must start with http:// or https://");
    setBusy(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image: image.trim() || null });
    setBusy(false);
    if (error) return void toast.error(error.message || "We couldn't update your profile. Please try again.");
    clearToken(); // the next API token carries the new name and photo
    toast.success("Your profile was updated.");
  }

  async function onLogout() {
    await logout();
    toast.success("You've been logged out. See you soon!");
    router.push("/");
    router.refresh();
  }

  const stats = [
    { label: "Books added", value: books.loading ? "..." : (books.data?.length ?? 0) },
    { label: "Books borrowed", value: borrows.loading ? "..." : (borrows.data?.length ?? 0) },
  ];

  return (
    <>
      <PageHeader title="My profile" text="Your details as they appear on the books you add." />
      <section className="wrap grid gap-10 py-12 pb-24 lg:grid-cols-[360px_1fr]">
        <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-fit rounded-box border border-base-300 bg-base-100 p-8 text-center">
          <Avatar name={user.name} src={user.image} className="mx-auto h-28 w-28 text-3xl" />
          <h2 className="mt-5 text-3xl font-extrabold">{user.name}</h2>
          <p className="mt-1 break-all text-base-content/70">{user.email}</p>
          <p className="mt-3 text-sm text-base-content/60">Member since {fmtDate(user.createdAt)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-field bg-base-200 p-4">
                <p className="font-display text-3xl font-extrabold">{s.value}</p>
                <p className="text-sm text-base-content/70">{s.label}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={onLogout} className="btn btn-outline mt-6 w-full rounded-full">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </motion.aside>

        <motion.form onSubmit={save} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="h-fit space-y-5 rounded-box border border-base-300 bg-base-100 p-8">
          <h2 className="text-2xl font-extrabold">Edit profile</h2>
          <Field label="Name" htmlFor="p-name">
            <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} className="input w-full" />
          </Field>
          <Field label="Photo URL" htmlFor="p-photo" hint="Paste a link to an image. Leave it empty to use your initials.">
            <input id="p-photo" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://" className="input w-full" />
          </Field>
          <Field label="Email" htmlFor="p-email" hint="Your email can't be changed.">
            <input id="p-email" value={user.email} readOnly className="input w-full cursor-not-allowed bg-base-200 opacity-80" />
          </Field>
          <button type="submit" disabled={busy} className="btn btn-primary rounded-full px-10">
            {busy ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Saving</> : "Save Changes"}
          </button>
        </motion.form>
      </section>
    </>
  );
}
