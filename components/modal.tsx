"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type Props = { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "md" | "lg" };

export default function Modal({ open, onClose, title, children, size = "md" }: Props) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(onClose);
  const panel = useRef<HTMLDivElement>(null);
  closeRef.current = onClose;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-neutral/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`relative max-h-[92vh] w-full overflow-y-auto rounded-box bg-base-100 p-6 shadow-2xl outline-none sm:p-8 ${size === "lg" ? "max-w-2xl" : "max-w-md"}`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="text-2xl font-extrabold">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost btn-circle btn-sm -mr-2 -mt-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
