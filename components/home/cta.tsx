import Link from "next/link";
import Shelf from "@/components/shelf";

export default function Cta() {
  return (
    <section className="wrap py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-butter px-8 py-16 text-ink sm:px-14 sm:py-20">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold sm:text-5xl">Got a book gathering dust?</h2>
          <p className="mt-5 text-lg text-ink/75">Add it to BookNook in under a minute and let another reader borrow it.</p>
          <Link href="/add-book" className="btn btn-neutral btn-lg mt-8 rounded-full px-9">
            Add a Book
          </Link>
        </div>
        <div className="pointer-events-none absolute -bottom-1 right-0 hidden w-[420px] md:block lg:right-8">
          <Shelf size="md" palette={["#2B3FD6", "#C23B1A", "#0B6B53", "#7A2A8E", "#151A3B", "#2B3FD6", "#0B6B53"]} ink="#FFFFFF" />
        </div>
      </div>
    </section>
  );
}
