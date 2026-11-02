import type { Metadata } from "next";
import MyBorrowsView from "@/components/views/my-borrows-view";
import PrivateRoute from "@/components/private-route";

export const metadata: Metadata = { title: "BookNook | My Borrows" };

export default function Page() {
  return (
    <PrivateRoute>
      <MyBorrowsView />
    </PrivateRoute>
  );
}
