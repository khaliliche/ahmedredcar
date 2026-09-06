"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BookingBar from "@/components/home/BookingBar";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--color-ink)] px-6 pt-32 pb-16 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(193,18,31,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(139,0,0,0.2), transparent 50%)",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="speed-lines"
            width="120"
            height="4"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)"
          >
            <rect width="90" height="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#speed-lines)" />
      </svg>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Votre voyage commence ici.
            </h1>
            <p className="mt-6 max-w-md font-body text-base text-white/70 sm:text-lg">
              Louez le véhicule idéal pour vos déplacements, vos voyages et vos
              aventures au Maroc.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div
              aria-hidden
              className="absolute h-64 w-64 rounded-full bg-[var(--color-red-primary)]/20 blur-3xl"
            />
            <Image
              src="/ahmed-redcar-logo.png"
              alt="Ahmed Red Car"
              width={420}
              height={224}
              className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md"
              priority
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <BookingBar />
        </motion.div>
      </div>
    </section>
  );
}