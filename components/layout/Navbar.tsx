"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const whatsappMessage = "Bonjour Ahmed Red Car, je souhaite avoir des informations.";
  const phoneLink = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-dark shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center group">
            <Image
              src="/ahmed-redcar-logo.png"
              alt="Ahmed Red Car"
              width={180}
              height={60}
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--color-red-primary)] transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a href={phoneLink} className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
              <Phone size={16} className="text-[var(--color-red-primary)]" />
              {siteConfig.phone}
            </a>
            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-red-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-primary/30 transition-all hover:bg-[var(--color-red-dark)] hover:shadow-red-primary/50 hover:-translate-y-0.5 btn-shine"
            >
              Réserver maintenant
            </a>
          </div>

          <button type="button" className="text-white lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={28} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-ink)]/98 backdrop-blur-xl px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image src="/ahmed-redcar-logo.png" alt="Ahmed Red Car" width={150} height={55} className="h-10 w-auto object-contain" />
            </Link>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" className="text-white">
              <X size={28} />
            </button>
          </div>
          <nav className="mt-12 flex flex-col gap-6">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="font-display text-3xl font-bold text-white transition-colors hover:text-[var(--color-red-primary)]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <a href={phoneLink} className="flex items-center gap-2 text-white/80">
              <Phone size={16} /> {siteConfig.phone}
            </a>
            <a href={buildWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="w-full rounded-full bg-[var(--color-red-primary)] py-3.5 text-center font-semibold text-white shadow-lg">
              Réserver maintenant
            </a>
          </div>
        </div>
      )}
    </>
  );
}