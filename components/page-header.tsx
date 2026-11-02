export default function PageHeader({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-base-300 bg-base-100">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-full opacity-[0.13] sm:w-3/5" style={{ backgroundImage: "linear-gradient(90deg, var(--color-base-100), transparent 65%), url(https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1400&q=85)", backgroundPosition: "center", backgroundSize: "cover" }} />
      <div className="wrap relative flex flex-wrap items-end justify-between gap-6 py-12 sm:py-14">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
          {text && <p className="mt-4 text-base-content/70">{text}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}
