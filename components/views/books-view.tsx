"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import BookCard from "@/components/book-card";
import PageHeader from "@/components/page-header";
import { Spinner } from "@/components/spinner";
import { ErrorState } from "@/components/states";
import { useFetch } from "@/lib/use-fetch";
import { CATEGORIES, CATEGORY_STYLE, cn, type Category } from "@/lib/utils";
import type { Book } from "@/types";

export default function BooksView() {
  const params = useSearchParams();
  const fromUrl = CATEGORIES.find((c) => c === params.get("category"));
  const [category, setCategory] = useState<Category | "All">(fromUrl ?? "All");
  const [query, setQuery] = useState("");
  const { data, loading, error, refetch } = useFetch<Book[]>("/books");

  useEffect(() => setCategory(fromUrl ?? "All"), [fromUrl]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (b) => (category === "All" || b.category === category) && (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    );
  }, [data, category, query]);

  return (
    <>
      <PageHeader title="All books" text="Everything on the shelves right now. Open a book to read more and borrow it." />

      <section className="wrap py-10 pb-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(["All", ...CATEGORIES] as const).map((c) => {
              const on = category === c;
              const s = c === "All" ? null : CATEGORY_STYLE[c];
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c)}
                  style={on && s ? { background: s.bg, color: s.fg, borderColor: s.bg } : undefined}
                  className={cn(
                    "rounded-full border px-5 py-2 font-display font-bold transition-colors",
                    on ? (s ? "" : "border-neutral bg-neutral text-neutral-content") : "border-base-300 bg-base-100 hover:border-primary",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <label className="input w-full md:max-w-xs">
            <Search className="h-5 w-5 opacity-60" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or author" aria-label="Search books" className="grow" />
          </label>
        </div>

        <div className="mt-10">
          {loading ? (
            <Spinner label="Loading the shelves" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : shown.length === 0 ? (
            <div className="mx-auto max-w-md rounded-box border-2 border-dashed border-base-300 p-10 text-center">
              <h3 className="text-2xl">No books match</h3>
              <p className="mt-2 text-base-content/70">Try a different search, or look through another category.</p>
              <button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="btn btn-primary mt-6 rounded-full px-8">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-8 font-display font-semibold text-base-content/60" aria-live="polite">
                Showing {shown.length} of {data?.length ?? 0} {data?.length === 1 ? "book" : "books"}
              </p>
              <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {shown.map((b) => (
                    <motion.div
                      key={b._id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.25 }}
                      className="h-full"
                    >
                      <BookCard book={b} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
