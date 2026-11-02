"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, LoaderCircle, UserRound } from "lucide-react";
import { toast } from "sonner";
import BookObject from "@/components/book-object";
import { Field } from "@/components/field";
import Modal from "@/components/modal";
import { PageSpinner } from "@/components/spinner";
import { ErrorState } from "@/components/states";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useFetch } from "@/lib/use-fetch";
import { CATEGORY_STYLE, cn, fmtDate } from "@/lib/utils";
import type { Book, Borrow } from "@/types";

const LOAN_OPTIONS = [3, 5, 7, 10, 14];
const DAY = 86_400_000;

/** One small bar per copy: filled means it's on the shelf. */
function CopyMeter({ available, total }: { available: number; total: number }) {
  const shown = Math.min(total, 12);
  const filled = Math.round((available / total) * shown);
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-end gap-1" aria-hidden="true">
        {Array.from({ length: shown }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 200, damping: 16 }}
            style={{ originY: 1 }}
            className={cn("h-9 w-2.5 rounded-t-sm", i < filled ? "bg-primary" : "bg-base-300")}
          />
        ))}
      </div>
      <p className="font-display font-bold">
        {available} of {total} {total === 1 ? "copy" : "copies"} on the shelf
      </p>
    </div>
  );
}

export default function BookDetailsView({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: book, setData: setBook, loading, error } = useFetch<Book>(`/books/${id}`, true);
  const { data: borrows, setData: setBorrows } = useFetch<Borrow[]>("/borrows", true);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (book) document.title = `BookNook | ${book.title}`;
  }, [book]);

  if (loading) return <PageSpinner label="Opening the book" />;
  if (error || !book)
    return (
      <section className="wrap py-24">
        <ErrorState message={error ?? "We couldn't find that book."} />
        <p className="mt-6 text-center">
          <Link href="/books" className="btn btn-primary rounded-full">Back to All Books</Link>
        </p>
      </section>
    );

  const cat = CATEGORY_STYLE[book.category] ?? CATEGORY_STYLE.Others;
  const mine = borrows?.find((b) => b.bookId === book._id);
  const soldOut = book.availableCopies < 1;

  function openBorrow() {
    if (!session) return router.push(`/login?redirect=${encodeURIComponent(`/books/${id}`)}`);
    setOpen(true);
  }

  async function confirm(e: FormEvent) {
    e.preventDefault();
    if (!book) return;
    setBusy(true);
    try {
      const res = await api<{ borrow: Borrow; availableCopies: number }>("/borrows", {
        method: "POST",
        auth: true,
        body: { bookId: book._id, loanDays: days },
      });
      setBook({ ...book, availableCopies: res.availableCopies });
      setBorrows([res.borrow, ...(borrows ?? [])]);
      setOpen(false);
      toast.success(`"${book.title}" is yours until ${fmtDate(res.borrow.returnDate)}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't borrow this book. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="wrap py-10 pb-24 sm:py-14">
      <Link href="/books" className="inline-flex items-center gap-2 font-display font-semibold text-base-content/70 transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All books
      </Link>

      <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">
        <div className="mx-auto w-full max-w-[340px] lg:sticky lg:top-28 lg:max-w-none lg:self-start">
          <BookObject title={book.title} author={book.author} image={book.image} />
        </div>

        <div>
          <span className="rounded-full px-3 py-1 font-display text-sm font-bold" style={{ background: cat.bg, color: cat.fg }}>
            {book.category}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-6xl">{book.title}</h1>
          <p className="mt-3 text-xl italic text-base-content/70">by {book.author}</p>

          <div className="mt-8">
            <CopyMeter available={book.availableCopies} total={book.totalCopies} />
          </div>

          <p className="mt-8 max-w-prose whitespace-pre-line text-lg leading-8">{book.description}</p>

          <dl className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-box border border-base-300 bg-base-100 p-4">
              <dt className="flex items-center gap-2 text-sm text-base-content/60"><UserRound className="h-4 w-4" /> Added by</dt>
              <dd className="mt-1 font-display font-bold">{book.userName}</dd>
              <dd className="truncate text-sm text-base-content/60">{book.userEmail}</dd>
            </div>
            <div className="rounded-box border border-base-300 bg-base-100 p-4">
              <dt className="flex items-center gap-2 text-sm text-base-content/60"><CalendarDays className="h-4 w-4" /> Added on</dt>
              <dd className="mt-1 font-display font-bold">{fmtDate(book.createdAt)}</dd>
            </div>
          </dl>

          <div className="mt-10 space-y-5">
            {mine && (
              <p className="max-w-xl rounded-box bg-success/15 p-4">
                You&apos;re borrowing this book until <strong>{fmtDate(mine.returnDate)}</strong>.{" "}
                <Link href="/my-borrows" className="link font-bold">See My Borrows</Link>
              </p>
            )}
            {soldOut ? (
              <button type="button" disabled className="btn btn-lg rounded-full px-10">Not Available</button>
            ) : (
              <button type="button" onClick={openBorrow} className="btn btn-primary btn-lg rounded-full px-10">Borrow This Book</button>
            )}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => !busy && setOpen(false)} title="Borrow this book">
        <form onSubmit={confirm} className="space-y-5">
          <div className="flex items-center gap-4 rounded-box bg-base-200 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={book.image} alt="" className="h-20 w-14 rounded object-cover" />
            <div className="min-w-0">
              <p className="line-clamp-2 font-display font-bold leading-tight">{book.title}</p>
              <p className="mt-1 text-sm italic text-base-content/70">by {book.author}</p>
            </div>
          </div>
          <Field label="Your name" htmlFor="borrow-name">
            <input id="borrow-name" readOnly value={session?.user.name ?? ""} className="input w-full cursor-not-allowed bg-base-200 opacity-80" />
          </Field>
          <Field label="Your email" htmlFor="borrow-email">
            <input id="borrow-email" readOnly value={session?.user.email ?? ""} className="input w-full cursor-not-allowed bg-base-200 opacity-80" />
          </Field>
          <Field label="Borrow for" htmlFor="borrow-days" hint={`Return by ${fmtDate(new Date(Date.now() + days * DAY))}`}>
            <select id="borrow-days" value={days} onChange={(e) => setDays(Number(e.target.value))} className="select w-full">
              {LOAN_OPTIONS.map((d) => (
                <option key={d} value={d}>{d} days</option>
              ))}
            </select>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} disabled={busy} className="btn btn-ghost rounded-full">Cancel</button>
            <button type="submit" disabled={busy} className="btn btn-primary rounded-full px-8">
              {busy ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Borrowing</> : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
