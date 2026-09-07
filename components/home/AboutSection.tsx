
"use client";

import { Shield, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  const points = [
    { icon: Shield, text: t("about.points.verified") },
    { icon: MapPin, text: t("about.points.presence") },
    { icon: Clock, text: t("about.points.response") },
  ];

  return (
    <section id="a-propos" className="bg-[var(--color-mist)] py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            {t("about.title")}
          </h2>

          <p className="mt-4 font-body text-black/70">
            {t("about.text")}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {points.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-4 border-b border-black/10 pb-6 last:border-0 last:pb-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-red-primary)]/30 bg-white text-[var(--color-red-primary)]">
                <Icon size={20} />
              </span>

              <span className="font-body text-black/80">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

