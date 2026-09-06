"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BookingBar from "@/components/home/BookingBar";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-6 pt-28 pb-16 sm:pt-32 lg:px-10">
      {/* Background gradient animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ink)] via-[var(--color-charcoal)] to-[#2D1F1F] animate-gradient" />
      
      {/* Cercles lumineux flottants */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--color-red-primary)]/20 blur-[100px] animate-float" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[var(--color-brass)]/10 blur-[80px] animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Grille subtile */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <span className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wider text-[var(--color-red-primary)] uppercase mb-6">
              Location de voitures au Maroc
            </span>
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              Votre voyage <br />
              <span className="text-gradient">commence ici.</span>
            </h1>
            <p className="mt-6 max-w-md font-body text-lg text-white/60 leading-relaxed">
              Louez le véhicule idéal pour vos déplacements, vos voyages et vos aventures au Maroc. Flotte premium, prix transparents.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#vehicules" className="rounded-full bg-[var(--color-red-primary)] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-primary/30 transition-all hover:bg-[var(--color-red-dark)] hover:-translate-y-1 btn-shine">
                Voir les véhicules
              </a>
              <a href="#contact" className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1">
                Nous contacter
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="absolute h-72 w-72 rounded-full bg-[var(--color-red-primary)]/30 blur-[80px]" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl">
              <Image
                src="/ahmed-redcar-logo.png"
                alt="Ahmed Red Car"
                width={400}
                height={220}
                className="relative w-full max-w-xs sm:max-w-sm drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <BookingBar />
        </motion.div>
      </div>
    </section>
  );
}