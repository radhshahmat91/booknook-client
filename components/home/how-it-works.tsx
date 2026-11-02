"use client";
import { motion } from "framer-motion";
import { BookMarked, BookOpen, Search, Undo2 } from "lucide-react";
import { Item, SectionTitle, Stagger } from "@/components/reveal";

const STEPS = [
  { icon: Search, title: "Pick a book", text: "Browse the shelves or filter by category until something catches your eye.", bg: "#FFD54A", fg: "#4A3600" },
  { icon: BookMarked, title: "Borrow it", text: "Log in, choose how many days you need and confirm. One copy per reader.", bg: "#FFB6C9", fg: "#5A1431" },
  { icon: BookOpen, title: "Read at your pace", text: "My Borrows lists every book you have and the day it's due back.", bg: "#8EE0BD", fg: "#0C3D2B" },
  { icon: Undo2, title: "Return it", text: "Tap Return Book when you finish and the copy goes straight back on the shelf.", bg: "#9CC8FF", fg: "#0F2D57" },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-base-300 bg-base-100 py-24">
      <div className="wrap">
        <SectionTitle title="How borrowing works" text="Four small steps from the shelf to your hands, and back again." />

        <div className="relative mt-16">
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ originX: 0 }}
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-base-300 lg:block"
          />
          <Stagger className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text, bg, fg }, i) => (
              <Item key={title} className="lg:text-center">
                <div className="relative inline-grid h-16 w-16 place-items-center rounded-2xl lg:mx-auto" style={{ background: bg, color: fg }}>
                  <Icon className="h-7 w-7" />
                  <span className="absolute -right-3 -top-3 grid h-7 w-7 place-items-center rounded-full bg-neutral font-display text-sm font-extrabold text-neutral-content">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-2 text-base-content/70 lg:mx-auto lg:max-w-[16rem]">{text}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
