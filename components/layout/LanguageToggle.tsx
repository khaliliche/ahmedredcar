"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Language } from "@/lib/i18n/translations";

const options: Language[] = ["fr", "en", "ar"];

export default function LanguageToggle({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile" | "compact";
}) {
  const { language, setLanguage, t } = useLanguage();

  const baseButton =
    variant === "compact"
      ? "!min-h-0 rounded-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
      : "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors";

  const wrapperClass =
    variant === "desktop"
      ? "flex items-center gap-1 rounded-full border border-white/20 bg-white/5 p-1"
      : variant === "compact"
      ? "flex items-center gap-0.5 rounded-full border border-white/25 bg-white/10 p-0.5"
      : "flex items-center gap-1 rounded-full border border-white/20 bg-white/5 p-1 self-start";

  return (
    <div className={wrapperClass} role="group" aria-label="Language switcher">
      {options.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`${baseButton} ${
            language === lang
              ? "bg-[var(--color-red-primary)] text-white"
              : "text-white/60 hover:text-white"
          }`}
          aria-pressed={language === lang}
        >
          {t(`languageToggle.${lang}`)}
        </button>
      ))}
    </div>
  );
}