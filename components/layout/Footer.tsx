"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/vehicules", label: t("nav.vehicles") },
    { href: "/#comment-ca-marche", label: t("nav.howItWorks") },
    { href: "/#a-propos", label: t("nav.about") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <footer className="relative bg-[var(--color-ink)] pt-10 pb-8 sm:pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red-primary)] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between mb-12">
          <Image
            src="/ahmed-redcar-logo.png"
            alt="Ahmed Red Car"
            width={150}
            height={50}
            className="h-10 w-auto object-contain opacity-90"
          />
          <nav className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-sm text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <span className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} {siteConfig.name}. {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}