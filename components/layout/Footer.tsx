"use client";

import Link from "next/link";
import Image from "next/image";
import { Code2, MessageCircle, Phone } from "lucide-react";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const developedBy = {
  fr: "Développé par",
  en: "Developed by",
  ar: "طُوِّر بواسطة",
} as const;

export default function Footer() {
  const { t, language } = useLanguage();

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/vehicules", label: t("nav.vehicles") },
    { href: "/#comment-ca-marche", label: t("nav.howItWorks") },
    { href: "/#a-propos", label: t("nav.about") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  const phoneLink = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <footer className="relative overflow-hidden bg-[var(--color-ink)] pt-10 pb-20 sm:pt-16 sm:pb-8">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red-primary)] to-transparent" />

      {/* Mot géant décoratif en filigrane */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 hidden sm:block -translate-x-1/2 translate-y-[28%] select-none whitespace-nowrap font-display text-[24vw] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)] sm:text-[13rem]"
      >
        RED CAR
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        {/* Bandeau d'appel à l'action */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5c0a0a] via-[#8a1010] to-[#3d0707] px-5 py-7 text-center sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--color-red-primary)]/40 blur-[60px]" />

          <h2 className="relative font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t("nav.bookNow")}
          </h2>

          <div className="relative mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={buildWhatsAppLink(t("whatsapp.defaultMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 font-body text-sm font-bold text-white shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
            >
              <MessageCircle size={18} />
              {t("common.reserveWhatsapp")}
            </a>

            <a
              href={phoneLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 font-body text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <Phone size={16} />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>
          </div>
        </div>

        {/* Logo + liens */}
        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red-primary)]/25 blur-[40px]" />
            <Image
              src="/ahmed-redcar-logo.png"
              alt="Ahmed Red Car"
              width={150}
              height={50}
              className="relative h-20 w-auto object-contain"
            />
          </div>

          <nav className="grid w-full max-w-sm grid-cols-2 gap-2.5 sm:w-auto sm:max-w-none sm:grid-cols-3 sm:gap-x-10 sm:gap-y-3">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 font-body text-[15px] font-medium leading-tight text-white/85 transition-colors hover:border-[var(--color-red-primary)]/50 hover:bg-white/10 hover:text-white sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-sm sm:font-normal sm:text-white/60"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-red-primary)] transition-transform duration-300 group-hover:scale-150" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Barre du bas */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5">
          <span className="text-center font-body text-xs text-white/35 sm:text-start">
            © {new Date().getFullYear()} Ahmed Red Car. {t("footer.rights")}
          </span>

          {/* Crédit développeur, seul sur sa ligne, à droite */}
          <p className="flex items-center justify-end gap-2 font-body text-sm text-white/60">
            <Code2 size={16} className="text-[var(--color-red-primary)]" />
            <span>
              {developedBy[language]}{" "}
              <a
                href="https://www.khsolutions.it.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-extrabold text-white underline decoration-[var(--color-red-primary)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-red-primary)]"
              >
                khsolutions
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}