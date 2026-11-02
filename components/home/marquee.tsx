import { BookOpen } from "lucide-react";

const WORDS = ["Fiction", "Science", "History", "Kids", "Others", "Borrow", "Read", "Return"];

export default function Marquee() {
  return (
    <div className="marquee overflow-hidden bg-butter py-4 text-ink" aria-hidden="true">
      <div className="marquee-track flex">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-8 pr-8">
            {WORDS.map((w) => (
              <span key={w} className="flex items-center gap-8 whitespace-nowrap font-display text-2xl font-extrabold">
                {w}
                <BookOpen className="h-6 w-6" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
