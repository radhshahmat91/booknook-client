import type { Metadata } from "next";
import Link from "next/link";
import Shelf from "@/components/shelf";

export const metadata: Metadata = { title: "BookNook | Page Not Found" };

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] items-center gap-12 py-20 lg:grid-cols-2">
      <div>
        <p className="font-display text-8xl font-extrabold text-primary sm:text-9xl">404</p>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">This page isn&apos;t on our shelves.</h1>
        <p className="mt-5 max-w-md text-base-content/70">The link may be broken, or the page has moved. Head back home and start from there.</p>
        <Link href="/" className="btn btn-primary btn-lg mt-8 rounded-full px-10">
          Back to Home
        </Link>
      </div>
      <Shelf size="md" palette={["#2B3FD6", "#FFD54A", "#FFB6C9", "#0B6B53", "#FF9248", "#7A2A8E", "#9CC8FF"]} />
    </section>
  );
}
