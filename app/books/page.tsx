import type { Metadata } from "next";
import { Suspense } from "react";
import BooksView from "@/components/views/books-view";
import { PageSpinner } from "@/components/spinner";

export const metadata: Metadata = { title: "BookNook | All Books" };

export default function BooksPage() {
  return (
    <Suspense fallback={<PageSpinner label="Loading the shelves" />}>
      <BooksView />
    </Suspense>
  );
}
