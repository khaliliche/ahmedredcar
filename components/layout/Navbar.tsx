"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Easing } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/layout/LanguageToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const ease: Easing = reduceMotion ? "linear" : [0.22, 1, 0.36, 1];
  const spring = reduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 280, damping: 30 };

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

  const whatsappMessage = t("whatsapp.defaultMessage");
  const phoneLink = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <>
      {/* Header */}
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(11, 10, 8, 0.72)" : "rgba(11, 10, 8, 0)",
          paddingTop: scrolled ? 10 : 16,
          paddingBottom: scrolled ? 10 : 16,
          boxShadow: scrolled
            ? "0 12px 32px rgba(0, 0, 0, 0.25)"
            : "0 0 0 rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[14px]"
      >
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease, delay: 0.05 }}
          className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10"
        >
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
            <Link
              href="/"
              className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("nav.home")}

              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[var(--color-red-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
            <Link
              href="/vehicules"
              className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("nav.vehicles")}

              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[var(--color-red-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
            <Link
              href="/#comment-ca-marche"
              className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("nav.howItWorks")}

              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[var(--color-red-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
            <Link
              href="/#a-propos"
              className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("nav.about")}

              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[var(--color-red-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
            <Link
              href="/#contact"
              className="group relative font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("nav.contact")}

              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-[var(--color-red-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-6 lg:flex">
            {/* Contact cluster */}
            <div className="flex items-center gap-4">
              <a
                href={phoneLink}
                className="group flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-[var(--color-red-primary)]/50 group-hover:bg-[var(--color-red-primary)]/10">
                  <Phone
                    size={15}
                    className="text-[var(--color-red-primary)]"
                  />
                </span>
                {siteConfig.phone}
              </a>

              <a
                href={buildWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine rounded-full bg-[var(--color-red-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-primary/30 transition-all hover:-translate-y-0.5 hover:bg-[var(--color-red-dark)] hover:shadow-red-primary/50"
              >
                {t("nav.bookNow")}
              </a>
            </div>

            {/* Language toggle in its own spot */}
            <div className="border-l border-white/10 pl-6">
              <LanguageToggle variant="desktop" />
            </div>
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
        </motion.nav>
      </motion.header>

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
              transition={spring}
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
              <motion.nav
                className="mt-10 flex flex-col gap-5"
                initial="hidden"
                animate="show"
                variants={
                  reduceMotion
                    ? undefined
                    : {
                        hidden: {},
                        show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
                      }
                }
              >
                {[
                  { href: "/", label: t("nav.home") },
                  { href: "/vehicules", label: t("nav.vehicles") },
                  { href: "/#comment-ca-marche", label: t("nav.howItWorks") },
                  { href: "/#a-propos", label: t("nav.about") },
                  { href: "/#contact", label: t("nav.contact") },
                ].map(({ href, label }) => (
                  <motion.div
                    key={href}
                    variants={
                      reduceMotion
                        ? undefined
                        : {
                            hidden: { opacity: 0, x: 24 },
                            show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
                          }
                    }
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-2xl font-bold text-white transition-colors hover:text-[var(--color-red-primary)]"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

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
                  {t("nav.bookNow")}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}