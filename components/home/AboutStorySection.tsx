"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

export default function AboutStorySection() {
  const { t, language } = useLanguage();

  const paragraphs: string[] = [...translations[language].aboutStory.paragraphs];

  return (
    <section className="relative overflow-hidden bg-[var(--color-cream)] py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* Carte logo (remplace la vidéo) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto aspect-[9/12] w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-ink)] via-[var(--color-charcoal)] to-[#2D1F1F] shadow-2xl"
        >
          {/* Lueur décorative */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red-primary)]/25 blur-[80px]" />

          {/* Grille subtile, même motif que le Hero */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative flex h-full w-full items-center justify-center p-10">
            <Image
              src="/ahmed-redcar-logo.png"
              alt="Ahmed Red Car"
              width={480}
              height={480}
              className="w-full max-w-[260px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            />
          </div>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-red-primary)]">
            {t("aboutStory.eyebrow")}
          </span>

          <h2 className="mt-3 font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            {t("aboutStory.title")}
          </h2>

          <span className="mt-4 block h-1 w-16 rounded-full bg-[var(--color-red-primary)]" />

          <div className="mt-6 flex flex-col gap-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="font-body leading-relaxed text-black/70">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
