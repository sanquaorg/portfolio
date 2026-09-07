"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/youtube/", label: "YouTube" },
  { href: "/medium/", label: "Writing" },
  { href: "/skills-projects/", label: "Skills & Projects" },
  { href: "/education/", label: "Education" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3.5 text-sm">
        <Link href="/" className="font-display text-base font-semibold tracking-tight">
          Sanjaybalaji<span className="text-brand">.</span>
        </Link>
        <span className="flex-1" />
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              data-active={active ? "true" : "false"}
              className={`link-underline pb-0.5 ${
                active ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
