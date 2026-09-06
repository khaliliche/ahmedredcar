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

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const whatsappMessage =
    "Bonjour Ahmed Red Car, je souhaite avoir des informations.";

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

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            aria-label="Ahmed Red Car - Accueil"
          >
            <Image
              src="/images/ahmed-redcar-logo.png"
              alt="Ahmed Red Car - Car Rental"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop navigation */}
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

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 lg:flex">

            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <Phone size={16} />
              {siteConfig.phone}
            </a>

            {/* WhatsApp */}
            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--color-red-primary)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-primary)]"
            >
              Reserver maintenant
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="text-white lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-ink)] px-6 py-6 lg:hidden">

          {/* Mobile header */}
          <div className="flex items-center justify-between">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              aria-label="Ahmed Red Car - Accueil"
            >
              <Image
                src="/images/ahmed-redcar-logo.png"
                alt="Ahmed Red Car - Car Rental"
                width={150}
                height={55}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="text-white"
            >
              <X size={28} />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="mt-12 flex flex-col gap-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-bold text-white transition-colors hover:text-[var(--color-red-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile actions */}
          <div className="mt-auto flex flex-col gap-4">

            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              <Phone size={16} />
              {siteConfig.phone}
            </a>

            {/* WhatsApp */}
            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[var(--color-red-primary)] py-3 text-center font-semibold text-white transition-colors hover:bg-[var(--color-red-primary)]"
            >
              Reserver maintenant
            </a>
          </div>
        </div>
      )}
    </>
  );
}

