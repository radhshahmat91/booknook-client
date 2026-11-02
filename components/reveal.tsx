"use client";
import { motion, type Variants } from "framer-motion";

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** Parent that reveals its <Item> children one after another when scrolled into view. */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={rise} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Section heading that wipes in from the left.
 * The observed element is the (unclipped) wrapper; only the h2 inside is clipped,
 * because an element clipped to zero width may never count as "in view".
 */
export function SectionTitle({ title, text }: { title: string; text?: string }) {
  return (
    <motion.div
      className="max-w-2xl"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={{ hidden: {}, show: {} }}
    >
      <motion.h2
        variants={{
          hidden: { clipPath: "inset(-10% 100% -10% 0%)" },
          show: { clipPath: "inset(-10% -2% -10% 0%)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="text-3xl font-extrabold sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {text && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } } }}
          className="mt-4 text-base-content/70"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
