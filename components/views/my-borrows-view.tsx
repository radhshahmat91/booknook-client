"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Undo2 } from "lucide-react";
import { toast } from "sonner";
import BookCover from "@/components/book-cover";
import PageHeader from "@/components/page-header";
import { Spinner } from "@/components/spinner";
import { EmptyState, ErrorState } from "@/components/states";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { cn, daysLeft, fmtDate } from "@/lib/utils";
import type { Borrow } from "@/types";

function DueBadge({ date }: { date: string }) {
  const d = daysLeft(date);
  const [text, tone] =
    d < 0
      ? [`Overdue by ${-d} ${-d === 1 ? "day" : "days"}`, "bg-error/15 text-error"]
      : d === 0
        ? ["Due today", "bg-warning/35 text-amber-900 dark:text-warning"]
        : [`${d} ${d === 1 ? "day" : "days"} left`, "bg-success/15 text-emerald-800 dark:text-success"];
  return <span className={cn("badge mt-1.5 border-0 font-bold", tone)}>{text}</span>;
}

export default function MyBorrowsView() {
  const { data, setData, loading, error, refetch } = useFetch<Borrow[]>("/borrows", true);
  const [returning, setReturning] = useState<string | null>(null);

  async function giveBack(b: Borrow) {
    setReturning(b._id);
    try {
      await api(`/borrows/${b._id}`, { method: "DELETE", auth: true });
      setData((data ?? []).filter((x) => x._id !== b._id));
      toast.success(`"${b.bookTitle}" is back on the shelf. Thanks for returning it!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't return this book. Please try again.");
    } finally {
      setReturning(null);
    }
  }

  return (
    <>
      <PageHeader title="My borrows" text="Every book you have right now, and the day each one is due back." />

      <section className="wrap py-12 pb-24">
        {loading ? (
          <Spinner label="Loading your borrows" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyState title="Nothing borrowed yet" text="Pick a book from the shelves and it will show up here." href="/books" action="Browse Books" />
        ) : (
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr className="font-display text-base-content">
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Borrow date</th>
                  <th scope="col">Return date</th>
                  <th scope="col" className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {data.map((b) => (
                    <motion.tr key={b._id} layout exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.3 }} className="align-middle">
                      <td>
                        <div className="h-20 w-14 overflow-hidden rounded-sm bg-base-300 shadow-md">
                          <BookCover src={b.bookImage} title={b.bookTitle} compact />
                        </div>
                      </td>
                      <td className="min-w-48">
                        <Link href={`/books/${b.bookId}`} className="font-display text-lg font-bold leading-tight hover:text-primary">
                          {b.bookTitle}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap">{fmtDate(b.borrowDate)}</td>
                      <td className="whitespace-nowrap">
                        {fmtDate(b.returnDate)}
                        <br />
                        <DueBadge date={b.returnDate} />
                      </td>
                      <td className="text-right">
                        <button type="button" onClick={() => giveBack(b)} disabled={returning === b._id} className="btn btn-primary btn-sm whitespace-nowrap rounded-full text-sm">
                          {returning === b._id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />} Return Book
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
