"use client";

import { motion } from "framer-motion";
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

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10"
      >
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Votre voyage commence ici.
          </h1>
          <p className="mt-6 max-w-md font-body text-base text-white/70 sm:text-lg">
            Louez le véhicule idéal pour vos déplacements, vos voyages et vos
            aventures au Maroc.
          </p>
        </div>

        <BookingBar />
      </motion.div>
    </section>
  );
}
