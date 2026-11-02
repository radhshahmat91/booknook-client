import type { Metadata } from "next";
import BookDetailsView from "@/components/views/book-details-view";
import PrivateRoute from "@/components/private-route";

export const metadata: Metadata = { title: "BookNook | Book Details" };

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PrivateRoute>
      <BookDetailsView id={id} />
    </PrivateRoute>
  );
}
