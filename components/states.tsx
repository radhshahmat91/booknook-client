import Link from "next/link";
import { BookOpen, TriangleAlert } from "lucide-react";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-box border border-error/30 bg-error/10 p-8 text-center">
      <TriangleAlert className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
      <h3 className="mt-3 text-xl">We couldn&apos;t load this</h3>
      <p className="mt-2 text-base-content/70">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary mt-5 rounded-full">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, href, action }: { title: string; text: string; href?: string; action?: string }) {
  return (
    <div className="mx-auto max-w-md rounded-box border-2 border-dashed border-base-300 p-10 text-center">
      <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      <h3 className="mt-4 text-2xl">{title}</h3>
      <p className="mt-2 text-base-content/70">{text}</p>
      {href && action && (
        <Link href={href} className="btn btn-primary mt-6 rounded-full px-8">
          {action}
        </Link>
      )}
    </div>
  );
}
