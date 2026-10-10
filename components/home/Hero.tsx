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
    <section className="relative flex flex-col justify-start overflow-hidden px-5 pb-10 pt-6 sm:min-h-[100dvh] sm:justify-center sm:px-6 sm:pb-16 sm:pt-32 lg:px-10">
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

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-14">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-10">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 max-w-xl text-center sm:text-left lg:order-none"
          >
            {/* Logo + nom - phone uniquement, centré */}
            <div className="relative mb-5 flex justify-center sm:hidden">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red-primary)]/30 blur-[50px]" />
              <Logo
                iconSize={72}
                stacked
                textClassName="text-2xl items-center"
                className="relative flex-col gap-3"
              />
            </div>

            <span className="mb-5 inline-block rounded-full sm:mb-6 border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-red-primary)]">
              {t("hero.badge")}
            </span>

            {/* Logo + nom - tablette */}
            <Logo
              iconSize={96}
              stacked
              textClassName="text-2xl sm:text-4xl"
              className="mb-6 hidden gap-3 sm:flex lg:hidden"
            />

            {/* Logo + nom - desktop */}
            <Logo
              iconSize={150}
              stacked
              textClassName="text-5xl xl:text-6xl"
              className="mb-8 hidden gap-5 lg:flex"
            />

            <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              {t("hero.titleLine1")} <br />
              <span className="text-gradient">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-white/60 sm:mx-0 sm:mt-6 sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 hidden flex-wrap gap-4 sm:flex">
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
          <div className="order-2 lg:order-none">
            <HeroCarousel images={images} />

            {/* Boutons - mobile uniquement, sous le carrousel */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:hidden">
              <a
                href="#vehicules"
                className="btn-shine rounded-full bg-[var(--color-red-primary)] px-4 py-3.5 text-center text-sm font-bold text-white shadow-xl shadow-red-primary/30 transition-all hover:bg-[var(--color-red-dark)]"
              >
                {t("hero.ctaVehicles")}
              </a>

              <a
                href="#contact"
                className="rounded-full border border-white/20 bg-white/5 px-4 py-3.5 text-center text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                {t("hero.ctaContact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}