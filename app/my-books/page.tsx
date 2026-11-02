import type { Metadata } from "next";
import MyBooksView from "@/components/views/my-books-view";
import PrivateRoute from "@/components/private-route";

export const metadata: Metadata = { title: "BookNook | My Books" };

export default function Page() {
  return (
    <PrivateRoute>
      <MyBooksView />
    </PrivateRoute>
  );
}
