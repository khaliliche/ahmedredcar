"use client";

import { motion } from "framer-motion";
import HeroCarousel from "@/components/home/HeroCarousel";
import Logo from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type HeroProps = {
  images: string[];
};

export default function Hero({ images }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-6 pb-16 pt-28 sm:pt-32 lg:px-10">
      {/* Background gradient animé */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-[var(--color-ink)] via-[var(--color-charcoal)] to-[#2D1F1F]" />

      {/* Cercles lumineux flottants */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-float rounded-full bg-[var(--color-red-primary)]/20 blur-[100px]" />

      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 animate-float rounded-full bg-[var(--color-brass)]/10 blur-[80px]"
        style={{ animationDelay: "2s" }}
      />

      {/* Grille subtile */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-0">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 max-w-xl lg:order-none lg:col-start-1 lg:row-start-1 lg:self-end"
          >
            <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-red-primary)]">
              {t("hero.badge")}
            </span>

            {/* Logo + nom - mobile */}
            <Logo
              iconSize={96}
              stacked
              textClassName="text-2xl sm:text-4xl"
              className="mb-6 gap-3 lg:hidden"
            />

            {/* Logo + nom - desktop */}
            <Logo
              iconSize={150}
              stacked
              textClassName="text-5xl xl:text-6xl"
              className="mb-8 hidden gap-5 lg:flex"
            />

            <h1 className="font-display text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              {t("hero.titleLine1")} <br />
              <span className="text-gradient">
                {t("hero.titleHighlight")}
              </span>
            </h1>
          </motion.div>

          {/* Sous-titre + boutons (sous le carrousel sur mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="order-3 max-w-xl lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start"
          >
            <p className="max-w-md font-body text-lg leading-relaxed text-white/60 lg:mt-6">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#vehicules"
                className="btn-shine rounded-full bg-[var(--color-red-primary)] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-primary/30 transition-all hover:-translate-y-1 hover:bg-[var(--color-red-dark)]"
              >
                {t("hero.ctaVehicles")}
              </a>

              <a
                href="#contact"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10"
              >
                {t("hero.ctaContact")}
              </a>
            </div>
          </motion.div>

          {/* Carrousel photo */}
          <div className="order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <HeroCarousel images={images} />
          </div>
        </div>
      </div>
    </section>
  );
}