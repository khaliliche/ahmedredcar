"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-[var(--color-ink)]/95 backdrop-blur border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-tight text-white"
          >
            AHMED <span className="text-[var(--color-red-primary)]">RED</span> CAR
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-sm text-white/80 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <Phone size={16} />
              {siteConfig.phone}
            </a>
            <a
              href={buildWhatsAppLink(
                "Bonjour Ahmed Red Car, je souhaite avoir des informations."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--color-red-primary)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-primary)]"
            >
              Reserver maintenant
            </a>
          </div>

          <button
            className="text-white lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-ink)] px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-extrabold text-white">
              AHMED <span className="text-[var(--color-red-primary)]">RED</span> CAR
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="text-white"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="mt-12 flex flex-col gap-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-bold text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-white/80"
            >
              <Phone size={16} />
              {siteConfig.phone}
            </a>
            <a
              href={buildWhatsAppLink(
                "Bonjour Ahmed Red Car, je souhaite avoir des informations."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[var(--color-red-primary)] py-3 text-center font-semibold text-white"
            >
              Reserver maintenant
            </a>
          </div>
        </div>
      )}
    </>
  );
}
