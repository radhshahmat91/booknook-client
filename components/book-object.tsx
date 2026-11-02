"use client";
import { motion } from "framer-motion";
import BookCover from "./book-cover";
import { cn } from "@/lib/utils";

/** A cover drawn as a physical book: spine crease, page edge, and a tilt on hover. */
export default function BookObject({ title, author, image, tilt = true, className }: { title: string; author?: string; image?: string; tilt?: boolean; className?: string }) {
  return (
    <div className="[perspective:1000px]">
      <motion.div
        whileHover={tilt ? { rotateY: -16, y: -6 } : undefined}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ originX: 0, originY: 0.5, transformStyle: "preserve-3d" }}
        className={cn("relative aspect-[3/4] w-full", className)}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-[4px] -right-[7px] w-[9px] rounded-r-[3px] bg-[repeating-linear-gradient(to_bottom,#fff_0_2px,#d4d7ea_2px_3px)]"
        />
        <div className="relative h-full w-full overflow-hidden rounded-l-[4px] rounded-r-[8px] bg-base-300 shadow-[0_22px_32px_-16px_rgba(21,26,59,.6)]">
          <BookCover src={image} title={title} author={author} />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/30 via-white/25 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
