"use client";
import Link from "next/link";
import BookObject from "./book-object";
import { CATEGORY_STYLE } from "@/lib/utils";
import type { Book } from "@/types";

type Props = {
  book: Pick<Book, "title" | "author" | "category" | "image"> & Partial<Pick<Book, "_id" | "availableCopies">>;
  footer?: React.ReactNode;
  preview?: boolean; // static version used by the Add Book live preview
};

export default function BookCard({ book, footer, preview = false }: Props) {
  const style = CATEGORY_STYLE[book.category] ?? CATEGORY_STYLE.Others;
  const href = `/books/${book._id}`;
  const cover = (
    <div className="relative">
      <BookObject title={book.title} author={book.author} image={book.image} tilt={!preview} />
      {book.availableCopies === 0 && (
        <span className="absolute right-3 top-3 rounded-full bg-neutral px-3 py-1 font-display text-xs font-bold text-neutral-content">
          All borrowed
        </span>
      )}
    </div>
  );

  return (
    <article className="flex h-full flex-col">
      {preview ? cover : <Link href={href} aria-label={`View details for ${book.title}`}>{cover}</Link>}

      <div className="mt-7 flex flex-1 flex-col">
        <h3 className="line-clamp-2 min-h-[3.2rem] text-xl font-bold leading-snug">{book.title || "Your book title"}</h3>
        <p className="mt-1 line-clamp-1 italic text-base-content/70">by {book.author || "Author name"}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="rounded-full px-3 py-1 font-display text-sm font-bold" style={{ background: style.bg, color: style.fg }}>
            {book.category}
          </span>
          {preview ? (
            <span className="btn btn-primary btn-sm pointer-events-none rounded-full text-sm">View Details</span>
          ) : (
            <Link href={href} className="btn btn-primary btn-sm rounded-full text-sm">
              View Details
            </Link>
          )}
        </div>
        {footer}
      </div>
    </article>
  );
}
