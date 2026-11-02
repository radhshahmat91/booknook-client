"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="wrap grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Something slipped off the shelf.</h1>
        <p className="mx-auto mt-4 max-w-md text-base-content/70">An unexpected error stopped this page from loading. Try again, and if it keeps happening, come back in a few minutes.</p>
        <button type="button" onClick={reset} className="btn btn-primary btn-lg mt-8 rounded-full px-10">
          Try again
        </button>
      </div>
    </section>
  );
}
