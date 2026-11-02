"use client";
import Link from "next/link";
import BookCard from "@/components/book-card";
import { Item, SectionTitle, Stagger } from "@/components/reveal";
import { Spinner } from "@/components/spinner";
import { EmptyState, ErrorState } from "@/components/states";
import { useFetch } from "@/lib/use-fetch";
import type { Book } from "@/types";

export default function NewArrivals() {
  // newest first, limited to 6: the sort and limit happen in MongoDB
  const { data, loading, error, refetch } = useFetch<Book[]>("/books?sort=newest&limit=6");

  return (
    <section className="wrap py-24">
      <SectionTitle title="New arrivals" text="The six newest books on our shelves, fresh from other readers." />

      <div className="mt-14">
        {loading ? (
          <Spinner label="Loading the newest books" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data && data.length > 0 ? (
          <Stagger className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((book) => (
              <Item key={book._id} className="h-full">
                <BookCard book={book} />
              </Item>
            ))}
          </Stagger>
        ) : (
          <EmptyState title="The shelves are empty" text="Be the first reader to add a book." href="/add-book" action="Add a Book" />
        )}
      </div>

      <div className="mt-16 text-center">
        <Link href="/books" className="btn btn-primary btn-lg rounded-full px-10">
          See All Books
        </Link>
      </div>
    </section>
  );
}
