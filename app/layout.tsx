import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/literata";
import "@fontsource-variable/literata/wght-italic.css";
import "./globals.css";

import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "BookNook | A Small Online Library",
  description:
    "Add a book, borrow a book, return a book. BookNook is a small community library you can browse from anywhere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="booknook"
      suppressHydrationWarning
    >
      <head />
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-primary px-5 py-2 font-display font-bold text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <Providers>
          <Navbar />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
