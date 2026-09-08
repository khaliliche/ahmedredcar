"use client";

import { PlaneTakeoff } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DeliveryBanner() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-[var(--color-red-primary)] py-2.5">
      <div className="pointer-events-none absolute inset-0 opacity-10 btn-shine" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 text-center">
        <PlaneTakeoff className="h-4 w-4 shrink-0 text-white" strokeWidth={2.25} />
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-white sm:text-sm">
          {t("deliveryBanner.text")}
        </p>
      </div>
    </div>
  );
}