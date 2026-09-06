"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Youssef B.", text: "Service impeccable, voiture propre et récupérée à l'heure. Je recommande vivement !", rating: 5 },
  { name: "Sara M.", text: "Réservation ultra simple via WhatsApp, réponse rapide et prix clair dès le départ.", rating: 5 },
  { name: "Karim T.", text: "Deuxième location avec Ahmed Red Car, toujours au top pour les road trips au Maroc.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-mist)] to-[var(--color-cream)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[var(--color-red-primary)] text-sm font-bold uppercase tracking-wider">Témoignages</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-[var(--color-ink)]">
            Ce que disent nos clients
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl bg-white p-8 shadow-xl shadow-black/5 border border-black/5 hover:shadow-2xl hover:shadow-black/10 transition-shadow duration-500"
            >
              <Quote className="absolute right-6 top-6 text-[var(--color-red-primary)]/10" size={48} fill="currentColor" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-gold)" className="text-[var(--color-gold)]" />
                ))}
              </div>
              <p className="font-body text-black/70 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--color-red-primary)] flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <span className="font-display text-sm font-bold text-[var(--color-ink)]">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}