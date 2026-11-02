"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionTitle } from "@/components/reveal";

const REVIEWS = [
  { quote: "I found a novel I'd never have picked up in a shop. Borrowed it on Friday, finished it on Sunday.", name: "Nadia R.", tilt: -2, bg: "#FFB6C9" },
  { quote: "My daughter now asks to visit the nook every evening. The kids' shelf is her favourite place.", name: "Arif H.", tilt: 1.5, bg: "#8EE0BD" },
  { quote: "Adding my old textbooks took a minute, and two people had borrowed them by the end of the week.", name: "Mei L.", tilt: -1, bg: "#9CC8FF" },
];

export default function Reviews() {
  return (
    <section className="border-t border-base-300 bg-base-100 py-24">
      <div className="wrap">
        <SectionTitle title="Reader reviews" text="A few words from people who borrowed, read and returned." />
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 40, rotate: r.tilt * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: r.tilt }}
              whileHover={{ rotate: 0, y: -6 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ type: "spring", stiffness: 90, damping: 14, delay: i * 0.12 }}
              className="relative flex flex-col rounded-md bg-base-200 p-8 pt-10 shadow-[0_18px_30px_-20px_rgba(21,26,59,.55)]"
            >
              <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-butter/90" />
              <Quote className="h-7 w-7 text-primary" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-lg italic leading-8">{r.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full font-display font-extrabold text-ink" style={{ background: r.bg }}>
                  {r.name[0]}
                </span>
                <span className="font-display font-bold">{r.name}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
