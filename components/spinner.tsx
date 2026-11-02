import { BookOpen } from "lucide-react";

export function Spinner({ label }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-24">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <BookOpen className="absolute inset-0 m-auto h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <p className="font-display text-sm font-semibold text-base-content/70">{label ?? "Loading"}</p>
    </div>
  );
}

export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Spinner label={label} />
    </div>
  );
}
