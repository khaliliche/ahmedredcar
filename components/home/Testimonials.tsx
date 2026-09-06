"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Youssef B.",
    text: "Service impeccable, voiture propre et récupérée à l'heure. Je recommande vivement !",
    rating: 5,
  },
  {
    name: "Sara M.",
    text: "Réservation ultra simple via WhatsApp, réponse rapide et prix clair dès le départ.",
    rating: 5,
  },
  {
    name: "Karim T.",
    text: "Deuxième location avec Ahmed Red Car, toujours au top pour les road trips au Maroc.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-mist)] to-[#FBF8F2]" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--color-red-primary)]">
            Témoignages
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            Ce que disent nos clients
          </h2>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 sm:hidden snap-x-mandatory">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative w-[85vw] max-w-[340px] shrink-0 rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5 snap-start"
            >
              <Quote
                className="absolute right-4 top-4 text-[var(--color-red-primary)]/10"
                size={36}
                fill="currentColor"
              />
              <div className="mb-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    fill="var(--color-gold)"
                    className="text-[var(--color-gold)]"
                  />
                ))}
              </div>
              <p className="mb-4 font-body text-sm leading-relaxed text-black/70">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-red-primary)] text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <span className="font-display text-sm font-bold text-[var(--color-ink)]">
                  {t.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden gap-6 sm:grid sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-xl shadow-black/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/10 sm:p-8"
            >
              <Quote
                className="absolute right-6 top-6 text-[var(--color-red-primary)]/10"
                size={48}
                fill="currentColor"
              />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    fill="var(--color-gold)"
                    className="text-[var(--color-gold)]"
                  />
                ))}
              </div>
              <p className="mb-6 font-body text-sm leading-relaxed text-black/70 sm:text-base">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-red-primary)] text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <span className="font-display text-sm font-bold text-[var(--color-ink)]">
                  {t.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}