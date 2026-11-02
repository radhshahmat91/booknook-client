"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

/** Same rule as the navbar: private pages are only listed once the user is logged in. */
export default function FooterLinks() {
  const { data: session } = useSession();
  const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    ...(session
      ? [
          { href: "/add-book", label: "Add Book" },
          { href: "/my-books", label: "My Books" },
          { href: "/my-borrows", label: "My Borrows" },
        ]
      : [
          { href: "/login", label: "Login" },
          { href: "/register", label: "Register" },
        ]),
  ];

  return (
    <ul className="mt-4 space-y-2.5">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="text-neutral-content/70 transition-colors hover:text-butter">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
