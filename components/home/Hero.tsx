"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BookingBar from "@/components/home/BookingBar";

export default function Hero() {
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
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 max-w-xl lg:order-none"
          >
            <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-red-primary)]">
              Location de voitures au Maroc
            </span>

            <h1 className="font-display text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              Votre voyage <br />
              <span className="text-gradient">commence ici.</span>
            </h1>

            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-white/60">
              Louez le véhicule idéal pour vos déplacements, vos voyages et
              vos aventures au Maroc. Flotte premium, prix transparents.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#vehicules"
                className="btn-shine rounded-full bg-[var(--color-red-primary)] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-primary/30 transition-all hover:-translate-y-1 hover:bg-[var(--color-red-dark)]"
              >
                Voir les véhicules
              </a>

              <a
                href="#contact"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10"
              >
                Nous contacter
              </a>
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="order-1 relative flex items-center justify-center lg:order-none lg:justify-end"
          >
            <div className="absolute h-72 w-72 rounded-full bg-[var(--color-red-primary)]/30 blur-[80px]" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
              <Image
                src="/ahmed-redcar-logo.png"
                alt="Ahmed Red Car"
                width={400}
                height={220}
                className="relative w-full max-w-xs drop-shadow-2xl sm:max-w-sm"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Barre de réservation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: "easeOut",
          }}
        >
          <BookingBar />
        </motion.div>
      </div>
    </section>
  );
}