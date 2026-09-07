"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function VehicleNotFound() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 pt-32 text-center">
      <h1 className="font-display text-3xl font-extrabold text-[var(--color-ink)]">
        {t("vehicleDetail.notFoundTitle")}
      </h1>
      <p className="max-w-sm font-body text-black/60">
        {t("vehicleDetail.notFoundText")}
      </p>
      <Link
        href="/vehicules"
        className="inline-flex items-center gap-2 border border-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
      >
        <ArrowLeft size={16} />
        {t("vehicleDetail.seeAll")}
      </Link>
    </main>
  );
}