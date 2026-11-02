"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Baby, Feather, FlaskConical, Landmark, Shapes } from "lucide-react";
import { Item, SectionTitle, Stagger } from "@/components/reveal";
import { CATEGORIES, CATEGORY_STYLE } from "@/lib/utils";

const ICONS = { Fiction: Feather, Science: FlaskConical, History: Landmark, Kids: Baby, Others: Shapes };
// uneven heights so the tiles read as spines on a shelf
const HEIGHTS = ["h-64 sm:h-[300px]", "h-72 sm:h-[340px]", "h-64 sm:h-[280px]", "h-72 sm:h-[320px]", "h-64 sm:h-[300px]"];
const CATEGORY_IMAGES = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=85",
];

export default function Categories() {
  return (
    <section className="wrap py-24">
      <SectionTitle title="Top categories" text="Five shelves to start from. Pick one and see what's on it." />

      <div className="mt-14">
        <Stagger className="grid grid-cols-2 items-end gap-3 sm:grid-cols-5 sm:gap-4">
          {CATEGORIES.map((c, i) => {
            const s = CATEGORY_STYLE[c];
            const Icon = ICONS[c];
            return (
              <Item key={c} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
                <motion.div whileHover={{ y: -16 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
                  <Link
                    href={`/books?category=${c}`}
                    className={`relative isolate flex flex-col justify-between overflow-hidden rounded-t-2xl p-5 ${HEIGHTS[i]}`}
                    style={{ background: s.bg, color: "#fff" }}
                  >
                    <span aria-hidden="true" className="absolute inset-0 z-0 opacity-45 transition-transform duration-700" style={{ backgroundImage: `linear-gradient(180deg, rgba(12,18,45,.08), rgba(12,18,45,.88)), url(${CATEGORY_IMAGES[i]})`, backgroundPosition: "center", backgroundSize: "cover" }} />
                    <Icon className="relative z-10 h-9 w-9 drop-shadow" aria-hidden="true" />
                    <span className="relative z-10">
                      <span className="block font-display text-2xl font-extrabold">{c}</span>
                      <span className="mt-1 block text-sm leading-snug text-white/85">{s.blurb}</span>
                    </span>
                  </Link>
                </motion.div>
              </Item>
            );
          })}
        </Stagger>
        <div aria-hidden="true" className="h-4 rounded-full bg-neutral shadow-[0_14px_24px_-12px_rgba(21,26,59,.55)]" />
      </div>
    </section>
  );
}
