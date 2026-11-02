"use client";
import { useEffect, useState } from "react";
import { cn, initials } from "@/lib/utils";

export default function Avatar({ name, src, className = "h-10 w-10" }: { name?: string | null; src?: string | null; className?: string }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);

  if (src && !bad)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "Profile photo"}
        referrerPolicy="no-referrer"
        onError={() => setBad(true)}
        className={cn(className, "rounded-full object-cover")}
      />
    );
  return (
    <span className={cn(className, "grid place-items-center rounded-full bg-accent font-display font-bold text-accent-content")}>
      {initials(name)}
    </span>
  );
}
