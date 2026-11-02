import type { Metadata } from "next";
import ProfileView from "@/components/views/profile-view";
import PrivateRoute from "@/components/private-route";

export const metadata: Metadata = { title: "BookNook | My Profile" };

export default function Page() {
  return (
    <PrivateRoute>
      <ProfileView />
    </PrivateRoute>
  );
}
