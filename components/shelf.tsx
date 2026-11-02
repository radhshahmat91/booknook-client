"use client";
import { motion } from "framer-motion";

const SPINES = [
  { w: 46, h: 214, label: "Moonlit Orchard" },
  { w: 38, h: 268, label: "Tides" },
  { w: 54, h: 236, label: "Paper Cities" },
  { w: 40, h: 292, label: "Small Wonders" },
  { w: 50, h: 246, label: "The Long Way Home" },
  { w: 36, h: 222, label: "Salt and Sky" },
  { w: 44, h: 196, label: "Field Notes", tilt: 13 },
];

const SIZES = {
  lg: "scale-[.82] sm:scale-100 lg:scale-[1.15]",
  md: "scale-[.8] xl:scale-100",
};

/** A row of book spines on a shelf. They rise into place, and lift when you hover one. */
export default function Shelf({
  palette,
  active = true,
  size = "lg",
  ink = "#151A3B",
}: {
  palette: string[];
  active?: boolean;
  size?: keyof typeof SIZES;
  ink?: string;
}) {
  return (
    <div aria-hidden="true" className={`mx-auto w-fit origin-bottom ${SIZES[size]}`}>
      <div className="flex items-end gap-1.5 px-3">
        {SPINES.map((s, i) => {
          const tilt = s.tilt ?? 0;
          return (
            <motion.div
              key={s.label}
              initial={{ y: 190, opacity: 0, rotate: tilt }}
              animate={active ? { y: 0, opacity: 1, rotate: tilt } : { y: 190, opacity: 0, rotate: tilt }}
              whileHover={{ y: -22 }}
              transition={{ type: "spring", stiffness: 150, damping: 17, delay: active ? 0.12 + i * 0.07 : 0 }}
              style={{ width: s.w, height: s.h, background: palette[i % palette.length], color: ink, originX: 0, originY: 1 }}
              className="flex shrink-0 cursor-pointer flex-col items-center justify-between rounded-t-md py-3 shadow-[inset_-6px_0_0_rgba(0,0,0,.12),inset_3px_0_0_rgba(255,255,255,.3)]"
            >
              <span className="h-1.5 w-[68%] rounded-full bg-current opacity-35" />
              <span className="rotate-180 whitespace-nowrap font-display text-[13px] font-bold [writing-mode:vertical-rl]">{s.label}</span>
              <span className="h-1.5 w-[68%] rounded-full bg-current opacity-35" />
            </motion.div>
          );
        })}
      </div>
      <div className="h-4 rounded-full bg-black/30 shadow-[0_14px_24px_-10px_rgba(0,0,0,.5)]" />
    </div>
  );
}
