import Shelf from "./shelf";

export default function AuthShell({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between gap-12 overflow-hidden bg-cloth p-12 text-white lg:flex">
        <div aria-hidden="true" className="absolute inset-0 opacity-25">
          {/* Editorial library photograph from Unsplash */}
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=85)" }} />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#17205d]/90 via-[#17205d]/75 to-[#17205d]/30" />
        <p className="relative z-10 max-w-sm font-display text-5xl font-extrabold leading-[1.02] tracking-tight">Add a book. Borrow a book. Return a book.</p>
        <div className="relative z-10"><Shelf size="md" palette={["#FFD54A", "#FFB6C9", "#8EE0BD", "#FFFFFF", "#9CC8FF", "#FF9248", "#FFD54A"]} /></div>
      </aside>
      <section className="flex items-center justify-center px-4 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
          <p className="mt-3 text-base-content/70">{text}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
