"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "./logo";
import Avatar from "./avatar";
import ThemeToggle from "./theme-toggle";
import { logout, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];
// Only shown to logged-in users
const PRIVATE_LINKS = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = session ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function onLogout() {
    setMenuOpen(false);
    setMobileOpen(false);
    await logout();
    toast.success("You've been logged out. See you soon!");
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-base-300 bg-base-100/85 backdrop-blur-md" : "border-transparent bg-base-100",
      )}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "relative isolate rounded-full px-4 py-2 font-display font-semibold transition-colors",
                isActive(l.href) ? "text-primary" : "text-base-content/75 hover:text-base-content",
              )}
            >
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {isPending ? (
            <span className="skeleton h-10 w-10 rounded-full" aria-hidden="true" />
          ) : session ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open account menu"
                className="grid rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-base-100 transition hover:ring-primary"
              >
                <Avatar name={session.user.name} src={session.user.image} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    style={{ originX: 1, originY: 0 }}
                    className="absolute right-0 top-[calc(100%+12px)] w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-2xl"
                  >
                    <div className="flex items-center gap-3 border-b border-base-300 px-3 pb-3 pt-2">
                      <Avatar name={session.user.name} src={session.user.image} className="h-11 w-11" />
                      <div className="min-w-0">
                        <p className="truncate font-display font-bold">{session.user.name}</p>
                        <p className="truncate text-sm text-base-content/60">{session.user.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" role="menuitem" className="mt-2 flex items-center gap-3 rounded-field px-3 py-2.5 font-display font-semibold transition-colors hover:bg-base-200">
                      <UserRound className="h-5 w-5" /> My Profile
                    </Link>
                    <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-3 rounded-field px-3 py-2.5 text-left font-display font-semibold text-error transition-colors hover:bg-error/10">
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost rounded-full">Login</Link>
              <Link href="/register" className="btn btn-primary rounded-full">Register</Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="btn btn-ghost btn-square lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-base-300 bg-base-100 lg:hidden"
          >
            <nav aria-label="Mobile" className="wrap flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn("rounded-field px-4 py-3 font-display text-lg font-semibold", isActive(l.href) ? "bg-primary/10 text-primary" : "hover:bg-base-200")}
                >
                  {l.label}
                </Link>
              ))}
              {!session && !isPending && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link href="/login" className="btn btn-outline rounded-full">Login</Link>
                  <Link href="/register" className="btn btn-primary rounded-full">Register</Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
