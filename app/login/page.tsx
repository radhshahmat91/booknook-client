import type { Metadata } from "next";
import { Suspense } from "react";
import LoginView from "@/components/views/login-view";
import { PageSpinner } from "@/components/spinner";

export const metadata: Metadata = { title: "BookNook | Login" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <LoginView />
    </Suspense>
  );
}
