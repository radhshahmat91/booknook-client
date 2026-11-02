import type { Metadata } from "next";
import AddBookView from "@/components/views/add-book-view";
import PrivateRoute from "@/components/private-route";

export const metadata: Metadata = { title: "BookNook | Add Book" };

export default function Page() {
  return (
    <PrivateRoute>
      <AddBookView />
    </PrivateRoute>
  );
}
