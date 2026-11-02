import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import Logo from "./logo";
import FooterLinks from "./footer-links";
import { CATEGORIES } from "@/lib/utils";

const SOCIALS = [
  { label: "X", href: "https://x.com", Icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com", Icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-neutral-content/70">
            A small online library. Add a book, borrow a book, return a book.
          </p>
          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:-translate-y-1 hover:bg-butter hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Explore">
          <h3 className="text-lg text-white">Explore</h3>
          <FooterLinks />
        </nav>

        <nav aria-label="Categories">
          <h3 className="text-lg text-white">Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/books?category=${c}`} className="text-neutral-content/70 transition-colors hover:text-butter">{c}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-lg text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-neutral-content/70">
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-butter" /> hello@booknook.app</li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-butter" /> +1 (555) 010-0199</li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-butter" /> 12 Reader&apos;s Lane, Storyville</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-6 text-sm text-neutral-content/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} BookNook. All rights reserved.</p>
          <p>Made for readers, one shelf at a time.</p>
        </div>
      </div>
    </footer>
  );
}
