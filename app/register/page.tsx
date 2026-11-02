import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterView from "@/components/views/register-view";
import { PageSpinner } from "@/components/spinner";

export const metadata: Metadata = { title: "BookNook | Register" };

export default function Page() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <RegisterView />
    </Suspense>
  );
}
