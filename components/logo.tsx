import Link from "next/link";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#2B3FD6" />
      <rect x="8.5" y="12" width="6" height="19" rx="1.5" fill="#FFD54A" />
      <rect x="16.5" y="8" width="6" height="23" rx="1.5" fill="#FFB6C9" />
      <rect x="24.5" y="13" width="6" height="18" rx="1.5" fill="#8EE0BD" transform="rotate(8 27.5 31)" />
      <rect x="7" y="31.5" width="26" height="2.5" rx="1.25" fill="#fff" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="BookNook home">
      <LogoMark className="h-10 w-10 transition-transform duration-300 group-hover:-rotate-6" />
      <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-white" : ""}`}>BookNook</span>
    </Link>
  );
}
