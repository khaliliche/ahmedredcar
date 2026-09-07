"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import LanguageToggle from "@/components/layout/LanguageToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const whatsappMessage =
    "Bonjour Ahmed Red Car, je souhaite avoir des informations.";

  const phoneLink = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 glass-dark transition-shadow duration-500 ${
          scrolled ? "shadow-lg shadow-black/10" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <Image
              src="/ahmed-redcar-logo.png"
              alt="Ahmed Red Car"
              width={180}
              height={60}
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {item.label}

                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-[var(--color-red-primary)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-4 lg:flex">
            <LanguageToggle variant="desktop" />

            <a
              href={phoneLink}
              className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <Phone
                size={16}
                className="text-[var(--color-red-primary)]"
              />

              {siteConfig.phone}
            </a>

            <a
              href={buildWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine rounded-full bg-[var(--color-red-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-primary/30 transition-all hover:-translate-y-0.5 hover:bg-[var(--color-red-dark)] hover:shadow-red-primary/50"
            >
              Réserver maintenant
            </a>
          </div>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Fond assombri */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panneau coulissant */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[82%] max-w-sm flex-col bg-[var(--color-ink)]/98 px-6 py-6 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              {/* Header mobile */}
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Ahmed Red Car - Accueil"
                >
                  <Image
                    src="/ahmed-redcar-logo.png"
                    alt="Ahmed Red Car"
                    width={150}
                    height={55}
                    className="h-10 w-auto object-contain"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation mobile */}
              <nav className="mt-10 flex flex-col gap-5">
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

              {/* Actions mobile */}
              <div className="mt-auto flex flex-col gap-4">
                <LanguageToggle variant="mobile" />

                <a
                  href={phoneLink}
                  className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                  <Phone size={16} />
                  {siteConfig.phone}
                </a>

                <a
                  href={buildWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full bg-[var(--color-red-primary)] py-3.5 text-center font-semibold text-white shadow-lg transition-all hover:bg-[var(--color-red-dark)]"
                >
                  Réserver maintenant
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}