"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import BookCard from "@/components/book-card";
import BookForm from "@/components/book-form";
import Modal from "@/components/modal";
import PageHeader from "@/components/page-header";
import { Spinner } from "@/components/spinner";
import { EmptyState, ErrorState } from "@/components/states";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useFetch } from "@/lib/use-fetch";
import type { Book } from "@/types";

export default function MyBooksView() {
  const { data: session } = useSession();
  const { data, setData, loading, error, refetch } = useFetch<Book[]>("/books?mine=true&sort=newest", true);

  // the modal's content stays mounted while it animates out, so keep the book and the open flag separate
  const [editing, setEditing] = useState<Book | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/books/${deleting._id}`, { method: "DELETE", auth: true });
      setData((data ?? []).filter((b) => b._id !== deleting._id));
      toast.success(`"${deleting.title}" was deleted.`);
      setDeleteOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't delete this book. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="My books" text="The books you've added. Edit the details or take a book off the shelf.">
        <Link href="/add-book" className="btn btn-primary rounded-full">
          <Plus className="h-5 w-5" /> Add Book
        </Link>
      </PageHeader>

      <section className="wrap py-12 pb-24">
        {loading ? (
          <Spinner label="Loading your books" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data || data.length === 0 ? (
          <EmptyState title="You haven't added a book yet" text="Add your first book and it shows up on the shelves right away." href="/add-book" action="Add a Book" />
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {data.map((b) => (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.28 }}
                  className="h-full"
                >
                  <BookCard
                    book={b}
                    footer={
                      <div className="mt-5 border-t border-base-300 pt-4">
                        <p className="mb-3 text-sm text-base-content/60">
                          {b.availableCopies} of {b.totalCopies} {b.totalCopies === 1 ? "copy" : "copies"} on the shelf
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => { setEditing(b); setEditOpen(true); }} className="btn btn-outline btn-sm rounded-full">
                            <Pencil className="h-4 w-4" /> Edit
                          </button>
                          <button type="button" onClick={() => { setDeleting(b); setDeleteOpen(true); }} className="btn btn-sm rounded-full border-error/40 text-error hover:border-error hover:bg-error hover:text-error-content">
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </div>
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit book" size="lg">
        {editing && session && (
          <BookForm
            key={editing._id}
            initial={editing}
            userName={session.user.name}
            userEmail={session.user.email}
            submitLabel="Save Changes"
            onSubmit={async (values) => {
              const updated = await api<Book>(`/books/${editing._id}`, { method: "PATCH", auth: true, body: values });
              setData((data ?? []).map((b) => (b._id === updated._id ? updated : b)));
              setEditOpen(false);
              toast.success(`"${updated.title}" was updated.`);
            }}
          />
        )}
      </Modal>

      <Modal open={deleteOpen} onClose={() => !busy && setDeleteOpen(false)} title="Delete this book?">
        <p className="text-base-content/80">
          <strong className="font-display">{deleting?.title}</strong> will be removed from the library for everyone. This can&apos;t be undone.
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={() => setDeleteOpen(false)} disabled={busy} className="btn btn-ghost rounded-full">Keep it</button>
          <button type="button" onClick={confirmDelete} disabled={busy} className="btn rounded-full border-error bg-error px-8 text-error-content">
            {busy ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Deleting</> : "Delete Book"}
          </button>
        </div>
      </Modal>
    </>
  );
}
