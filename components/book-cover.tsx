"use client";
import { useEffect, useState } from "react";

const PALETTE = ["#2B3FD6", "#0B6B53", "#7A2A8E", "#C23B1A", "#1B6CA8", "#9A3B5C"];

/** Cover image that falls back to a typographic cover when the URL is missing or broken. */
export default function BookCover({ src, title, author, compact = false }: { src?: string; title: string; author?: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    const bg = PALETTE[[...title].reduce((sum, c) => sum + c.charCodeAt(0), 0) % PALETTE.length];
    if (compact)
      return (
        <div className="grid h-full w-full place-items-center font-display text-lg font-extrabold text-white" style={{ background: bg }}>
          {title?.[0] ?? "B"}
        </div>
      );
    return (
      <div className="flex h-full w-full flex-col justify-between p-5 text-white" style={{ background: bg }}>
        <span className="h-1 w-10 rounded-full bg-white/60" />
        <div>
          <p className="font-display text-xl font-bold leading-tight">{title || "Untitled"}</p>
          {author && <p className="mt-2 text-xs italic opacity-80">{author}</p>}
        </div>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`Cover of ${title}`} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
  );
}
