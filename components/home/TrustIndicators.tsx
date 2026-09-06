"use client";

import { motion } from "framer-motion";
import { Users, Wrench, Headset, Tag } from "lucide-react";

const items = [
  { icon: Users, value: "500", label: "clients satisfaits", suffix: "+" },
  { icon: Wrench, value: "100", label: "véhicules entretenus", suffix: "%" },
  { icon: Headset, value: "7j/7", label: "assistance disponible", suffix: "" },
  { icon: Tag, value: "0", label: "frais cachés", suffix: "" },
];

export default function TrustIndicators() {
  return (
    <section className="relative overflow-hidden border-y border-black/5 bg-white py-16">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4 lg:px-10">
        {items.map(({ icon: Icon, value, label, suffix }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-3 text-center group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-mist)] text-[var(--color-red-primary)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
              <Icon size={24} strokeWidth={2} />
            </div>
            <span className="font-display text-3xl font-extrabold text-[var(--color-ink)]">
              {value}<span className="text-[var(--color-red-primary)]">{suffix}</span>
            </span>
            <span className="font-body text-sm text-black/50 font-medium">{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}