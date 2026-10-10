"use client";

import { motion } from "framer-motion";
import { Users, Wrench, Headset, Tag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrustIndicators() {
  const { t } = useLanguage();

  const items = [
    { icon: Users, value: "500", label: t("trust.clients"), suffix: "+" },
    { icon: Wrench, value: "100", label: t("trust.maintained"), suffix: "%" },
    { icon: Headset, value: t("trust.available"), label: t("trust.support"), suffix: "" },
    { icon: Tag, value: "0", label: t("trust.hiddenFees"), suffix: "" },
  ];

  return (
    <section className="relative overflow-hidden border-y border-black/5 bg-white py-10 sm:py-16">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 sm:grid-cols-4 sm:gap-8 sm:px-6 lg:px-10">
        {items.map(({ icon: Icon, value, label, suffix }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-[var(--color-cream)] px-3 py-5 text-center shadow-sm group sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-red-primary)] sm:bg-[var(--color-mist)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
              <Icon size={24} strokeWidth={2} />
            </div>
            <span className="font-display text-3xl font-extrabold text-[var(--color-ink)]">
              {value}<span className="text-[var(--color-red-primary)]">{suffix}</span>
            </span>
            <span className="font-body text-[13px] leading-snug text-black/60 font-medium sm:text-sm sm:text-black/50">{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}