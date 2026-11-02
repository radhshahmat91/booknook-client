export const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_STYLE: Record<Category, { bg: string; fg: string; blurb: string }> = {
  Fiction: { bg: "#FFB6C9", fg: "#5A1431", blurb: "Novels, short stories and other made-up worlds." },
  Science: { bg: "#9CC8FF", fg: "#0F2D57", blurb: "Curious minds, big questions, clear answers." },
  History: { bg: "#FFD54A", fg: "#4A3600", blurb: "People, places and the past, told well." },
  Kids: { bg: "#8EE0BD", fg: "#0C3D2B", blurb: "Picture books and bedtime favourites." },
  Others: { bg: "#FF9248", fg: "#4A1F00", blurb: "Everything that won't fit on just one shelf." },
};

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

/** Whole days from now until a date (negative when it has passed). */
export const daysLeft = (d: string | Date) =>
  Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);

export const initials = (name?: string | null) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

/** Only allow in-site redirects like /books/123 (blocks //evil.com and full URLs). */
export const safeRedirect = (p: string | null | undefined) =>
  p && p.startsWith("/") && !p.startsWith("//") ? p : "/";

export const PASSWORD_RULES = [
  { id: "upper", label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "A lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { id: "length", label: "At least 6 characters", test: (v: string) => v.length >= 6 },
];
