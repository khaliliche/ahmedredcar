"use client";

import { Search, CalendarCheck, KeyRound, MapPinned } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t("howItWorks.steps.0.title"),
      text: t("howItWorks.steps.0.text"),
    },
    {
      icon: CalendarCheck,
      title: t("howItWorks.steps.1.title"),
      text: t("howItWorks.steps.1.text"),
    },
    {
      icon: KeyRound,
      title: t("howItWorks.steps.2.title"),
      text: t("howItWorks.steps.2.text"),
    },
    {
      icon: MapPinned,
      title: t("howItWorks.steps.3.title"),
      text: t("howItWorks.steps.3.text"),
    },
  ];

  return (
    <section
      id="comment-ca-marche"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
    >
      <div className="max-w-lg">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
          {t("howItWorks.title")}
        </h2>
        <p className="mt-2 font-body text-sm text-black/60 sm:mt-3 sm:text-base">
          {t("howItWorks.subtitle")}
        </p>
      </div>

      <div className="relative mt-10 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-5 hidden border-t-2 border-dashed border-black/15 lg:block"
        />

        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="relative flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center bg-[var(--color-ink)] font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <Icon className="text-[var(--color-red-primary)]" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-[var(--color-ink)] sm:text-lg">
              {title}
            </h3>
            <p className="font-body text-sm leading-relaxed text-black/60">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}