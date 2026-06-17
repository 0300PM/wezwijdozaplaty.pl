"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Strona główna" },
  { href: "/generator", label: "Generator" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-app items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-primary" onClick={() => setMenuOpen(false)}>
          Wezwij do Zapłaty
        </Link>

        <button
          className="rounded border border-border px-3 py-1.5 text-sm font-medium text-textMuted md:hidden"
          aria-label="Menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "Zamknij" : "Menu"}
        </button>

        <nav className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-16 flex-col gap-4 border-b border-border bg-surface p-4 shadow-mdsoft md:static md:flex md:flex-row md:items-center md:gap-8 md:border-b-0 md:bg-transparent md:p-0 md:shadow-none`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${pathname === item.href ? "text-primary" : "text-textMuted hover:text-primary"}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/generator"
            onClick={() => setMenuOpen(false)}
            className="btn text-sm"
          >
            Wygeneruj wezwanie
          </Link>
        </nav>
      </div>
    </header>
  );
}
